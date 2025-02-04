const mqtt = require("mqtt");

class MqttHandler {
  constructor() {
    this.url = 'mqtt://mqtt.aisin-indonesia.co.id:1883';
  }

  connect() {
    this.mqttClient = mqtt.connect(this.url, { rejectUnauthorized: false });
    // this.mqttClient = mqtt.connect(this.url);

    this.mqttClient.on("error", (err) => {
      console.log("mqtt" + err);
      this.mqttClient.end();
    });

    this.mqttClient.on("connect", () => {
      console.log(`mqtt client connect`);
    });

    this.mqttClient.on("close", () => {
      console.log(`mqtt client disconnected`);
    });
  }

  sendMqtt(topic, message) {
    this.mqttClient.publish(topic, message, { qos: 1, retain: true });
  }
}

module.exports = MqttHandler;
