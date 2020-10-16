var app = require('express')();
export var http = require('http').createServer(app); //se crea un server aparte para poder dejar el web socket funcioando en otro puerto
export var io = require('socket.io')(http);

// abre un segundo web socket para re-trasmitir la data a la aplicacion client
// lee la data desde global.Actualdata y si detecta cambios
// emite un mensaje dataupdate con los precios nuevos
var prev = global.Actualdata;
var prevOrders = global.orders;
var prevPositions = global.positions;

export const runRetransmiter = function () {
    io.on('connection', (socket) => {
        console.log('a user connected');
        if(global.orders){
            console.log('sending oders' );
            socket.emit('odersupdate', global.orders);
        }

        emitQuoteUpdate(socket);
        emitOrdersUpdate(socket);
        emitPositionsUpdate(socket);

        socket.on('disconnect', () => {
            // console.log('user disconnected');
        });
    });

    http.listen(4000, () => {
        console.log('wsio re transmiter is listening on port: 4000'); // deja el websocket funcionado en el puerto 4000
    });
};

function emitQuoteUpdate(socket) {
    setInterval(function () {
        if (JSON.stringify(global.Actualdata) !== JSON.stringify(prev)) {
            // console.log('sending quoteupdate');
            socket.emit('quoteupdate', global.Actualdata);
            prev = global.Actualdata;
        } else {
            // console.log('no updates')
        }
    }, 2000);
}

function emitPositionsUpdate(socket) {
    setInterval(function () {
        if (JSON.stringify(global.positions) !== JSON.stringify(prevPositions)) {
            // console.log('sending dataupdate');
            socket.emit('positionsupdate', global.positions);
            prevPositions = global.positions;
        } else {
            // console.log('no updates')
        }
    }, 2000);
}

function emitOrdersUpdate(socket) {
    var orders = [];
    setInterval(function () {
        if (JSON.stringify(global.orders) !== JSON.stringify(prevOrders)) {
            if (typeof global.deletedOrders !== "undefined" && global.deletedOrders !== null){
                global.orders.forEach((orderId, index) => {
                    if(!global.deletedOrders.includes(orderId)){
                        orders.push(global.orders[index]);
                    }
                });
            }
            if(orders.length > 0){
                console.log('sending odersupdate');
                socket.emit('odersupdate', orders);
                prevOrders = global.orders;
            }
        } else {
            // console.log('no updates')
        }
    }, 2000);
}