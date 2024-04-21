import { useEffect, useReducer, useRef, useState } from "react";
import { DropdownButton, Dropdown, Form } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button";
import { useRecoilState, useRecoilValue } from "recoil";
import { io } from "socket.io-client";
import { activeChatState } from "../../Atoms/ActiveChat";
import { socketState } from "../../Atoms/SocketState";
import { userState } from "../../Atoms/UserState";
import { IMessage } from "../../Interfaces/IMessage";
import { ValidateMessage } from "../../Utils/ValidateMessage";
import { inputState } from "../../Atoms/InputState";
import { languageState } from "../../Atoms/LanguageState";
import { requests } from "../../requests";

export const MessageInput = (props: any) => {
  const [activeChat, setActiveChat] = useRecoilState(activeChatState);
  const [inputHandler, setInputState] = useRecoilState(inputState);
  const [language, setLanguage] = useRecoilState(languageState);
  const socket = useRecoilValue(socketState);
  const inputRef = useRef<any>(null);
  const [attachment, setAttachment] = useState<any>(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const MessageSend = async (e: any) => {
    if (inputHandler.message != null && inputHandler.message != "") {
      if (inputHandler.isUpdate) {
        console.log(inputHandler);

        socket.send("updateMessage", {
          text: inputHandler.message,
          id: inputHandler.idUpdateMessage,
        });
        console.log("Update message");
      } else {
        if (attachment == null) {
          socket.send("addMessage", {
            text: inputHandler.message,
            room: {
              id: activeChat.id,
              name: activeChat.name,
            },
          });
        } else {
          const formData = new FormData();
          const message = {
            text: inputHandler.message,
            room: {
              id: activeChat.id,
              name: activeChat.name,
            },
          };

          formData.append("Message", message.text);
          formData.append("RoomId", activeChat.id.toLocaleString());
          formData.append("File", attachment);

          const server = process.env.REACT_APP_SERVER_NAME;

          const requestConfig: RequestInit = {
            method: "POST",
            headers: {
              // "Content-Type": `multipart/form-data; boundary=${boundary};`,
            },
            body: formData,
            credentials: "include",
          };
          const response = await fetch(
            `${server + requests.uploadAttachment} `,
            requestConfig
          );
          const data = await response.text();
        }
      }
      setInputState({
        ...inputHandler,
        message: "",
        isUpdate: false,
        idUpdateMessage: -1,
      });
    }
  };

  const SecureMessageSend = (e: any) => {
    if (inputHandler.message != null && inputHandler.message != "") {
      socket.send("AddSecureMessage", {
        text: inputHandler.message,
        room: {
          id: activeChat.id,
          name: activeChat.name,
        },
      });

      setInputState({
        ...inputHandler,
        message: "",
        isUpdate: false,
        idUpdateMessage: -1,
      });
    }
  };

  const MessageChange = (e: any) => {
    setInputState({ ...inputHandler, message: e.target.value });
  };

  const onSetAttacment = (e: any) => {
    if (e.target.files) {
      setAttachment(e.target.files[0]);
    }
  };

  return (
    <div
      className="message-input d-flex align-items-center justify-content-end"
      style={{ height: "50px" }}
    >
      <div
        className="d-flex w-100 h-100"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            MessageSend(e);
          }
        }}
      >
        <Form.Control
          ref={inputRef}
          type="search"
          placeholder={language.words?.TypeMessage}
          className="me-2 message-input-control"
          aria-label="Search"
          value={inputHandler.message}
          onChange={MessageChange}
        />

        <Form.Control
          style={{
            // width: "10%",
            marginRight: '10px'
          }}
          type="file"
          accept="image/*"
          
          onChange={onSetAttacment}
        />

        <Button
          onClick={MessageSend}
          variant="success"
          className="message-input-send"
        >
          {language.words?.Send}
        </Button>
        {inputHandler.isUpdate ? null : (
          <DropdownButton
            className="h-100"
            id="dropdown-variants-success"
            variant=""
            drop="up"
            title=""
          >
            <Dropdown.Item onClick={SecureMessageSend}>
              {language.words?.SecretMessage}
            </Dropdown.Item>
            <Dropdown.Item>{language.words?.PlannedMesssage}</Dropdown.Item>
          </DropdownButton>
        )}
      </div>
    </div>
  );
};
