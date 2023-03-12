import { IAction } from "../Interfaces/IAction";
import { IUser } from "../Interfaces/IUser";
import { UserModel } from "../models/UserModel";



const initState = new UserModel('', '', false);
export const UserReducer = (state: IUser = initState, action: IAction) => {
    switch (action.type) {
        case "SET_USER":
            return state = action.payload;
        case "CHANGE_LOGIN":
            return { ...state, username: action.payload };
        default:
            console.log(state);
            return state;
    }
}