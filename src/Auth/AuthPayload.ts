export default interface AuthPayload { 
    username: string, 
    password: string, 
    grant_type: string, 
    client_id: string, 
    client_secret: string
}