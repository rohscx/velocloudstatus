const request = require('./request');

module.exports = async function(data) {
  return new Promise((resolve, reject) => {
    const getEnterprises = data;
    const testEmpty = [];
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
        const { enterpriseId, enterpriseEdge , enterpriseName} = enterprise;
        const addedData = enterpriseEdge[0].map((d) => ({metaData,options,...d}))
        return  Promise.all(addedData.map(async (d) => {
          const { metaData, options, enterprise ,id,name} = d;
          const { auth, symbol, routeHistory, sessionId } = metaData;
          const route =
          'https://vco18-usvi1.velocloud.net/portal/rest/edge/getEdgeConfigurationStack';
        routeHistory.push(options.url);
        routeHistory.push(route);
        options.body = {
          enterpriseId: enterpriseId,
          with: ["QOS","modules","deviceSettings","refs"],
          edgeId: id,
        };
        d.options.url = route;
        const data = await request(options);
        const addedData = data.body.map((d) => ({edgeName:name,enterpriseName, ...d}));
        testEmpty.push(...addedData);
        return { testEmpty};
        }))

      })
    );
    resolve(getEnterpriseEdges);
  });
};
