
import {Queue} from "typescript-collections"
import * as UUID from "uuid"
import Token from "../Auth/Token";

export default class MatchMaker {
    private queue: Queue<DeferredPromise<string>>;
    private cycle: NodeJS.Timer | null;
    private cycleCounter: number;
    private maxTime: number;
    private frequency: number;

    public constructor(maxTime: number, frequency: number) {
        this.queue = new Queue();
        this.cycleCounter = 0;
        this.maxTime = maxTime;
        this.frequency = frequency;
    }

    public requestUuid: (token: Token) => Promise<string> = async(token) => {
        let deferred = new DeferredPromise<any>(token);
        this.queue.enqueue(deferred);
        if (this.cycle == null) {
            this.cycle = setInterval(this.matchCycle, this.frequency); //Enable spinlock
        }
        return deferred.promise;
    }

    private matchCycle: () => void = () => {
        if (this.cycleCounter > this.maxTime * (1000 / this.frequency)) {
            let aloneDude: DeferredPromise<string> = this.queue.dequeue();
            aloneDude.reject(new Error("No partner found"));
            clearInterval(this.cycle as NodeJS.Timer); //Disable spinlock
            this.cycle = null;
            this.cycleCounter = 0;
        }
        if (this.queue.size() > 1) {
            let first: DeferredPromise<any> = this.queue.dequeue();
            let second: DeferredPromise<any> = this.queue.dequeue();
            let uuid: string = UUID.v4();
            let firstUserPayload = {
                uuid: uuid,
                token: second.savedData
            };
            let secondUserPayload = {
                uuid: uuid,
                token: first.savedData
            }
            first.resolve(firstUserPayload);
            second.resolve(secondUserPayload);
            this.cycleCounter = 0;
            if (this.queue.size() == 0) {
                clearInterval(this.cycle as NodeJS.Timer)
                this.cycle = null;
            };
        }
        this.cycleCounter++;
    }

}

class DeferredPromise<T> {
    
    private prom: Promise<T>
    private res: (value?: T) => void;
    private rej: (reason?: any) => void;
    private data: any;

    public constructor(data: any) {
        this.prom = new Promise<T>((res, rej) => {
            this.res = res;
            this.rej = rej;
        });
        this.data = data;
    }

    public get savedData(): any {
        return this.data;
    }

    public get promise(): Promise<T> {
        return this.prom;
    }

    public get resolve(): (value?: T) => void {
        return this.res;
    }

    public get reject(): (reason?: any) => void {
        return this.rej;
    }
}