const http = require('http')

const hostname = '127.0.0.1'
const port = '3000'

const express = require("express")
const app = express()
const server = http.createServer(app)

const path = require('path')

const io = require('socket.io')(server)

const SerialPort = require('serialport')
const Readline = SerialPort.parsers.Readline

io.on("connection", (socket) => {
    console.log(socket.connected)
})

SerialPort.list()
    .then(ports => {
        ports.forEach(port => {
            if ( port.manufacturer == "Microsoft" && port.productId == "0204" ) {
                console.log(port)
                // __microbit_located__
                const microbitPort = new SerialPort(port.path, {
                    baudRate: 115200,
                    autoOpen: false
                })
                const parser = new Readline();
                microbitPort.pipe(parser);
            
                microbitPort.open(() => {
                    console.log("Port open");
                    parser.on('data', (data) => {
                        io.emit("action", data)
                    });
                })
            }
        })
    })
    .catch(err => {

    })

app.use(express.static(path.join(__dirname, 'assets')))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

server.listen(port, hostname, () => {
    console.log(`Server running @ http://${hostname}:${port}/`)
})