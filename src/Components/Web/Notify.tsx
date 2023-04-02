import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { notifyState } from "../../Atoms/NotifyState";
import { socketState } from "../../Atoms/SocketState";
import { activeChatState } from "../../Atoms/ActiveChat";

export const Notify = (props: any) => {
    const [notifies, setNotifies] = useRecoilState(notifyState)
    const divRef = useRef<HTMLDivElement>(null);
    const [activeChat, setActiveChat] = useRecoilState(activeChatState)

    useEffect(() => {
        if (notifies.length > 0) {
            divRef.current?.classList.add("transition")
            setTimeout(() => {
                divRef.current?.classList.remove("transition")
            }, 3000)
        }
    }, [notifies])
    return (
        <div ref={divRef}
            onClick={() => {
                setActiveChat({ ...activeChat, id: notifies[notifies.length - 1].chatId, name: notifies[notifies.length - 1].chatName })
                //remove last notify
                setNotifies(notifies.slice(0, notifies.length - 1))
            }}
            className="position-absolute d-flex border p-2 notify align-items-center justify-content-center">
            {
                // notifies.map((item, index) => {
                //     return (
                //         <div key={index} onClick={(e) => setActiveChat({ ...activeChat, id: item.chatId, name: item.chatName })}>
                //             {item.message}
                //         </div>
                //     )
                // })
                notifies[notifies.length - 1]?.message
            }
        </div>
    );
}