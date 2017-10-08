import AuthPayload from "./AuthPayload"
import fetch, {Response} from "node-fetch"
import * as Jwt from "jsonwebtoken"
import * as Filesystem from "fs"
import Token from "./Token";

export default class Authority {

    private static get certificate(): Buffer {
        return Filesystem.readFileSync(__dirname + "/Certificates/textroulette.pem");
    }

    public static async getToken(): Promise<any> { //Test
        const payload: AuthPayload = {
            username: "chrismarquez@textroulette.com",
            password: "1234",
            grant_type: "password",
            client_id: "kF1mXT7rzpEBxpBVmAeCLGi5kbJ2ViPY",
            client_secret: "MOMQrSUOJTV55SYNJ9qIwlme8MP-S0qcElEh-l0xsG5DGlDNO4EdxahJEaNM5CCM"
        };
        let response: Response = await fetch("https://textroulette.auth0.com/oauth/token", {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            method: "post",
            body: JSON.stringify(payload)
        });
        let token: any = await response.json();
        return token;
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