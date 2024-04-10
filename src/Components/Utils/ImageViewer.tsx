import React from "react";
import { Modal, Fade } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";

export const ImageViewer = ({
  image,
  setOpen,
}: {
  image: string;
  setOpen: any;
}) => {
  const handleClose = () => {
    setOpen(false);
  };
  const isMobileDevice = useMediaQuery({ query: "(max-width: 767px)" });

  return (
    <Modal
      style={
        isMobileDevice
          ? { backgroundColor: "rgb(0, 0, 0)" }
          : { backgroundColor: "rgb(0, 0, 0, 0.5)" }
      }
      show={true}
      size="xl"
      onHide={handleClose}
      centered
    >
      <Modal.Header closeButton></Modal.Header>
      <img
        src={image}
        alt="Image"
        style={{ maxWidth: "100%", maxHeight: "100%" }}
      />
    </Modal>
  );
};
