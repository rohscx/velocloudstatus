const auth = require('./actions/auth.js');
const authCookie = require('./actions/authCookie.js');
const enterpriseIdOptions = require('./actions/enterpriseIdOptions.js');
const dataFilter = require('./actions/dataFilter.js');
const enterpriseId = require('./actions/enterpriseId.js');
const enterpriseEdge = require('./actions/enterpriseEdge.js');
const authCheck = require('./actions/authCheck.js');
const {objectKeyFilter, writeFile, flattenArray} = require('nodeutilz');

const filePath1 = './export/edgeData.json';
const filePath2 = './export/downEdges.json';
const filePath3 = './export/edgeMgmtIp.json';
const filePath4 = './export/authCheck.json';
const fileEncoding = 'utf8';

// Validates that the API is reachable and returning good data about the target enterprise
const accountStatusCheck = true;
/*
// simple search using the results of the edgeData.json file
const siteSearch = (data,searchString) => {
    return data.map(({networks, name}) => ({name,networks:networks.filter(({cidrIp}) => cidrIp !== null).filter(({cidrIp}) => cidrIp.search(searchString) != -1)})).filter(({networks}) => networks.length > 0);
}
*/
if (accountStatusCheck) {
    auth()
    .then((t) => authCookie(t))
    .then(authCheck)
    .then((t) => writeFile(filePath4,JSON.stringify(t),fileEncoding))
    .then(console.log)
    .catch(console.log)
} else {
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
    .then(t => Promise.all(flattenArray(t.map((d) => d.enterprise.enterpriseEdge.map((d) => d))).map((d) => ({name: d.name, serial:d.serialNumber, mgmt: d.configuration.enterprise.modules[0].edgeSpecificData.lan.management, networks: d.configuration.enterprise.modules[0].edgeSpecificData.lan.networks, networks: d.configuration.enterprise.modules[0].edgeSpecificData.lan.networks}))))
    .then((t) => writeFile(filePath3,JSON.stringify(t),fileEncoding))
    .then(console.log)
    .catch(console.log)
}







// const managementIp = allData.getEnterpriseEdgesGeneralData.map((d) => d.map((d) => {
//         const {edgeState,enterpriseId,name,managmentData} = d.enterpriseEdge;
//         return {edgeState,enterpriseId,name,managmentData,enterpriseId};
// })) 



