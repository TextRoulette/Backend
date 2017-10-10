import * as Socket from "socket.io"

let io: SocketIO.Server = Socket();

let handler: (msg: string) => void = (msg) => {
    console.log(msg);
};

let namespace = io.of("guid");

io.on("connect", (socket: SocketIO.Socket) => {
    socket.on("chat message", handler);
});

export default io;