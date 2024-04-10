import { IUser } from "../Interfaces/IUser";

export class UserModel implements IUser {
    username?: string;
    email: string;
    isAuthorized: boolean;
    image?: any;
    constructor(_username: string, _email: string, _isAuth: boolean, _image: any) {
        this.username = _username;
        this.email = _email;
        this.isAuthorized = _isAuth;
        this.image = _image;
    }
}