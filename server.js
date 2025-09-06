const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const os = require('os');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Broadcast received messages
io.on('connection', socket => {
  console.log('Client connected');

  socket.on('message', msg => {
    console.log('Received:', msg);
    io.emit('message', msg); // Broadcast to all clients
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (let name in interfaces) {
    for (let iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://${getLocalIP()}:${PORT}`);
});
