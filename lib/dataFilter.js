module.exports = function(data, filterFunction, callBack) {
  return new Promise((resolve, reject) => {
    if (!data | !filterFunction)
      reject({
        rejected: [
          'dataFilter.js',
          'bad data in Parameters ',
          'data, filterFunction',
        ],
      });
    const result = data.filter(f => filterFunction(f));
    if (callBack) callBack(data);
    resolve(result);
  });
};
