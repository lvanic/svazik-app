import { useState } from "react";
import { ImageViewer } from "./ImageViewer";
// import defaultAvatar from "../img/servers.jpg";

type Size = "xl" | "lg" | "sm";

export const Attachment = ({ image }: { image: string }) => {
  const [isOpen, setOpen] = useState(false);
  const openViewer = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <div
        onClick={openViewer}
        style={{
          width: "100%",
          maxWidth: '400px',
          cursor: "pointer",
        }}
      >
        <img
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          src={image}
          alt="Image"
        />
      </div>

      {isOpen && <ImageViewer image={image} setOpen={setOpen} />}
    </>
  );
};
