import {
  getBitmexSwagger
} from './bitmex.swagger-client'

function onError(e) {
  console.error(e.response);
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
  // console.log('Inspecting BitMEX API...');
  // Object.keys(apis).forEach(function (model) {
  //   console.log(
  //     'Available methods for %s: %s',
  //     model,
  //     Object.keys(apis[model]).join(', ')
  //   );
  // });
}