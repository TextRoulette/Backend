import User from "../Models/User"
import Token from "../Auth/Token";

export default interface IUserRepository {
    getUser(token: Token): Promise<User>;
    addUser(token: Token, user: User): Promise<boolean>;
    setChatId(token: Token, uuid: string): Promise<boolean>;
}