import React, { useState, useEffect } from "react";
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
  width: 100%;
`;

const StatBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  font-size: 14px;
`;

const CorrectWord = styled.div`
  text-align: center;
  margin-bottom: 24px;
  font-size: 16px;
`;

const NextWordTimer = styled.div`
  text-align: center;
  margin-bottom: 24px;
  font-size: 16px;

  div:first-child {
    margin-bottom: 8px;
  }
`;

const Timer = styled.div`
  font-size: 20px;
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
  onRestart: () => void;
  onClose: () => void;
  stats: {
    played: number;
    victories: number;
  };
  correctWord?: string;
  darkmode: boolean;
}

const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  onRestart,
  onClose,
  stats,
  correctWord,
  darkmode,
}) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onRestart(); // Call onRestart when time is up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimeLeft(300);

    return () => clearInterval(timer);
  }, [isOpen, onRestart]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

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
        <Title>Statistics</Title>
        <StatsGrid>
          <StatBox>
            <StatNumber>{stats.played}</StatNumber>
            <StatLabel>Played</StatLabel>
          </StatBox>
          <StatBox>
            <StatNumber>{stats.victories}</StatNumber>
            <StatLabel>Victories</StatLabel>
          </StatBox>
        </StatsGrid>
        {correctWord && <CorrectWord>CORRECT WORD: {correctWord}</CorrectWord>}
        <NextWordTimer>
          <div>NEXT WORD IN:</div>
          <Timer>{formatTime(timeLeft)}</Timer>
        </NextWordTimer>
        <Button darkmode={darkmode} onClick={onClose}>
          Accept
        </Button>
      </ModalContent>
    </ReactModal>
  );
};

export default ResultModal;
