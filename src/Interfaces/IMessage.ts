import { IUser } from "./IUser";

export interface IMessage {
    id: number;
    text: string;
    user: IUser;
}