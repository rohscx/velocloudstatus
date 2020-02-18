module.exports = function(data) {
  return new Promise((resolve, reject) => {
    const vcoAuthResponse = data;
    if (!vcoAuthResponse)
      reject({
        rejected: [
          'enterpriseId.js',
          'bad data',
          'const vcoAuthResponse = data;',
        ],
      });
    const authResponse = vcoAuthResponse.map(data => {
      //console.log(data)
      const { metaData, options } = data;
      const { auth, symbol, routeHistory, sessionId } = metaData;
      const route =
        'https://vco18-usvi1.velocloud.net/portal/rest/enterprise/getEnterprise';
      routeHistory.push(options.url);
      routeHistory.push(route);
      if (auth === true) {
        options.body = {};
        options.url = route;
        options.headers.Cookie = sessionId;
        return { metaData, options };
      } else {
        return { metaData, options };
      }
    });
    resolve(authResponse);
  });
};
