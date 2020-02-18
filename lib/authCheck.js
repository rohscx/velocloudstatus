module.exports = function(data, callBack) {
  return new Promise((resolve, reject) => {
    if (!data) reject({ rejected: ['authCheck.js', 'bad data', ' no Data'] });
    const statusCodes = data.reduce(
      (n, o) => {
        const { statusCode, symbol, auth } = o.metaData;
        let { success, failure } = n;
        if (auth === true) {
          success.push(symbol);
        } else {
          failure.push(symbol);
        }
        return n;
      },
      { success: [], failure: [] }
    );
    if (!callBack) {
      console.log(statusCodes);
    } else {
      callBack(statusCodes);
    }
    resolve(data);
  });
};
