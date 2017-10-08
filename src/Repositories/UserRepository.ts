import IUserRepository from "./IUserRepository";
import Token from "../Auth/Token";
import User from "../Models/User";
import Database from "./Database";

export default class UserRepository implements IUserRepository {

    public constructor() {
        Database.connect();
    }

    public async getUser(token: Token): Promise<User> {
        let users: User[] = await Database.read({
            "id": token.sub
        }, "users") as User[];
        if (users.length != 1) {
            throw new Error("Not Found");
        }
        return users[0];
    }

    public async setChatId(token: Token, uuid: string): Promise<boolean> {
        return await Database.update({
            "id": token.sub
        }, {
            "chatId": uuid
        }, "users");
    }

}