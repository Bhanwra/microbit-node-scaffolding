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

let microbitPort = null

io.on("connection", (socket) => {
    console.log(socket.connected)
    
    socket.on("output", (data) => {
        console.log(`Sending data to bit [status: ${microbitPort.isOpen}]: ${data}`)
    
        if ( microbitPort.isOpen ) {
            let output = microbitPort.write(data+"\n", 'ascii')
    
            console.log(`output: ${output}`)
        }
    })
})


SerialPort.list()
    .then(ports => {
        ports.forEach(port => {
            if ( (port.vendorId == "0D28" || port.vendorId == "0d28") && port.productId == "0204" ) {
                console.log(port)
                // __microbit_located__
                microbitPort = new SerialPort(port.path, {
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

                microbitPort.write("X\n")
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