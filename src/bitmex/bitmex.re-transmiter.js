var app = require('express')();
export var http = require('http').createServer(app); //se crea un server aparte para poder dejar el web socket funcioando en otro puerto
export var io = require('socket.io')(http);

// abre un segundo web socket para re-trasmitir la data a la aplicacion client
// lee la data desde global.Actualdata y si detecta cambios
// emite un mensaje dataupdate con los precios nuevos
var prev = global.Actualdata;

export const runRetransmiter = function () {
    io.on('connection', (socket) => {
        console.log('a user connected');

        setInterval(function () {
            if (JSON.stringify(global.Actualdata) !== JSON.stringify(prev)) {
                // console.log('sending dataupdate');
                socket.emit('dataupdate', global.Actualdata);
                prev = global.Actualdata;
            } else {
                // console.log('no updates')
            }
        }, 2000);

        socket.on('disconnect', () => {
            // console.log('user disconnected');
        });
    });

    http.listen(4000, () => {
        console.log('wsio re transmiter is listening on port: 4000'); // deja el websocket funcionado en el puerto 4000
    });
};