const baseData = require('../export/json/edgeNetworks.json');
const { writeFile } = require('nodeutilz');
const { Parser } = require('json2csv');
const clipboardy = require('clipboardy');

Array.prototype.siteSearchIp = function(searchString) {
  return this.map(({ networks, name }) => ({
    name,
    networks: networks
      .filter(({ cidrIp }) => cidrIp !== null)
      .filter(({ cidrIp }) => cidrIp.search(searchString) != -1),
  })).filter(({ networks }) => networks.length > 0);
};

Array.prototype.siteSearchName = function(searchString) {
  return this.filter(
    ({ name }) => name.toLowerCase().search(searchString) != -1
  );
};

baseData.siteSearchIp('10.72.12'); //?
