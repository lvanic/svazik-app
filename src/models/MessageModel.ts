import { UserModel } from "./UserModel";

export class MessageModel {
    id: number;
    text: string;
    user: UserModel;
    created_at: Date;

    constructor(_id: number, _text: string, _user: UserModel, _created_at: Date) {
        this.id = _id;
        this.text = _text;
        this.user = _user;
        this.created_at = _created_at;
    }
}