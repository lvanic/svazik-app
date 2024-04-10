import { useState } from "react";
import { ImageViewer } from "./ImageViewer";
// import defaultAvatar from "../img/servers.jpg";

type Size = "xl" | "lg" | "sm";
export const AvatarImage = ({ image, size }: { image: string; size: Size }) => {
  const [isOpen, setOpen] = useState(false);
  const openViewer = () => {
    setOpen((prev) => !prev);
  };

  let imageSize: string;
  switch (size) {
    case "xl":
      imageSize = "15rem";
      break;
    case "lg":
      imageSize = "10rem";
      break;
    case "sm":
      imageSize = "4rem";
      break;
    default:
      imageSize = "10rem"; // По умолчанию
  }

  return (
    <>
      {image != null ? (
        <div
          onClick={openViewer}
          style={{
            minWidth: imageSize,
            width: imageSize,
            height: imageSize,
            cursor: "pointer",
          }}
        >
          <img
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "100%",
              objectFit: "cover",
            }}
            src={image}
            alt="Avatar"
          />
        </div>
      ) : (
        <div
          onClick={openViewer}
          style={{
            minWidth: imageSize,
            width: imageSize,
            height: imageSize,
            cursor: "pointer",
          }}
        >
          <img
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "100%",
              objectFit: "cover",
            }}
            src={"../img/defaultAvatar.jfif"}
            alt="Avatar"
          />
        </div>
      )}

      {isOpen && <ImageViewer image={image} setOpen={setOpen} />}
    </>
  );
};
