import {Router} from "express"
import Authority from "../Auth/Authority"
import User from "../Models/User"
import IUserRepository from "../Repositories/IUserRepository"
import Token from "../Auth/Token";
import UserRepository from "../Repositories/UserRepository";

let userRouter: Router = Router();
let userRepository: IUserRepository = new UserRepository();

userRouter.get("/", async (req, res) => {
    let accessToken: string = req.header("Authentication") as string;
    try {
        let token: Token = await Authority.authorize(accessToken);
        let user: User = await userRepository.getUser(token);
        delete user.id; //Frontend must not care
        res.statusCode = 200;
        res.send(user);
    } catch (e) {
        let err = e as Error;
        if (err.message = "Not Found") {
            res.statusCode = 404;
        } else {
            res.statusCode = 401;
        }
        res.end(err.message);
    }
});

userRouter.post("/", async (req, res) => {
    let accessToken: string = req.header("Authentication") as string;
    try {
        let token: Token  = await Authority.authorize(accessToken);
        let user: User = req.body;
        userRepository.addUser(token, user);
        res.statusCode = 201;
        res.end();
    } catch (e) {
        let err = e as Error;
        res.statusCode = 401;
        res.end(err.message);
    }
});

export default userRouter;