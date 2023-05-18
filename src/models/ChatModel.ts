import { MessageModel } from "./MessageModel";
import { UserModel } from "./UserModel";

export class ChatModel {
    id: number;
    name: string;
    description: string;
    users: UserModel[];
    admins: UserModel[];
    messages: MessageModel[];
    shareString: string;
    call: {
        peersUsers: [
            {
                peerId: string;
                user: UserModel
            }
        ]
    }

    constructor(_id: number, _name: string, _description: string, _users: UserModel[], _admins: UserModel[], _messages: MessageModel[], _call: any, _shareString:string) {
        this.id = _id;
        this.name = _name;
        this.description = _description;
        this.users = _users;
        this.admins = _admins;
        this.messages = _messages;
        this.call = _call;
        this.shareString = _shareString;
    }
}