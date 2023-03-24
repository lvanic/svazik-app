export class NotifyModel{
    chatId: number;
    message: string;

    constructor(_chatId: number, _message: string){
        this.chatId = _chatId;
        this.message = _message;
    }
}