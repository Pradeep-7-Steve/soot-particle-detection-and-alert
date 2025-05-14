#include <FirebaseESP8266.h>  // Include the Firebase library for ESP8266

#define FIREBASE_HOST "your-firebase-host.firebaseio.com"  // Your Firebase database URL
#define FIREBASE_AUTH "your-firebase-auth-token"  // Your Firebase authentication token

#define MQ2_PIN A0  // Analog pin connected to MQ2 sensor
#define READ_INTERVAL 5000  // Read interval in milliseconds

FirebaseData firebaseData;  // Firebase data object

void setup() {
  Serial.begin(9600);
  pinMode(MQ2_PIN, INPUT);
  
  // Initialize Firebase
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
}

void loop() {
  // Read sensor data
  float sensorValue = analogRead(MQ2_PIN);
  
  // Calculate estimated carbon level (example formula)
  float carbonLevel = map(sensorValue, 0, 1023, 0, 1000);  // Assuming sensor range is 0-1000 ppm
  
  // Calculate estimated air quality (example formula)
  float airQuality = map(sensorValue, 0, 1023, 0, 100);  // Assuming sensor range is 0-100%

  // Print sensor readings
  Serial.print("Carbon Level: ");
  Serial.print(carbonLevel);
  Serial.print(" ppm, Air Quality: ");
  Serial.print(airQuality);
  Serial.println("%");

  // Send data to Firebase
  if (Firebase.pushFloat(firebaseData, "/carbonLevel", carbonLevel) && 
      Firebase.pushFloat(firebaseData, "/airQuality", airQuality)) {
    Serial.println("Data sent to Firebase successfully!");
  } else {
    Serial.println("Failed to send data to Firebase.");
    Serial.println("Error: " + firebaseData.errorReason());
  }

  delay(READ_INTERVAL);  // Wait before reading again
}
