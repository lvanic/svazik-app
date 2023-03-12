import { UserModel } from "./UserModel";

export class MessageModel {
    text: string;
    user: UserModel;
    created_at: Date;

    constructor(_text: string, _user: UserModel, _created_at: Date) {
        this.text = _text;
        this.user = _user;
        this.created_at = _created_at;
    }
}