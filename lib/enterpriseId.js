const request = require('./request');
// This should problably be a promise
module.exports = function(data) {
  const authResponse = data;
  if (!data)
    reject({
      rejected: ['enterpriseId.js', 'bad data in Parameters ', 'data'],
    });
  return Promise.all(
    authResponse.map(d => {
      return new Promise(async (resolve, reject) => {
        //return console.log(JSON.stringify(d.options,null,'\t'))
        const { metaData, options } = d;
        const { auth, symbol, routeHistory, sessionId } = metaData;
        const response = await request(options);
        // console.log(data)
        // console.log(Object.keys(data))
        const statusCode = +response.statusCode;
        if (statusCode !== 200) reject(response);
        const { id, name, gatewayPoolId, accountNumber } = response.body;
        const enterpriseEdge = [];
        resolve({
          metaData,
          options,
          enterprise: {
            enterpriseId: id,
            enterpriseName: name,
            enterpriseGatwayPoolId: gatewayPoolId,
            enterpriseAccountNumber: accountNumber,
            enterpriseEdge,
          },
        });
      });
    })
  );
};
