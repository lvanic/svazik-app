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
        if (notifies.length != 0) {
            toast(
                notifies[notifies.length - 1].message,
                {
                    onClick: () => setActiveChatById(notifies[notifies.length - 1].chatId, notifies[notifies.length - 1].chatName)
                })
        }

        if (notifies.length > 9) {
            setNotifies(notifies.slice(0, notifies.length - 1))
        }
    }, [notifies])
    return (
        <ToastContainer />
    );
}