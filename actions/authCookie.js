const request = require('./request');

module.exports = function (data){
    return new Promise(async (resolve,reject) => {
        const vcoAuthOptions = data;
        if (!vcoAuthOptions) reject({rejected:["authCooke.js","bad data","const vcoAuthOptions = data;"]});
        const vcoAuthResponse = [];
        for (const auth of vcoAuthOptions) {
            const {options, symbol, routeHistory} = auth;
            const {username} = options.body;
            const response = await request(options);
            const statusCode = +response.statusCode;
            const sessionId = response.headers['set-cookie'].filter((f) => f.search("session") !== -1);
            if (statusCode !== 200) {
                vcoAuthResponse.push({ metaData:{statusCode, sessionId, auth: false, symbol, routeHistory}, options}) 
            } else {
                vcoAuthResponse.push({ metaData:{statusCode, sessionId, auth: true, symbol, routeHistory}, options})  
            }      
        }
        resolve(vcoAuthResponse);
    })
}