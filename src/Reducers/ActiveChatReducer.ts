import { Interface } from 'readline';
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { IAction } from '../Interfaces/IAction';
import { ChatModel } from '../models/ChatModel';


const initState = new ChatModel('', '', undefined, undefined, undefined);

export function ActiveChatReducer(state: ChatModel = initState, action: IAction) {
  switch (action.type) {
    case 'SET_ACTIVE_CHAT':{
      return state = action.payload;
    }
    default:
      return state;
  }
}