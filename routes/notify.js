const express = require("express");
const router = express.Router();

const metrics = require("../cache/metrics");
const normalizeContext = require("../services/normalize");
const { shouldNotify, isQuietHours, recentlyActive } = require("../services/evaluator");
const decisionCache = require("../cache/decisionCache");

// POST /api/notify
router.post("/notify", (req, res) => {
  try {
    const contexts = req.body;

    if (!Array.isArray(contexts)) {
      return res.status(400).json({ error: "Expected an array of contexts" });
    }

    metrics.total_requests += contexts.length;
    const results = [];

    contexts.forEach((raw, index) => {
      if (!raw.user_id || !raw.timezone || !raw.last_active) {
        console.warn(`Entry ${index} is missing required fields → skipped`);
        results.push({
          user_id: raw.user_id || `entry_${index}`,
          error: "Missing required fields",
          should_notify: false,
          reason: "missing_fields"
        });
        return;
      }

      const context = normalizeContext(raw);
      const userId = context.user_id;

      let decision;
      let reason = null;

      if (decisionCache.has(userId)) {
        metrics.cache_hits += 1;
        decision = decisionCache.get(userId);
        console.log(`[${userId}] Cache HIT → ${decision}`);
      } else {
        metrics.cache_misses += 1;

        const quiet = isQuietHours(context);
        const recent = recentlyActive(context);

        if (quiet) reason = "quiet_hours";
        else if (recent) reason = "recent_activity";

        decision = reason === null;
        decisionCache.set(userId, decision);
        console.log(`[${userId}] Cache MISS → computed ${decision}`);
      }

      results.push({
        user_id: userId,
        should_notify: decision,
        ...(reason && { reason })
      });
    });

    res.json(results);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// GET /api/metrics
router.get("/metrics", (req, res) => {
  res.json(metrics);
});

router.post("/reset-metrics", (req, res) => {
  for (let key in metrics) {
    metrics[key] = 0;
  }
  res.json({ status: "Metrics reset" });
});

module.exports = router;