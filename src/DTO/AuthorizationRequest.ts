export class AuthorizationRequest{
    email: string;
    password: string;
    
    constructor(_email: string, _password: string){
        this.email = _email;
        this.password = _password;
    }
}