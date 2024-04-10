import { Card } from "react-bootstrap";
import "./Chat.css";
export const ChatCard = (props: any) => {
  
  return (
    <Card
      className="mb-0 border rounded chat-item border-0"
      onClick={props.onClick}
    >
      <Card.Body className="d-flex align-items-start flex-row pt-1 pb-1">
        <div style={{ height: "65px" }}>
          <Card.Img
            variant="left"
            src="../img/white.png"
            className="rounded-circle "
            style={{ width: "65px", height: "65px", border: "1px solid black" }}
          />
          <Card.Text
            style={{
              position: "relative",
              top: "-55px",
              left: "23px",
              width: "65px",
              fontSize: "30px",
              fontWeight: "450",
            }}
          >
            {props.title[0].toUpperCase()}
          </Card.Text>
        </div>
        <Card.Text style={{ marginTop: "10px", marginLeft: "20px" }}>
          <Card.Text className="mb-1 text-dark ont-weight-bold fs-5 text-color-change">
            {props.title}
          </Card.Text>
          <Card.Text
            className="text-muted mb-0 text-color-change"
            style={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {props.messages[props.messages.length - 1]?.text || props.description}
          </Card.Text>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};
