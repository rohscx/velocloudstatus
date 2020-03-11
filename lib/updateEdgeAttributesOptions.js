module.exports = function(data, sessionId) {
  return new Promise((resolve, reject) => {
    const vcoData = data;
    const vcoAuthentication = sessionId;
    if (!vcoData || !vcoAuthentication)
      reject({
        rejected: ['Missing: Include Both vcoData & vcoAuthentication'],
      });
    const authResponse = vcoData.map(
      ({ enterpriseId, id, targetName, name }) => {
        //console.log(data)
        const options = {
          method: 'POST',
          url:
            'https://vco18-usvi1.velocloud.net/portal/rest/edge​/updateEdgeAttributes',
          headers: {
            'Content-Type': 'application/json',
            Cookie: vcoAuthentication,
          },
          body: {
            id: id,
            enterpriseId: enterpriseId,
            _update: {
              name: targetName,
              description: name,
            },
          },
          json: true,
        };
        return { enterpriseId, id, targetName, name, options };
      }
    );
    resolve(authResponse);
  });
};
