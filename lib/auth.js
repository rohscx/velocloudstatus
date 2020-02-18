const dotenv = require('dotenv').config();
const VeloAuthCode = require('./VeloAuthCode.js');

module.exports = function() {
  return new Promise((resolve, reject) => {
    const envData = process.env.VELO_AUTH;
    if ((envData.length = 0 | (envData === undefined)))
      reject({
        rejected: ['auth.js', 'bad security Key', 'process.env.VELO_AUTH'],
      });
    const authObj = JSON.parse(envData);
    const authOptions = authObj.map(({ method, url, uri, uName, uPass }) => {
      const requestObj = new VeloAuthCode(method, url, uri, uName, uPass);
      return requestObj;
    });
    resolve(authOptions);
  });
};
