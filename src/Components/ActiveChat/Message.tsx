import { Card } from "react-bootstrap"

export const Message = (props: any) => {
    
    return (
        <div className={`d-flex justify-content-${props.location}`}>
            {/* <svg viewBox="0 0 11 20" width="11" height="20" className="bubble-tail"><use href="#message-tail-filled"></use></svg>*/}
            <Card body style={{ width: '20rem' }}>This is some text within a card body.</Card>
        </div>
    )
}