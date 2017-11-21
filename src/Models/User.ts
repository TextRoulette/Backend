export default interface User {
    id: string,
    username: string, 
    karma: number,
    languages: string[],
    marked: boolean,
    gender?: string,
    age?: number,
    chatId?: string
}