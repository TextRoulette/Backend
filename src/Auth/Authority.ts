import AuthPayload from "./AuthPayload"
import fetch, {Response} from "node-fetch"
import * as Jwt from "jsonwebtoken"
import * as Filesystem from "fs"
import Token from "./Token";

export default class Authority {

    private static get certificate(): Buffer {
        return Filesystem.readFileSync(__dirname + "/Certificates/textroulette.pem");
    }

    public static async authorize(token: string): Promise<Token> { 
        return new Promise((resolve: (token: Token) => void, reject) =>  {
            Jwt.verify(token, this.certificate ,{
                algorithms: ["RS256"]
            }, (err, token: Token) =>  {
                if (err) reject(err);
                resolve(token as Token);
            });
        });
    }

}