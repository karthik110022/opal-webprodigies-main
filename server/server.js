const express = require('express')
const app = express()
const axios = require('axios')
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require('cors')
const fs = require('fs');
const { Readable } = require('stream');
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3')
const OpenAI = require("openai")

const dotenv = require('dotenv')

dotenv.config()

app.use(cors())

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
});

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY
    },
    region: process.env.BUCKET_REGION
})

const io = new Server(server, {
    cors: {
        origin: process.env.ELECTRON_HOST,
        methods: ['GET', 'POST']
    }
});

let recordedChunks = []

io.on('connection', (socket) => {
    console.log('user connected'+ socket.id)
    socket.on('video-chunks', async (data) => {
        const writestream = fs.createWriteStream('temp_upload/' + data.filename)
        recordedChunks.push(data.chunks)
        const videoBlob = new Blob(recordedChunks, {type: 'video/webm; codecs=vp9'})
        const buffer = Buffer.from(await videoBlob.arrayBuffer())
        const readStream = Readable.from(buffer)

        readStream.pipe(writestream).on('finish', () => {
            console.log("chunk saved")
        })
    
    })
    socket.on('process-video', (data) => {
        recordedChunks = []
        fs.readFile('temp_upload/'+ data.filename, async (err, file) => {

        const processing = await axios.post(`${process.env.NEXT_API_HOST}recording/${data.userId}/processing`, {
                filename: data.filename,
            })

        if(processing.data.status !== 200) return console.log("Oops! something went wrong")
            
        const Key = data.filename
        const Bucket = process.env.BUCKET_NAME
        const ContentType = 'video/webm'
        const command = new PutObjectCommand({
            Key,
            Bucket,
            ContentType,
            Body: file
        })
        const fileStatus = await s3.send(command)

        if(fileStatus['$metadata'].httpStatusCode === 200) {
            console.log("video uploaded to aws")

            //start transciption for pro plan
            //check plan serversize to stop fake client side authorization
            if(processing.data.plan === "PRO") {
                fs.stat('temp_upload/' + data.filename, async (err, stat) => {
                    if(!err) {
                        //wisper is restricted to 25mb uploads to avoid errors
                        //add a check for file size before transcribing
                        if(stat.size < 25000000) {
                            const transciption = await openai.audio.transcriptions.create({
                            file: fs.createReadStream(`temp_upload/${data.filename}`),
                            model: "whisper-1",
                            response_format: "text"
                        })

                        if(transciption) {
                            const completion = await openai.chat.completions.create({
                                model: 'gpt-3.5-turbo',
                                response_format: { type: "json_object" },
                                messages: [
                                    {role: 'system', content: `You are going to generate a title and a nice description using the speech to text transcription provided: transcription(${transciption}) and then return it in json format as {"title": <the title you gave>, "summery": <the summary you created>}`}
                                ]
                            })

                            const titleAndSummeryGenerated = await axios.post(`${process.env.NEXT_API_HOST}recording/${data.userId}/transcribe`, {
                                filename: data.filename,
                                content: completion.choices[0].message.content,
                                transcript: transciption
                            })

                            if(titleAndSummeryGenerated.data.status !== 200) console.log("Oops! something went wrong")
                            }
                        }
                    }
                })
            }

            const stopProcessing = await axios.post(`${process.env.NEXT_API_HOST}recording/${data.userId}/complete`, {
                filename: data.filename,
            })

            if(stopProcessing.data.status !== 200) return console.log("Oops! something went wrong")

            if(stopProcessing.status === 200) {
                fs.unlink('temp_upload/' + data.filename, (err) => {
                if(!err) console.log(data.filename + ' ' + 'deleted successfully!')
            })
            }
        }
        else {
            console.log("Upload failed! process aborted")
        }
    })
    })
    socket.on("disconnect", () => {
        console.log(socket.id + " " + "disconnected")
    })
})


server.listen(5002, () => console.log('listening to port 5002'))