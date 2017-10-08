import {Router} from "express";
import MatchMaker from "../Others/MatchMaker";
import Authority from "../Auth/Authority";
import Token from "../Auth/Token";
import IUserRepository from "../Repositories/IUserRepository";
import UserRepository from "../Repositories/UserRepository";

let chatRouter: Router = Router();
let matchmaker = new MatchMaker(5, 250);

let userRepository: IUserRepository = new UserRepository();

chatRouter.get("/", async (req, res) => {
    let accessToken: string = req.header("Authentication") as string;
    try {
        let token: Token = await Authority.authorize(accessToken);
        let uuid: string = await matchmaker.requestUuid();
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