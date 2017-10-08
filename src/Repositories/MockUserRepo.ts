import IUserRepository from "./IUserRepository"
import User from "../Models/User";
import Token from "../Auth/Token";

export default class MockUserRepo implements IUserRepository {

    public async getUser(token: Token): Promise<User> {
        return Promise.resolve<User>({
            username: "Chris",
            id: "some guid af",
            karma: 5.0,
            languages: ["spanish", "english"]
        });
    }

}