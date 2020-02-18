const { Parser } = require('json2csv');
module.exports = function(data) {
  return new Promise(resolve => {
    const result = data.map(d => {
      const {
        enterprise: { enterpriseEdge, enterpriseName },
      } = d;
      csvEnterpriseName = enterpriseName;
      return enterpriseEdge[0].reduce(
        (n, o) => {
          const {
            name,
            configuration: {
              enterprise: { modules },
            },
          } = o;
          const qos = modules[2];

          const { edgeSpecificData = { edgeSpecificData: [] } } = qos;

          const getEdgeRules = data => {
            //return data.segments
            if (data.segments) {
              const { segments } = data;
              if (segments[0] && segments[0].rules) {
                const rules = segments[0].rules;
                const simplifiedRules = rules.map(
                  ({
                    name,
                    match: { dip, svlan },
                    action: {
                      edge2CloudRouteAction: { routePolicy },
                    },
                  }) => ({
                    name,
                    dip,
                    svlan: svlan == -1 ? 'any' : svlan,
                    routePolicy:
                      routePolicy == 'backhaul' ? 'backhaul' : 'direct',
                  })
                );
                return simplifiedRules;
              } else {
                return [];
              }
            } else {
              return [];
            }
            //return data.filter((f) => f.segments)
          };
          const rules = getEdgeRules(edgeSpecificData);
          const combinedResult = { name, rules, enterpriseName };
          n.enterpriseName = enterpriseName;
          n.combinedResult.push(combinedResult);
          return n;
        },
        { combinedResult: [] }
      );
    });
    //.filter((f) => f.rules.length > 0);//?
    const csv = result.map(({ enterpriseName, combinedResult }) => {
      const fields = [
        'enterpriseName',
        'name',
        'rules.name',
        'rules.dip',
        'rules.svlan',
        'rules.routePolicy',
      ];
      const json2csvParser = new Parser({ fields, unwind: ['rules'] });
      const csvData = json2csvParser.parse(combinedResult);
      return { csvData, enterpriseName };
    });
    resolve(csv);
  });
};
