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
            description,
            configuration: {
              enterprise: { modules },
            },
          } = o;
          const firewall = modules[1];

          const { edgeSpecificData:{inbound} = {edgeSpecificData:{ data: []}} } = firewall;

          const getEdgeRules = data => {
            //return data.segments
            if (data) {
              if (data[0] && data[0].name) {
                // const rules = segments[0].rules;
                const simplifiedRules = data.map(
                  ({
                    name,
                    match: {sip, ssm, dip, dport_low, dport_high, svlan },
                    action: {
                      type,
                      nat:{lan_ip,lan_port,outbound},
                    },
                  }) => ({
                    name,
                    sip,
                    ssm,
                    dip,
                    dport_low,
                    dport_high,
                    svlan: svlan == -1 ? 'any' : svlan,
                    nat:{
                      lan_ip,
                      lan_port:lan_port == -1 ? 'any' : lan_port,
                      outbound
                    },
                    type,
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

          const rules = getEdgeRules(inbound);
          const combinedResult = { name, rules, enterpriseName, description };
          n.enterpriseName = `${enterpriseName}`;
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
        'rules.sip',
        'rules.ssm',
        'rules.dip',
        'rules.dport_low',
        'rules.dport_high',
        'rules.nat.lan_ip',
        'rules.nat.lan_port',
        'rules.nat.outbound',
        'rules.type',
      ];
      const json2csvParser = new Parser({ fields, unwind: ['rules'] });
      const csvData = json2csvParser.parse(combinedResult);
      return { csvData, enterpriseName };
    });
    resolve(csv);
  });
};
