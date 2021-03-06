
import * as Express from "express"
import * as Parser from "body-parser"
import * as Http from "http";

import userRouter from "./Routers/UserRouter"
import chatRouter from "./Routers/ChatRouter"
import Authority from "./Auth/Authority"
import io from "./Routers/SocketRouter"
import MatchMaker from "./Others/MatchMaker";

const app: Express.Application = Express();
const router: Express.Router = Express.Router();
const directory: any = {"root": __dirname + "/.."};

router.get("/", (req, res) => {
    res.sendFile("index.html", directory);
});

app.use((req, res, next) => { // Handle CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(Parser.json());
app.use("/", router);
app.use("/user", userRouter);
app.use("/chat", chatRouter);

let server: Http.Server = app.listen(3000);
io.listen(server);

console.log("Listening with <3 on port 3000");