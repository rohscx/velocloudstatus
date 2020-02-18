const baseData = require('../export/json/edgeData.json');
const { writeFile, flattenArray } = require('nodeutilz');
const { Parser } = require('json2csv');
const clipboardy = require('clipboardy');

const filePath0 = './export/json/missingForwarders.json';
const filePath1 = './export/csv/missingForwarders.csv';

const data = baseData.map(
  ({ enterprise: { enterpriseEdge } }) => enterpriseEdge
);
// const data = baseData.map(({enterprise:{enterpriseEdge}}) => enterpriseEdge.filter(({modelNumber}) => modelNumber !== "edge840")); // not needed, filters the 840s
const result = data.map(d =>
  d[0].map(({ name, configuration }) => ({
    name,
    networks: configuration.enterprise.modules[0].edgeSpecificData.lan.networks.map(
      ({ vlanId, dhcp }) => ({
        vlanId,
        dhcp: dhcp.dhcpRelay ? dhcp.dhcpRelay : [],
        relaySize: dhcp.dhcpRelay ? dhcp.dhcpRelay.servers.length : 0,
      })
    ),
  }))
); //?

//?
const vlanFilter = [...Array(4096).keys()]; //? Filters for these vlans!!
const missingRelay = flattenArray(result)
  .map(({ name, networks }) => ({
    name,
    smallNetworks: networks
      .filter(({ relaySize }) => relaySize < 2)
      .filter(f => vlanFilter.includes(f.vlanId)),
  }))
  .filter(({ smallNetworks }) => smallNetworks.length > 0);
const asString = JSON.stringify(missingRelay, null, '\t');

const objectKeys = [
  'name',
  'smallNetworks.vlanId',
  'smallNetworks.dhcp.servers',
  'smallNetworks.relaySize',
];
const opts = {
  fields: objectKeys,
  unwind: ['smallNetworks', 'smallNetworks.dhcp', 'smallNetworks.dhcp.servers'],
};

const myparseData = new Parser(opts);
const csv0 = myparseData.parse(missingRelay);
writeFile(filePath0, asString, 'utf8');
writeFile(filePath1, csv0, 'utf8');
