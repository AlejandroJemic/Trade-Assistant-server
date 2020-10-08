const BitMEXClient = require('bitmex-realtime-api');

// abre el websocket que consume los datos de bitmex
// el addstream quote obtiene los datos del precio actual
// la data del precio se esta guardando en global.Actualdata

export const runBitmexWSocketClient = function () {
    // See 'options' reference below
    const client = new BitMEXClient({
        apiKeyID: global.apiKeyID,
        apiKeySecret: global.apiKeySecret,
        testnet: false,
        maxTableLen: 10000,
    });
    client.on('error', console.error);
    client.on('open', () => console.log('Connection to bitmex web socket opened.'));
    client.on('close', () => console.log('Connection closed.'));
    client.on('initialize', () => console.log('Client to bitmex web socket initialized, ready to resive data.'));

    client.addStream('XBTUSD', 'quote', function (data, symbol, tableName) {
        // console.log(`Got update from bitmex for ${tableName}:${symbol}. Data:\n${JSON.stringify(data)}`);
        global.Actualdata = data[data.length - 1];
    });

    // client.addStream('XBTUSD', 'order', function (data, symbol, tableName) {
    //     //console.log(`Got update from bitmex for ${tableName}:${symbol}. Data:\n${JSON.stringify(data)}`);
    //     global.orders = data;
    // });

    // client.addStream('XBTUSD', 'position', function (data, symbol, tableName) {
    //     //console.log(`Got update from bitmex for ${tableName}:${symbol}. Data:\n${JSON.stringify(data)}`);
    //     global.position = data;
    // });
};