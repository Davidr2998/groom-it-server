import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { addUser, getUsersInRoom, removeUser } from "./utils/users.js";

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("join", (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });

    if (error) {
      return callback(error);
    }
    //Join the room
    socket.join(user.room);

    //Emit the users in the room
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(`${user.username} has disconnected`);

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
