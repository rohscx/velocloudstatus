module.exports = async function(data) {
  return new Promise((resolve, reject) => {
    const authResponse = data;
    if (!authResponse)
      reject({
        rejected: [
          'enterpriseData.js',
          'bad data',
          ' const authResponse = data;',
        ],
      });
    const getEnterprises = await Promise.all.map(
      authResponse
        .filter(f => f.auth === true)
        .map(async d => {
          //return console.log(JSON.stringify(d.options,null,'\t'))
          const { auth, symbol, options } = d;
          const data = await request(options);
          // console.log(data)
          // console.log(Object.keys(data))
          const { id, name, gatewayPoolId, accountNumber } = data.body;
          return {
            auth,
            symbol,
            options,
            enterprise: {
              enterpriseId: id,
              enterpriseName: name,
              enterpriseGatwayPoolId: gatewayPoolId,
              enterpriseAccountNumber: accountNumber,
            },
          };
        })
    );
    resolve(getEnterprises);
  });
};
