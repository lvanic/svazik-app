export class NotifyModel {
    chatId: number;
    message: string;
    chatName: string;

    constructor(_chatId: number, _message: string, _chatName: string) {
        this.chatId = _chatId;
        this.message = _message;
        this.chatName = _chatName;
    }
}