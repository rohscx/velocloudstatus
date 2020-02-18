const request = require('./request');

module.exports = async function(data) {
  return new Promise((resolve, reject) => {
    const getEnterprises = data;
    if (!getEnterprises)
      reject({
        rejected: [
          'enterpriseData.js',
          'bad data',
          ' const getEnterprises = data;',
        ],
      });
    const getEnterpriseEdges = Promise.all(
      getEnterprises.map(async d => {
        //console.log(JSON.stringify(d,null,'\t'))
        const { metaData, options, enterprise } = d;
        const { auth, symbol, routeHistory, sessionId } = metaData;
        const { enterpriseId, enterpriseEdge } = enterprise;
        const route =
          'https://vco18-usvi1.velocloud.net/portal/rest/enterprise/getEnterpriseConfigurations';
        routeHistory.push(options.url);
        routeHistory.push(route);
        options.body = {
          enterpriseId: enterpriseId,
          with: ['edgeCount', 'modules', 'refs'],
        };
        d.options.url = route;
        const data = await request(options);
        // console.log(data.body)
        // return console.log(Object.keys(data))
        enterpriseEdge.push(data.body);
        return { metaData, options, enterprise };
      })
    );
    resolve(getEnterpriseEdges);
  });
};
