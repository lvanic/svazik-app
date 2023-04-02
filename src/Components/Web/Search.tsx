import { useEffect, useState } from "react"
import { Card, Dropdown, Form } from "react-bootstrap"
import { useRecoilState, useRecoilValue } from "recoil"
import { activeChatState } from "../../Atoms/ActiveChat"
import { socketState } from "../../Atoms/SocketState"
import { ChatModel } from "../../models/ChatModel"
import { enterRoom, searchRooms } from "../../Services/ChatServices"

export const Search = () => {
    const [searchList, setSearchList] = useState<ChatModel[]>()
    const [searchString, setSearchString] = useState<string>('');
    const [isDropdown, setIsDropdown] = useState<boolean>(false)
    const socket = useRecoilValue(socketState)
    const [activeChat, setActiveChat] = useRecoilState(activeChatState)
    const ActivateDropdown = (e: any) => {
        console.log(searchList?.length);
        if (searchList?.length != 0 && searchList?.length != undefined && searchString != '')
            setIsDropdown(true);
    }
    const DeactivateDropdown = () => {
        setSearchString('');
    }

    useEffect(() => {
        socket.on('searchedRooms', data => {
            if (data.length != 0) {
                setIsDropdown(true);
                setSearchList(data);
            }
        })
    }, [])

    useEffect(() => {
        if (searchString !== '') {
            searchRooms(socket, searchString)
        }
        else {
            setIsDropdown(false)
        }
    }, [searchString])

    const chatSelect = (_id: number, title: string, description: string) => {
        enterRoom(_id, socket, title);
        setActiveChat({ ...activeChat, id: _id, name: title, description: description })
    }

    const ChangeSearchString = (e: any) => {
        setSearchString(e.target.value);
    }
    return (
        <div onClick={ActivateDropdown}>
            <Form.Control
                type="search"
                placeholder="Search"
                className="me-2 pr-0 rounded"
                aria-label="Search"
                onChange={ChangeSearchString}
                value={searchString}
                onSubmit={() => { }}
            />
            <Dropdown.Menu show={isDropdown}
                className="mt-2 w-75">
                {
                    searchList?.map((element, index) =>
                        <Dropdown.Item style={{ overflow: 'hidden' }}
                            onClick={(e) => {
                                DeactivateDropdown();
                                chatSelect(element.id, element.name, element.description)
                            }}
                            key={index}
                            className='p-0 search-dropdown-item' >
                            <Card className='border-0 mb-1 mt-1 search-dropdown-card'>
                                <Card.Title>
                                    {element.name}
                                </Card.Title>
                                <Card.Body>
                                    {element.description}
                                </Card.Body>
                                <Card.Text className='border-0'>
                                    {/* {element.users} */}
                                </Card.Text>
                            </Card>
                        </Dropdown.Item>
                    )
                }
            </Dropdown.Menu>

        </div>
    )
}