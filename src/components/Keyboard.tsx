import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";

const KeyboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  width: 100%;
  max-width: 484px;
  padding-bottom: 8px;
`;

const KeyboardRow = styled.div`
  display: flex;
  gap: 4px;
  width: 100%;
  justify-content: center;
`;

const Key = styled.button<{
  status?: "correct" | "present" | "absent";
  darkmode?: boolean;
  isMobile?: boolean;
}>`
  flex: none;
  width: ${({ isMobile }) => (isMobile ? "32px" : "52px")};
  height: ${({ isMobile }) => (isMobile ? "32px" : "52px")};
  border-radius: 4px;
  border: none;
  background-color: ${({ status, darkmode }) => {
    if (status) {
      switch (status) {
        case "correct":
          return "#6aaa64";
        case "present":
          return "#c9b458";
        case "absent":
          return "#787c7e";
      }
    }
    return darkmode ? "#565F7E" : "#D3D6DA";
  }};
  color: ${({ darkmode }) => (darkmode ? "#ffffff" : "#1a1a1b")};
  font-weight: 500;
  font-size: 1.125rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  flex: ${({ children }) =>
    children === "enter" || children === "backspace" ? "1.5" : "1"};
  padding: 0;
  user-select: none;
  touch-action: manipulation;
`;

const EnterKey = styled(Key)`
  font-size: 0.875rem;
`;

const BackspaceKey = styled(Key)`
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 22px;
    height: 22px;
  }
`;

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  letterStatuses: { [key: string]: "correct" | "present" | "absent" };
  darkmode: boolean;
}

const Keyboard: React.FC<KeyboardProps> = ({
  onKeyPress,
  letterStatuses,
  darkmode,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const rows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ñ"],
    ["enter", "z", "x", "c", "v", "b", "n", "m", "backspace"],
  ];

  const handleResize = () => {
    if (window.innerWidth < 720) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  // create an event listener
  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <KeyboardContainer>
      {rows.map((row, i) => (
        <KeyboardRow key={i}>
          {row.map((key) => {
            if (key === "enter") {
              return (
                <EnterKey
                  key={key}
                  onClick={() => onKeyPress(key)}
                  darkmode={darkmode}
                >
                  enter
                </EnterKey>
              );
            }
            if (key === "backspace") {
              return (
                <BackspaceKey
                  key={key}
                  onClick={() => onKeyPress(key)}
                  darkmode={darkmode}
                  isMobile={isMobile}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <path
                      fill="currentColor"
                      d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"
                    ></path>
                  </svg>
                </BackspaceKey>
              );
            }
            return (
              <Key
                key={key}
                onClick={() => onKeyPress(key)}
                status={letterStatuses[key]}
                darkmode={darkmode}
                isMobile={isMobile}
              >
                {key}
              </Key>
            );
          })}
        </KeyboardRow>
      ))}
    </KeyboardContainer>
  );
};

export default Keyboard;
