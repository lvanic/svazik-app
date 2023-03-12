import { IMessage } from "./IMessage";

export interface IChat {
    id: number;
    name: string;
    description: string;
    messages: IMessage[];
}