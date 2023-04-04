import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { notifyState } from "../../Atoms/NotifyState";

import { activeChatState } from "../../Atoms/ActiveChat";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const Notify = (props: any) => {
    const [notifies, setNotifies] = useRecoilState(notifyState)
    const [activeChat, setActiveChat] = useRecoilState(activeChatState)

    const setActiveChatById = (id: number, name: string) => {
        setActiveChat({ ...activeChat, id: id, name: name })
        setNotifies(notifies.slice(0, notifies.length - 1))
    }

    useEffect(() => {
        notifies.length != 0 ?
            toast(
                notifies[notifies.length - 1].message,
                {
                    onClick: () => setActiveChatById(notifies[notifies.length - 1].chatId, notifies[notifies.length - 1].chatName)
                })
            :
            null

        if (notifies.length > 9) {
            setNotifies(notifies.slice(0, notifies.length - 1))
        }
    }, [notifies])
    return (
        // <div ref={divRef}
        //     onClick={() => {
        //         setActiveChat({ ...activeChat, id: notifies[notifies.length - 1].chatId, name: notifies[notifies.length - 1].chatName })
        //         //remove last notify
        //         setNotifies(notifies.slice(0, notifies.length - 1))
        //     }}
        //     className="position-absolute d-flex border p-2 notify align-items-center justify-content-center">
        //     {
        //         // notifies.map((item, index) => {
        //         //     return (
        //         //         <div key={index} onClick={(e) => setActiveChat({ ...activeChat, id: item.chatId, name: item.chatName })}>
        //         //             {item.message}
        //         //         </div>
        //         //     )
        //         // })
        //         notifies[notifies.length - 1]?.message
        //     }
        // </div>
        <ToastContainer />
    );
}