import { useEffect, useReducer, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { activeChatState } from "../../Atoms/ActiveChat";
import { userState } from "../../Atoms/UserState";
import { MessageInput } from "./MessageInput";
import { Message } from "./Message";
import { puginateMessages } from "../../Services/ChatServices";
import { socketState } from "../../Atoms/SocketState";
import { AvatarImage } from "../Utils/AvatarImage";

export const MessageArea = (props: any) => {
  const [activeChat, setActiveChat] = useRecoilState(activeChatState);
  const [socket, setSocket] = useRecoilState(socketState);
  const user = useRecoilValue(userState);
  const endChatRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    //last or saved(may be)
    endChatRef?.current?.lastElementChild?.scrollIntoView({
      behavior: "smooth",
    });
  }, [activeChat.messages.length]);

  useEffect(() => {
    setPage(1);
  }, [activeChat.id]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (event.currentTarget.scrollTop == 0) {
      const newPage = page + 1;
      setPage(newPage);
      puginateMessages(activeChat.id, socket, newPage);
    }
  };

  return (
    <>
      {activeChat.id == undefined ? null : (
        <div key="message-handler" className="message-handler">
          <div className="messages" ref={endChatRef} onScroll={handleScroll}>
            {activeChat.messages?.map((message: any) => {
              if (user.username == message.user.username) {
                return (
                  <div className="d-flex justify-content-end">
                    <Message
                      image={message.user.image}
                      text={message.text}
                      name={message.user.username}
                      id={message.id}
                      location="end"
                    />
                    <div className="m-2" />
                    <AvatarImage image={message.user.image} size="sm" />
                  </div>
                );
              } else {
                return (
                  <div className="d-flex">
                    <AvatarImage image={message.user.image} size="sm" />
                    <div className="m-2" />
                    <Message
                      image={message.user.image}
                      text={message.text}
                      name={message.user.username}
                      id={message.id}
                      location="start"
                    />
                  </div>
                );
              }
            })}
          </div>
          {activeChat.id != -1 ? (
            <div>
              <MessageInput activeChatId={props.activeChatId} />
            </div>
          ) : null}
        </div>
      )}
    </>
  );
};
