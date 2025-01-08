import React from "react";
import ReactModal from "react-modal";
import styled from "styled-components";

const ModalContent = styled.div<{ darkmode?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  background-color: ${(props) => (props.darkmode ? "#262B3C" : "#ffffff")};
  color: ${(props) => (props.darkmode ? "#ffffff" : "#1a1a1b")};
  border-radius: 8px;
  min-width: 300px;
`;

const Title = styled.h2`
  margin: 0 0 32px;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
`;

const Button = styled.button<{ darkmode?: boolean }>`
  background-color: ${(props) => (props.darkmode ? "#538d4e" : "#6aaa64")};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 0;
  font-size: 18px;
  font-weight: bold;
  width: 100%;
  cursor: pointer;
  text-transform: uppercase;

  &:hover {
    opacity: 0.9;
  }
`;

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkmode: boolean;
}

const FailedModal: React.FC<ResultModalProps> = ({
  isOpen,
  onClose,
  darkmode,
}) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        content: {
          position: "relative",
          inset: "auto",
          padding: 0,
          border: "none",
          background: "none",
          overflow: "visible",
        },
      }}
    >
      <ModalContent darkmode={darkmode}>
        <Title>Game Over</Title>
        <Button darkmode={darkmode} onClick={onClose}>
          Close
        </Button>
      </ModalContent>
    </ReactModal>
  );
};

export default FailedModal;
