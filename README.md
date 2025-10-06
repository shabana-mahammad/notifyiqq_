# NotifyIQ 🧠📬  
NotifyIQ is a modular backend system for intelligent notification delivery, built with Node.js and Express.js. It features smart LRU caching, real-time metrics tracking, and a clean architecture designed for clarity, observability, and demo polish.

## 🚀 Features
- **Modular Routing**: Clean separation via `routes/` and `services/`
- **Smart Caching**: Integrated `node-cache` with LRU logic
- **Metrics Endpoint**: `/api/metrics` exposes cache stats and uptime
- **Demo-Ready**: Clear structure for testing and showcasing

📌 API Endpoints
GET /api/notify
- Triggers notification logic
- Uses cache for repeated requests
GET /api/metrics
- Returns system metrics (uptime, cache stats)

🧪 Postman Testing
- Import endpoints into Postman
- Test /api/notify for cache behavior
- Test /api/metrics for observability
- Use Postman console to inspect headers and response time

📦 Tech Stack
- Node.js + Express.js
- node-cache + LRU
- Modular architecture

## 🛠️ Setup
```bash
git clone https://github.com/shabana-mahammad/notifyiqq_.git
cd notifyiqq_
npm install
npm start
