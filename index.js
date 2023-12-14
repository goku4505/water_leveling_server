const express = require('express');
const expressWs = require('express-ws');
const app = express();

expressWs(app);

const port = 8000;
const AppClients = [];
const espClient = [];


//ESP32 MODULE CONNECTION TO THE WEB SERVICE
app.ws('/esp', (ws) => {
console.log('ESP32 connected');
espClient.push(ws);
               
ws.on('message', (message) => {
 console.log(`Received from ESP32: ${message}`);
 // Forward the message to all Mobile clients
   AppClients.forEach((flutterSocket) => {
   flutterSocket.send(message);
     });
   });
});
//ESP32 MODULE CONNECTION TO THE WEB SERVICE



//Mobile Application Connection to the web server
app.ws('/flutter', (ws) => {
  console.log('Flutter app connected');
  AppClients.push(ws);

  AppClients.forEach((flutterSocket) => {
    flutterSocket.send(`Connected`)
      });

  ws.on('message', (newMessage) => {
    console.log(`Received from Flutter app: ${newMessage}`);
    const message = newMessage.toString();
    espClient.forEach((espSocket) => {
      espSocket.send(message);
        });
  });
  ws.on('close', () => {
    console.log('Flutter app disconnected');
    AppClients.splice(AppClients.indexOf(ws), 1);
  });
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
