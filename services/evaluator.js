const moment = require("moment-timezone");
const metrics = require("../cache/metrics");
const rules = require("../config/rules.json");

function isQuietHours(context) {
  const localTime = moment.utc(context.last_active).tz(context.timezone);
  const hour = localTime.hour();
  const { start, end } = rules.quiet_hours;
  const quiet = hour >= start || hour < end;
  if (quiet) {
    console.log(`[${context.user_id}] Suppressed: Quiet hours`);
    metrics.suppressed_quiet_hours += 1;
  }
  return quiet;
}

function recentlyActive(context) {
  const nowUtc = moment.utc();
  const lastActive = moment.utc(context.last_active);
  const diff = nowUtc.diff(lastActive, "minutes");

  console.log(`[${context.user_id}] Last active ${diff} minutes ago`);

  const active = diff < rules.recent_activity_minutes;
  if (active) {
    console.log(`[${context.user_id}] Suppressed: Recently active`);
    metrics.suppressed_recent_activity += 1;
  }

  return active;
}

function shouldNotify(context) {
  const quiet = isQuietHours(context);
  const recent = recentlyActive(context);
  return !quiet && !recent;
}

module.exports = {
  shouldNotify,
  isQuietHours,
  recentlyActive
};