const { useLRU, ttlSeconds } = require("../config/cacheConfig");

let decisionCache;

if (useLRU) {
  const { LRUCache } = require("lru-cache");
  decisionCache = new LRUCache({
    max: 100,
    ttl: ttlSeconds * 1000,
    updateAgeOnGet: true
  });
} else {
  const NodeCache = require("node-cache");
  decisionCache = new NodeCache({
    stdTTL: ttlSeconds,
    checkperiod: 60
  });
}

module.exports = decisionCache;