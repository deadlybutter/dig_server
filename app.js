const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

const server = app.listen(process.env.PORT, function () {
  console.log(`Dig server running on ${process.env.PORT}`);
});

const io = require('socket.io')(server);
const events = ['CLIENT_JOIN', 'MAP_RECIEVE', 'ENTITY_LOCATION_CHANGE', 'ENTITY_ADD'];

io.on('connection', function (socket) {
  socket.join('testroom');
  socket.emit('SOCKET_ID', {socketId: socket.id, roomId: 'testroom'});

  events.forEach(eventName => {
    socket.on(eventName, data => {
      const destination = data._headers.to === 'all' ? data._headers.room : data._headers.to;
      socket.broadcast.to(destination).emit(eventName, data);
    });
  });
});
