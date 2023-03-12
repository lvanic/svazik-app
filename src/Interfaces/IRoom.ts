import { IUser } from "./IUser";

export interface IRoom {
    name?: string;
    description?: string;
    users?: IUser[];
  }