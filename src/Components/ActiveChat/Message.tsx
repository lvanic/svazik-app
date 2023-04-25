import { ButtonGroup, Card, Dropdown, DropdownButton } from "react-bootstrap"
import './Message.css'
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { activeChatState } from "../../Atoms/ActiveChat";
import { userState } from "../../Atoms/UserState";
import { inputState } from "../../Atoms/InputState";
import { languageState } from "../../Atoms/LanguageState";
export const Message = (props: any) => {
    const [position, setPosition] = useState<any>(1);
    const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
    const [inputHandler, setInputState] = useRecoilState(inputState)
    const [activeChat, setActiveChat] = useRecoilState(activeChatState)
    const [user, setUser] = useRecoilState(userState)
    const messageRef = useRef<HTMLDivElement>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [dropDownCoords, setDropDownCoords] = useState({
        X: 0,
        Y: 0
    });
    const [language, setLanguage] = useRecoilState(languageState)
    const onMessageContextClick = (e: any) => {
        e.preventDefault();
        if (props.name == user.username) {
            setDropDownCoords({ X: e.clientX, Y: e.clientY })
            setIsAdmin(false)
            setShowContextMenu(true);
        } else if (activeChat.admins.findIndex(x => x.username == user.username) != -1) {
            setDropDownCoords({ X: e.clientX, Y: e.clientY })
            setIsAdmin(true)
            setShowContextMenu(true);
        }
    }

    const handleClick = (e: any) => {
        // Обработка выбранного пункта меню
        console.log(e.target.name);
        switch (e.target.name) {
            case "Edit":
                editMessage(props.id)
                break;
            case "Scream":
                screamMessage(props.id)
                break;
            case "Delete":
                deleteMessage(props.id)
                break;
            default:
                console.log("No action");
                break
        }
        setShowContextMenu(false);
    }

    const deleteMessage = (id: number) => {
        //sweatalerts вы точно хотите удалить сообщение
    }

    const editMessage = (id: number) => {

        setInputState({
            message: props.text,
            isUpdate: true,
            idUpdateMessage: props.id
        })
    }

    const screamMessage = (id: number) => {
        window.location.href = ""
    }

    useEffect(() => { //смещение падингом
        if (props.location == "end") {
            setPosition(2)
        } else {
            setPosition(3)
        }
    }, [])

    return (
        //todo custom menu
        <div>
            <div onContextMenu={onMessageContextClick} ref={messageRef} key={props.id} className={`message-field d-flex align-items-center justify-content-${props.location}`}>
                <Card className={`ps-${5 - position} pe-${position} pt-2 pb-2 mb-1 d-flex align-items-${props.location}`}>
                    <Card.Text className="mb-0">{props.name}</Card.Text>
                    <Card.Text className="mb-0">{props.text}</Card.Text>
                </Card>
            </div>
            {showContextMenu && (
                <Dropdown
                    className="position-absolute context-message"
                    style={{
                        top: dropDownCoords.Y - 40,
                        left: dropDownCoords.X - 40,
                        zIndex: 1000,
                    }}
                    onMouseLeave={(e) => setShowContextMenu(false)}>
                    {
                        isAdmin ?
                            null
                            :
                            <Dropdown.Item onClick={handleClick} className="d-flex justify-content-around context-menu-item" name="Edit">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                    </svg>
                                </div>
                                <div>{language.words?.Edit}</div>
                            </Dropdown.Item>
                    }

                    <Dropdown.Item onClick={handleClick} className="d-flex justify-content-around context-menu-item" name="Scream">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-square-heart" viewBox="0 0 16 16">
                                <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12ZM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2Z" />
                                <path d="M8 3.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132Z" />
                            </svg>
                        </div>
                        <div>{language.words?.Scream}</div>
                    </Dropdown.Item>

                    <Dropdown.Item onClick={handleClick} className="d-flex justify-content-around context-menu-item" name="Delete">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                            </svg>
                        </div>
                        <div>{language.words?.Delete}</div>
                    </Dropdown.Item>
                </Dropdown>
            )
            }
        </div >
    )
}