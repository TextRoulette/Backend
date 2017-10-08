export default interface User {
    id: string,
    username: string, 
    karma: number,
    languages: string[],
    gender?: string,
    age?: number,
    chatId?: string
}