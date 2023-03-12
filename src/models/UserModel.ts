import { IUser } from "../Interfaces/IUser";

export class UserModel implements IUser {
    username?: string;
    email: string;
    isAuthorized: boolean;
    constructor(_username: string, _email: string, _isAuth: boolean) {
        this.username = _username;
        this.email = _email;
        this.isAuthorized = _isAuth;
    }
}