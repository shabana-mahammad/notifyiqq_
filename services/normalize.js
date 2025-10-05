const moment = require("moment-timezone");

function normalizeContext(data) {
  const { user_id, timezone, device, last_active } = data;
  const localTime = moment.tz(last_active, timezone);
  const utcTime = localTime.clone().tz("UTC");

  return {
    user_id,
    timezone,
    device,
    last_active: utcTime.toDate()
  };
}

module.exports = normalizeContext;