import { ActiveChatHeader } from "./ActiveChatHeader";
import { MessageArea } from "./MessageArea";
import "./ActiveChat.css";
import { useRecoilState } from "recoil";
import { activeChatState } from "../../Atoms/ActiveChat";
import { useEffect, useRef, useState } from "react";
import { socketState } from "../../Atoms/SocketState";
import { VideoCall } from "../VideoCall";
import { log } from "console";
import { Card, Offcanvas } from "react-bootstrap";

export const ActiveChat = (props: any) => {
  const [activeChat, setActiveChat] = useRecoilState(activeChatState);
  const [socket, setSocket] = useRecoilState(socketState);
  const [isCallStarted, setIsCallStarted] = useState(false);
  // const [callerPeersId, setCallerPeersId] = useState<any>()
  const [receivingCall, setReceivingCall] = useState(false);
  const [isConnectToCall, setIsConnectToCall] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const connectToCall = (e: any) => {
    // setCallerPeersId(activeChat.call.peersUsers.map(x => x.peerId))
    setIsConnectToCall(true);
    setIsModalOpen(true);
  };

  const StartCall = async (e: any) => {
    setIsCallStarted(true);
    setIsModalOpen(true);
  };

  useEffect(() => {
    socket.on("callRequest", (data: any) => {
      setReceivingCall(true);
      setActiveChat({
        ...activeChat,
        call: {
          peersUsers: [
            {
              peerId: data.peerId,
              user: data.from,
            },
          ],
        },
      });
      setIsModalOpen(true);
    });
    return () => {
      socket.off("callRequest");
    };
  }, [activeChat]);

  return (
    <div className="chat-place-holder d-flex flex-column">
      {activeChat.id != -1 ? (
        <ActiveChatHeader
          StartCall={StartCall}
          setIsModalOpen={setIsModalOpen}
          isSideBarOpen={props.isSideBarOpen}
          setSideBarOpen={props.setSideBarOpen}
        />
      ) : null}
      {activeChat.call != null && !receivingCall ? (
        <div style={{ width: "100%", display: "flex", height: "0px" }}>
          <Card
            className="p-0"
            style={{
              zIndex: 1000,
              cursor: "pointer",
              height: "40px",
              width: "100%",
            }}
            onClick={connectToCall}
          >
            <Card.Body
              style={{
                height: "40px",
                fontWeight: "500",
                fontSize: "18px",
                width: "100%",
              }}
              className="p-0 d-flex align-items-center justify-content-center"
            >
              Connect to Call
            </Card.Body>
          </Card>
        </div>
      ) : null}
      {activeChat.id != -1 ? <MessageArea /> : null}
      {isModalOpen && (isCallStarted || receivingCall || isConnectToCall) ? (
        <VideoCall
          receivingCall={receivingCall}
          isConnectToCall={isConnectToCall}
          setIsModalOpen={setIsModalOpen}
        />
      ) : null}
    </div>
  );
};
