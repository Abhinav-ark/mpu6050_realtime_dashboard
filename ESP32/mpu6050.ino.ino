#include <Adafruit_MPU6050.h>
#include <Wire.h>
#include <WiFi.h>
#include <ArduinoWebsockets.h>

const char* ssid = "R1";
const char* password = "rpi12345";
const char* webSocketServerAddress = "ws://192.168.47.29:5000/sendSensorData";

using namespace websockets;
WebsocketsClient webSocket;

Adafruit_MPU6050 mpu;

void setup() {
  Serial.begin(115200);

  delay(1000);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected to WiFi");
  
  webSocket.connect(webSocketServerAddress);

  int status = mpu.begin();
  if (!status) {
    Serial.println("Could not init MPU 6050!");
    while(1) {
      sleep(100);
    }
  }
  Serial.println("Inited MPU 6050");
}

void loop() {
  sensors_event_t a, g, t;
  mpu.getEvent(&a, &g, &t);
  Serial.print("Acceleration (m/s^2): X: ");
  Serial.print(a.acceleration.x);
  Serial.print("    Y: ");
  Serial.print(a.acceleration.y);
  Serial.print("    Z: ");
  Serial.println(a.acceleration.z);
  Serial.print("Gyroscope (rad/s): X: ");
  Serial.print(g.gyro.x);
  Serial.print("    Y: ");
  Serial.print(g.gyro.y);
  Serial.print("    Z: ");
  Serial.println(g.gyro.z);
  
  webSocket.send("{\"value1\":"+String(g.gyro.x,2)+",\"value2\":"+String(g.gyro.y,2)+",\"value3\":"+String(g.gyro.z,2)+",\"value4\":"+String(a.acceleration.x,2)+",\"value5\":"+String(a.acceleration.y,2)+",\"value6\":"+String(a.acceleration.z,2)+"}");

  delay(1000);
}