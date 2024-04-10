import { useState, useRef, useEffect, useCallback } from "react";
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button";
import { useRecoilState } from "recoil";
import io from "socket.io-client";
import { socketState } from "../Atoms/SocketState";
import Peer, { MediaConnection } from "peerjs";
import { activeChatState } from "../Atoms/ActiveChat";
import "./VideoCall.css";

export const VideoCall = (props: any) => {
  const [callStarted, setCallStarted] = useState(false);
  const [socket, setSocket] = useRecoilState(socketState);
  const [activeChat, setActiveChat] = useRecoilState(activeChatState);
  const [peer, setPeer] = useState<any>(null);
  const [myStream, setMyStream] = useState<any>(null);
  const [peers, setPeers] = useState<{ [id: string]: MediaStream }>({});
  const [myPeerId, setMyPeerId] = useState<string>("");
  const [isScreenShare, setScreenShare] = useState(false);
  const [callerPeersId, setCallerPeersId] = useState([
    { name: "", peerdId: "" },
  ]);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
  const usersVideos = useRef<(HTMLVideoElement | null)[]>([]);
  const myVideo = useRef<HTMLVideoElement | null>(null);
  const [calls, setCalls] = useState<MediaConnection[]>([]);

  useEffect(() => {
    if (myVideo.current && myStream) {
      myVideo.current.srcObject = myStream;
    }
  }, [myStream]);

  useEffect(() => {
    socket.on("userDisconected", (data: any) => {
      setPeers((prevState) => {
        const updatedPeers = { ...prevState };
        delete updatedPeers[data.peerId];
        return updatedPeers;
      });
      console.log("peerUpdate");
    });
    socket.on("trackChanged", (data: any) => {});

    Object.keys(peers).forEach((peerId: any) => {
      if (usersVideos.current[peerId]) {
        usersVideos.current[peerId]!.srcObject = peers[peerId];
      }
    });
    console.log(peers);
    return () => {
      socket.off("userDisconected");
      socket.off("trackChanged");
    };
  }, [peers]);

  const initializePeer = async () => {
    var options = {
      config: { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] },
      stream: true,
      host: "localhost",
      port: 9000,
      path: "/myapp",
    };

    const peerHandler = new Peer(options);
    setPeer(peerHandler);
    peerHandler.on("open", (id) => {
      setMyPeerId(id);
      if (props.isConnectToCall || props.receivingCall) {
        socket.invoke("connectRoom", {
          peerId: id,
          room: activeChat,
        });
      } else {
        socket.invoke("callRequest", {
          peerId: id,
          room: activeChat,
        });
      }

      if (props.isConnectToCall || props.receivingCall) {
        socket.on("peers", (data: any) => {
          setCallerPeersId(
            data.peersUsers.map((x: any) => ({
              peerId: x.peerId,
            }))
          );
          data.peersUsers.map((peerUser: any) => {
            const call = peerHandler.call(peerUser.peerId, myStream);
            setCalls([...calls, call]);
            call.on("stream", (remoteStream: MediaStream) => {
              setPeers((prevState) => {
                return { ...prevState, [call.peer]: remoteStream };
              });
            });
          });
        });
      } else {
        const call = peerHandler.call(myPeerId, myStream);
        setCalls([...calls, call]);
        call.on("stream", (remoteStream: MediaStream) => {
          setPeers((prevState) => {
            return { ...prevState, [call.peer]: remoteStream };
          });
        });
      }
      setAudioEnabled(true);
      setVideoEnabled(true);
    });

    peerHandler.on("call", (call: any) => {
      call.answer(myStream);
      setCalls([...calls, call]);
      call.on("stream", (remoteStream: MediaStream) => {
        console.log("remote stream3: ", remoteStream.getVideoTracks());
        remoteStream.onaddtrack = () => alert(3);
        setPeers((prevState) => {
          return { ...prevState, [call.peer]: remoteStream };
        });
      });
    });

    peerHandler.on("close", () => {
      console.log("Peer connection closed");
    });

    return () => {
      peerHandler.disconnect();
    };
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        setMyStream(stream);
      })
      .catch((error) => {
        console.error("Error accessing media devices", error);
      });

    return () => {
      socket.send("disconectCall");
      setMyStream(null);
      setPeer(null);
    };
  }, []);

  useEffect(() => {
    return () => {
      socket.invoke("refreshRoom", { id: activeChat.id });
    };
  }, [activeChat.id]);

  useEffect(() => {
    console.log(myStream);

    return () => {
      if (myStream) {
        myStream.getTracks().forEach((track: any) => {
          track.stop();
        });
      }
    };
  }, [myStream]);

  useEffect(() => {
    return () => {
      if (peer) {
        peer.destroy();
        peer.disconnect();
      }
    };
  }, [peer]);

  const callPeer = useCallback(async () => {
    if (!peer) {
      await initializePeer();
    } else {
      // alert(peer)
    }
  }, [initializePeer]);

  const handleScreenShareClick = () => {
    if (callStarted) {
      setScreenShare(!isScreenShare);
      if (myStream) {
        if (!isScreenShare) {
          navigator.mediaDevices
            .getDisplayMedia({ video: true })
            .then((screenStream) => {
              // Получение видеотрека с экрана
              calls.map((conn) => {
                const screenVideoTrack = screenStream.getVideoTracks()[0];

                myStream.getVideoTracks()[0].stop();
                myStream.removeTrack(myStream.getVideoTracks()[0]);
                myStream.addTrack(screenVideoTrack);

                // Отправка обновленного видеопотока с экрана через PeerJS
                const videoSender = conn.peerConnection
                  .getSenders()
                  .find((sender) => {
                    if (sender.track != null) {
                      return sender.track.kind === "video";
                    }
                  });
                if (videoSender) videoSender.replaceTrack(screenVideoTrack);
              });
            })
            .catch((error) => {
              console.error("Ошибка при получении потока с экрана:", error);
              setScreenShare(false);
            });
        } else {
          navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((screenStream) => {
              // Получение видеотрека с экрана
              calls.map((conn) => {
                const screenVideoTrack = screenStream.getVideoTracks()[0];

                myStream.getVideoTracks()[0].stop();
                myStream.removeTrack(myStream.getVideoTracks()[0]);
                myStream.addTrack(screenVideoTrack);

                // Отправка обновленного видеопотока с экрана через PeerJS
                const videoSender = conn.peerConnection
                  .getSenders()
                  .find((sender) => {
                    if (sender.track != null) {
                      return sender.track.kind === "video";
                    }
                  });
                if (videoSender) videoSender.replaceTrack(screenVideoTrack);
              });
            })
            .catch((error) => {
              console.error("Ошибка при получении потока с экрана:", error);
              setScreenShare(true);
            });
        }
      }
    }
  };

  const handleAudioClick = () => {
    if (myStream) {
      myStream.getAudioTracks().forEach((track: any) => {
        track.enabled = !audioEnabled;
        setAudioEnabled((prevState) => !prevState);
      });
    }
  };

  const handleVideoClick = () => {
    if (myStream) {
      myStream.getVideoTracks().forEach((track: MediaStreamTrack) => {
        track.enabled = !videoEnabled;
        setVideoEnabled((prevState) => !prevState);
        if (myVideo.current) {
          myVideo.current.srcObject = null;
          myVideo.current.srcObject = myStream;
        }
      });
    }
  };

  return (
    <div
      className="container-fluid"
      style={{
        position: "absolute",
        top: "60px",
        left: "0px",
        width: "100%",
        zIndex: "4000",
        height: "auto",
      }}
    >
      <div>
        <div>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <Card className="call-container">
              <div className="d-flex flex-row justify-content-center">
                <Card style={{ zIndex: "4000" }} className="call-video">
                  <Card.Body>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <video
                        ref={myVideo}
                        muted
                        autoPlay
                        style={{
                          maxWidth: "25rem",
                          width: "100%",
                          height: "auto",
                          marginLeft: "0.5rem",
                          marginRight: "0.5rem",
                          transform: "scaleX(-1)",
                          WebkitTransform: "scaleX(-1)",
                        }}
                      />

                      {Object.keys(peers).map((peerId: any, index) => (
                        <video
                          ref={(videoEl) =>
                            (usersVideos.current[peerId] = videoEl)
                          }
                          autoPlay
                          style={{
                            maxWidth: "25rem",
                            width: "100%",
                            height: "auto",
                            marginLeft: "0.5rem",
                            marginRight: "0.5rem",
                          }}
                        />
                      ))}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          width: "70%",
                        }}
                      >
                        {callStarted ? null : (
                          <Button
                            variant="success"
                            className="rounded-circle"
                            onClick={() => callPeer()}
                          >
                            {props.receivingCall ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-telephone-plus"
                                viewBox="0 0 16 16"
                              >
                                <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
                                <path
                                  fill-rule="evenodd"
                                  d="M12.5 1a.5.5 0 0 1 .5.5V3h1.5a.5.5 0 0 1 0 1H13v1.5a.5.5 0 0 1-1 0V4h-1.5a.5.5 0 0 1 0-1H12V1.5a.5.5 0 0 1 .5-.5"
                                />
                              </svg>
                            ) : props.isConnectToCall ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-telephone-plus"
                                viewBox="0 0 16 16"
                              >
                                <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
                                <path
                                  fill-rule="evenodd"
                                  d="M12.5 1a.5.5 0 0 1 .5.5V3h1.5a.5.5 0 0 1 0 1H13v1.5a.5.5 0 0 1-1 0V4h-1.5a.5.5 0 0 1 0-1H12V1.5a.5.5 0 0 1 .5-.5"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-telephone-plus"
                                viewBox="0 0 16 16"
                              >
                                <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
                                <path
                                  fill-rule="evenodd"
                                  d="M12.5 1a.5.5 0 0 1 .5.5V3h1.5a.5.5 0 0 1 0 1H13v1.5a.5.5 0 0 1-1 0V4h-1.5a.5.5 0 0 1 0-1H12V1.5a.5.5 0 0 1 .5-.5"
                                />
                              </svg>
                            )}
                          </Button>
                        )}
                        <Button
                          className="rounded-circle"
                          variant={audioEnabled ? "dark" : "danger"}
                          onClick={() => handleAudioClick()}
                        >
                          {audioEnabled ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-mic"
                              viewBox="0 0 16 16"
                            >
                              <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5" />
                              <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-mic-mute"
                              viewBox="0 0 16 16"
                            >
                              <path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4 4 0 0 0 12 8V7a.5.5 0 0 1 1 0zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a5 5 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4m3-9v4.879l-1-1V3a2 2 0 0 0-3.997-.118l-.845-.845A3.001 3.001 0 0 1 11 3" />
                              <path d="m9.486 10.607-.748-.748A2 2 0 0 1 6 8v-.878l-1-1V8a3 3 0 0 0 4.486 2.607m-7.84-9.253 12 12 .708-.708-12-12z" />
                            </svg>
                          )}
                        </Button>
                        <Button
                          className="rounded-circle"
                          variant={videoEnabled ? "dark" : "danger"}
                          onClick={() => handleVideoClick()}
                        >
                          {videoEnabled ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-camera-video"
                              viewBox="0 0 16 16"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-camera-video-off"
                              viewBox="0 0 16 16"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M10.961 12.365a2 2 0 0 0 .522-1.103l3.11 1.382A1 1 0 0 0 16 11.731V4.269a1 1 0 0 0-1.406-.913l-3.111 1.382A2 2 0 0 0 9.5 3H4.272l.714 1H9.5a1 1 0 0 1 1 1v6a1 1 0 0 1-.144.518zM1.428 4.18A1 1 0 0 0 1 5v6a1 1 0 0 0 1 1h5.014l.714 1H2a2 2 0 0 1-2-2V5c0-.675.334-1.272.847-1.634zM15 11.73l-3.5-1.555v-4.35L15 4.269zm-4.407 3.56-10-14 .814-.58 10 14z"
                              />
                            </svg>
                          )}
                        </Button>
                        <Button
                          className="rounded-circle"
                          variant={isScreenShare ? "dark" : "danger"}
                          onClick={() => handleScreenShareClick()}
                        >
                          {isScreenShare ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-x-lg"
                              viewBox="0 0 16 16"
                            >
                              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-cast"
                              viewBox="0 0 16 16"
                            >
                              <path d="m7.646 9.354-3.792 3.792a.5.5 0 0 0 .353.854h7.586a.5.5 0 0 0 .354-.854L8.354 9.354a.5.5 0 0 0-.708 0" />
                              <path d="M11.414 11H14.5a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-13a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h3.086l-1 1H1.5A1.5 1.5 0 0 1 0 10.5v-7A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v7a1.5 1.5 0 0 1-1.5 1.5h-2.086z" />
                            </svg>
                          )}
                        </Button>
                        <Button
                          className="rounded-pill"
                          style={{ width: "25%" }}
                          variant="danger"
                          onClick={() => props.setIsModalOpen(false)}
                        >
                          {props.receivingCall ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-telephone-minus"
                              viewBox="0 0 16 16"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5"
                              />
                              <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-telephone-minus"
                              viewBox="0 0 16 16"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5"
                              />
                              <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
                            </svg>
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
