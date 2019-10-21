const auth = require('./actions/auth.js');
const authCookie = require('./actions/authCookie.js');
const enterpriseIdOptions = require('./actions/enterpriseIdOptions.js');
const dataFilter = require('./actions/dataFilter.js');
const enterpriseId = require('./actions/enterpriseId.js');
const enterpriseEdge = require('./actions/enterpriseEdge.js');
const {objectKeyFilter, writeFile, flattenArray} = require('nodeutilz');

const filePath1 = './export/edgeData.txt';
const filePath2 = './export/downEdges.txt';
const filePath3 = './export/edgeMgmtIp.txt';
const fileEncoding = 'utf8';

auth()
    .then((t) => authCookie(t))
    .then((t) => dataFilter(t,(data) => data.metaData.auth == true))
    .then((t) => enterpriseIdOptions(t))
    .then((t) => enterpriseId(t))
    .then((t) => enterpriseEdge(t))
    .then((t) => objectKeyFilter(t,["enterprise"]))
    .then((t) => writeFile(filePath1,JSON.stringify(t),fileEncoding))
    .then(console.log)
    .catch(console.log)

auth()
    .then((t) => authCookie(t))
    .then((t) => dataFilter(t,(data) => data.metaData.auth == true))
    .then((t) => enterpriseIdOptions(t))
    .then((t) => enterpriseId(t))
    .then((t) => enterpriseEdge(t))
    .then((t) => objectKeyFilter(t,["enterprise"]))
    .then(t => Promise.all(flattenArray(t.map((d) => d.enterprise.enterpriseEdge.map((d) => d))).filter((f) => f.edgeState != "CONNECTED")))
    .then((t) => writeFile(filePath2,JSON.stringify(t),fileEncoding))
    .then(console.log)
    .catch(console.log)

auth()
    .then((t) => authCookie(t))
    .then((t) => dataFilter(t,(data) => data.metaData.auth == true))
    .then((t) => enterpriseIdOptions(t))
    .then((t) => enterpriseId(t))
    .then((t) => enterpriseEdge(t))
    .then((t) => objectKeyFilter(t,["enterprise"]))
    .then(t => Promise.all(flattenArray(t.map((d) => d.enterprise.enterpriseEdge.map((d) => d))).map((d) => ({name:d.name,mgmt:d.configuration.enterprise.modules[0].edgeSpecificData.lan.management,networks:d.name,mgmt:d.configuration.enterprise.modules[0].edgeSpecificData.lan.networks}))))
    .then((t) => writeFile(filePath3,JSON.stringify(t),fileEncoding))
    .then(console.log)
    .catch(console.log)




// const managementIp = allData.getEnterpriseEdgesGeneralData.map((d) => d.map((d) => {
//         const {edgeState,enterpriseId,name,managmentData} = d.enterpriseEdge;
//         return {edgeState,enterpriseId,name,managmentData,enterpriseId};
// })) 



