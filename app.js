const express = require('express');
const app = express();
const port = 3000;

const server = app.listen(port, () => console.log(`Example API listening on port ${port}!`));
// const server = require('http').createServer(app);
const io = require('socket.io')(server);


io.on('connection', function (socket) {
    console.info("User connected");

    socket.on('chat message', function (message) {
        io.emit('chat message', message);
        console.log(message);
    });
});

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});


// server.listen(port);
// module.exports = server;
