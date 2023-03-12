import { Interface } from 'readline';
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { IAction } from '../Interfaces/IAction';


const initState = io(`${process.env.REACT_APP_SERVER_NAME}`,{
  extraHeaders: {
    authorization: `${localStorage.getItem('access_token')}`
  }
});
export function SocketReducer(state: Socket = initState, action: IAction) {
  switch (action.type) {
    default:
      return state;
  }
}