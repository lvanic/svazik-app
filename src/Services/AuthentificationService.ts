import { STATUS_CODES } from "http";
import { AuthorizationRequest } from "../DTO/AuthorizationRequest";
import { RegistrationRequest } from "../DTO/RegistrationRequest";
import { IUser } from "../Interfaces/IUser";
import { UserModel } from "../models/UserModel";
import { requests } from "../requests";

export async function AuthorizationService(
  _email: string,
  _password: string
): Promise<UserModel> {
  const postObject = new AuthorizationRequest(_email, _password);
  const server = process.env.REACT_APP_SERVER_NAME;
  let userHandler = new UserModel("", "", false, null);
  const requestConfig: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postObject),
    credentials: "include",
  };
  const response = await fetch(
    `${server + requests.authorization} `,
    requestConfig
  );
  const data = await response.json();
  localStorage.setItem("access_token", data.accessToken);
  if (response.status == 200) {
    userHandler = new UserModel(data.username, data.email, true, data.image);
  }

  return userHandler;
}

export async function RegistrationService(
  _username: string,
  _email: string,
  _password: string
) {
  const postObject = new RegistrationRequest(_username, _email, _password);
  const server = process.env.REACT_APP_SERVER_NAME;
  const requestConfig = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postObject),
  };
  const response = await fetch(`${server + requests.register} `, requestConfig);
  const data = await response.json();
  localStorage.setItem("access_token", data.access_token);
  if (response.status == 201) {
    return true;
  } else {
    return false;
  }
}

export async function UserService(): Promise<UserModel> {
  const server = process.env.REACT_APP_SERVER_NAME;
  let userHandler = new UserModel("", "", false, null);
  const requestConfig: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };
  const response = await fetch(`${server + requests.user} `, requestConfig);
  if (response.status == 200) {
    const data = await response.json();
    localStorage.setItem("access_token", data.accessToken);
    userHandler = new UserModel(data.username, data.email, true, data.image);
  }

  return userHandler;
}
