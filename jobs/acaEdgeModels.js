const baseData = require('../export/json/edgeData.json');
const { writeFile, flattenArray } = require('nodeutilz');
const { Parser } = require('json2csv');
const clipboardy = require('clipboardy');

const filePath0 = './export/json/edgeTypes.json';
const filePath1 = './export/csv/edgeTypes.csv';

const data = baseData.map(
  ({ enterprise: { enterpriseEdge, enterpriseName } }) => ({
    enterpriseEdge,
    enterpriseName,
  })
);

const result = data.map(({ enterpriseEdge, enterpriseName }) =>
  enterpriseEdge[0].map(({ name, modelNumber }) => ({
    enterpriseName,
    name,
    modelNumber,
  }))
); //?

const objectKeys = ['enterpriseName', 'name', 'modelNumber'];
const opts = { fields: objectKeys };

const myparseData = new Parser(opts);

const csv = myparseData.parse(flattenArray(result));

writeFile(filePath0, JSON.stringify(flattenArray(result), null, '\t'), 'utf8');
writeFile(filePath1, csv, 'utf8');
