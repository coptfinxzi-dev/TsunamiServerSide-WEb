const express = require("express");
const app = express();

let logs = {};

app.use((req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  if (!logs[ip]) {
    logs[ip] = { count: 0, lastSeen: Date.now() };
  }

  logs[ip].count++;
  logs[ip].lastSeen = Date.now();

  // jednoduchá detekce spam
  if (logs[ip].count > 50) {
    console.log("⚠️ Possible DDoS from:", ip);
  }

  next();
});

app.get("/", (req, res) => {
  res.send("Tsunami backend running");
});

app.get("/logs", (req, res) => {
  res.json(logs);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
