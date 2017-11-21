import IUserRepository from "./IUserRepository";
import Token from "../Auth/Token";
import User from "../Models/User";
import Database from "./Database";
import { setTimeout } from "timers";

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

    public async addUser(token: Token, user: User): Promise<boolean> {
        user.id = token.sub;
        return await Database.create(user, "users");
    }

    public async updateKarma(token: Token, karma: number): Promise<void> {
        let user = await this.getUser(token);
        user.karma += karma;
        if (user.karma < 0) {
            user.marked = true;
        }
        Database.update({
            "id": token.sub
        }, user, "users");
        setTimeout(() => {
            user.karma = 0;
            user.marked = false;
            Database.update({
                "id": token.sub
            }, user, "users");
        }, 300000);
    }

    public async setChatId(token: Token, uuid: string): Promise<boolean> {
        return await Database.update({
            "id": token.sub
        }, {
            "chatId": uuid
        }, "users");
    }

}