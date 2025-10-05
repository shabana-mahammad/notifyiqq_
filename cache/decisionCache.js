const NodeCache = require("node-cache");
const decisionCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

module.exports = decisionCache;