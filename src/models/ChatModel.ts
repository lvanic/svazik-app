import { MessageModel } from "./MessageModel";
import { UserModel } from "./UserModel";

export class ChatModel {
    id: number;
    name: string;
    description: string;
    users: UserModel[];
    admins: UserModel[];
    messages: MessageModel[];
    constructor(_id: number,_name: string, _description: string, _users: UserModel[], _admins: UserModel[], _messages: MessageModel[]) {
        this.id = _id;
        this.name = _name;
        this.description = _description;
        this.users = _users;
        this.admins = _admins;
        this.messages = _messages;
    }
}