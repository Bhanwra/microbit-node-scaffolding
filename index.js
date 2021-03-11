const http = require('http')

const hostname = '127.0.0.1'
const port = '3000'

const fs = require('fs')


const SerialPort = require('serialport')
const Readline = SerialPort.parsers.Readline

const server = http.createServer((req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')

    SerialPort.list()
        .then(ports => {

            let output = ''

            ports.forEach(port => {

                if ( port.manufacturer == "Microsoft" && port.productId == "0204" ) {
                    // is the microbit
                    output += JSON.stringify(port)

                    const microbitPort = new SerialPort(port.path, {
                        baudRate: 115200,
                        autoOpen: false
                    })
                    const parser = new Readline();
                    microbitPort.pipe(parser);
                    
                    microbitPort.open(() => {
                        console.log("Port open");
                        parser.on('data', (data) => {
                            console.log('Received Data: ' + data.toString());
                        });
                    })
                }

            })
        })
        .catch(err => {
            if ( err ) throw err
            res.end(err)
        })

    fs.readFile('./index.html', (err, data) => {
        if ( err ) {
            res.statusCode(404)
            res.write(err)
        } else {
            res.write(data)
        }

        res.end()
    })
})

server.listen(port, hostname, () => {
    console.log(`Server running @ http://${hostname}:${port}/`)
})