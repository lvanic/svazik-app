import { ActiveChatHeader } from "./ActiveChatHeader";
import { MessageArea } from "./MessageArea";
import './ActiveChat.css'

export const ActiveChat = (props: any) => {

    return(
        <div className="chat-place-holder">
            <ActiveChatHeader isSideBarOpen={props.isSideBarOpen} setSideBarOpen={props.setSideBarOpen}/>
            <MessageArea/>
        </div>
    );
}