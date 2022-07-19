function init(server) {
  const io = require("socket.io")(server, { cors: { origin: "*" } });
  io.on("connection", (socket) => {
    console.log("a user connected");
    
    socket.on("disconnect", (socket) => {
        console.log("a user disconnected");
      });
  });
  
}

module.exports = { init };
