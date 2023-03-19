import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { notifyState } from "../../Atoms/NotifyState";

export const Notify = (props: any) => {
    const [Notifies, setNotifies] = useRecoilState(notifyState)
    const divRef = useRef<HTMLDivElement>(null);
    const [isNotify, setIsNotify] = useState(false)
    useEffect(() => {
        let wrapper: any = divRef.current;
        wrapper?.classList.toggle('transition')
    }, [Notifies, isNotify])

    return (
        <div ref={divRef}
            onClick={() => { setIsNotify(!isNotify) }}
            className="position-absolute d-flex border p-2 notify transition align-items-center justify-content-center">
            {
                divRef.current?.classList.contains('transition') ?
                    Notifies.length 
                    :
                    Notifies[Notifies.length - 1].message
            }
        </div>
    );
}