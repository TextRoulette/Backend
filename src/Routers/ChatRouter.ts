import {Router} from "express";
import MatchMaker from "../Others/MatchMaker";
import Authority from "../Auth/Authority";
import Token from "../Auth/Token";
import IUserRepository from "../Repositories/IUserRepository";
import UserRepository from "../Repositories/UserRepository";
import io from "./SocketRouter"

let chatRouter: Router = Router();
let matchmaker = new MatchMaker(5, 250);

let userRepository: IUserRepository = new UserRepository();

async function setupChatroom(uuid: string): Promise<void> {
    let namespace = io.of(`/${uuid}`) // Creating chat namespace
    namespace.removeAllListeners();
    namespace.on("connect", (socket: SocketIO.Socket) => {
        socket.removeAllListeners(); // Prevents duplicates
        socket.on("msg", (msg: string) => {
            console.log(msg);
            namespace.emit("msg", msg);
        });
    });
}

chatRouter.get("/", async (req, res) => {
    let accessToken: string = req.header("Authentication") as string;
    try {
        let token: Token = await Authority.authorize(accessToken);
        let uuid: string = await matchmaker.requestUuid();
        setupChatroom(uuid);
        userRepository.setChatId(token, uuid);
        res.statusCode = 200;
        let json = {"uuid": uuid}
        res.end(JSON.stringify(json));
    } catch (e) {
        let error = e as Error;
        switch(error.message) {
        case "No partner found":
            res.statusCode = 404;
            break;
        default:
            res.statusCode = 401;
        }
        res.end(error.message);
    }
});

export default chatRouter;