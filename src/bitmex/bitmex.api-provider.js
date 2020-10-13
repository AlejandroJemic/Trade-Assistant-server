import {
  getBitmexSwagger
} from './bitmex.swagger-client'

function onError(e) {
  console.log('onError handled: ' + e.response);
  return e.response;
}
//retorna el margen disponible expresado en xbt
export var getMargin = async function () {
  var promiseBitmexClient = getBitmexSwagger(global.apiKeyID, global.apiKeySecret, true);
  return promiseBitmexClient.then(getMarginFromClient).catch(onError);
}

async function getMarginFromClient(client) {
  const marginResponse = await client.apis.User.User_getMargin();
  const margin = JSON.parse(marginResponse.data);
  const marginBalance = (margin.marginBalance / 1e8).toFixed(8);
  console.log('\nMargin Balance:', marginBalance, 'XBT');
  return {
    ok: true,
    data: {
      margin: marginBalance
    }
  };
}

export var cancelOrder = async function (data) {
  var promiseBitmexClient = getBitmexSwagger(global.apiKeyID, global.apiKeySecret, true);
  var client = await promiseBitmexClient.then((client) => {return client;}).catch(onError);
  var res =  await cancelOrderFromClient(client, data);
  console.log(res);
  return res;
}

async function cancelOrderFromClient(client, data) {
  var opts = { 
    'orderID':data,
    'clOrdID': "", 
    'text': "CANCELED BY ASSISTANT" 
  };
  try {
    var res = await client.apis.Order.Order_cancel(opts)
    if(res.ok){
      
      return {
        ok: true,
      data: {
          message: `order ${data} canceled ok`
        }
      };
    }
  } catch (e) {
   
    return {
      ok: false,
      data: {
        message: e
      }
    }
  }
}




// retorna las entidades y los metodos disponibles
export var getInspectApis = async function () {
  var promiseBitmexClient = getBitmexSwagger(global.apiKeyID, global.apiKeySecret, true);
  promiseBitmexClient.then(InspectApisFromClient).catch(onError);
}

async function InspectApisFromClient(client) {
  inspect(client.apis);
}

function inspect(apis) {
  console.log(apis);
  console.log('Inspecting BitMEX API...');
  Object.keys(apis).forEach(function (model) {
    console.log(
      'table %s: methods %s',
      model,
      Object.keys(apis[model]).join(', ')
    );
  });
}