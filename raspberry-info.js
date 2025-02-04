const os = require("os");
const { exec } = require("child_process");
const ping = require("ping");
var mqttHandler = new require("./config/mqtt_config.js");
var mqttClient = new mqttHandler();
mqttClient.connect();

async function getPing() {
  const host = "10.8.8.223"; // Google DNS
  const res = await ping.promise.probe(host);
  return res.alive ? `Ping: ${res.time} ms` : "No Network Connection";
}

// function getCpuTemperature() {
//   return new Promise((resolve, reject) => {
//     exec("vcgencmd measure_temp", (error, stdout) => {
//       if (error) {
//         reject("Error getting CPU temperature");
//       } else {
//         resolve(stdout.trim());
//       }
//     });
//   });
// }

function getUptime() {
  const uptimeSeconds = os.uptime();
  const days = Math.floor(uptimeSeconds / 86400);
  const hours = Math.floor((uptimeSeconds % 86400) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);

  return `Uptime: ${days}d ${hours}h ${minutes}m`;
}

function getSystemInfo() {
  return {
    hostname: os.hostname(),
    cpuUsage: os.loadavg()[0], // Beban CPU rata-rata dalam 1 menit
    freeMemory: `free : ${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
    totalMemory: `total : ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(
      2
    )} GB`,
    cpuCores: os.cpus().length,
    platform: os.platform(),
    arch: os.arch(),
    release: os.release(),
    cpuModel: os.cpus()[0].model,
    cpuCores: os.cpus().length,
  };
}

async function getRaspberryPiInfo() {
  try {
    const [pingResult, temp] = await Promise.all([
      getPing(),
      getCpuTemperature(),
    ]);
    const uptime = getUptime();
    const systemInfo = getSystemInfo();

    // console.log(pingResult);
    // console.log(temp);
    // console.log(uptime);
    // console.log(systemInfo);

    mqttClient.sendMqtt("TOROSS", JSON.stringify({
        systemInfo,
        pingResult,
        uptime,
        temp,
    }));
  } catch (error) {
    console.error("Error:", error);
  }
}

getRaspberryPiInfo();
