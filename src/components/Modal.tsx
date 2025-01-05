import React from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import ExampleTile from './ExampleTile';

const ModalContent = styled.div<{ darkMode?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  width: 100%;
  height: 100%;
  max-height: 85vh;
  overflow-y: auto;
  text-align: center;
  background-color: ${props => props.darkMode ? '#262B3C' : '#ffffff'};
  color: ${props => props.darkMode ? '#ffffff' : '#1a1a1b'};

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.darkMode ? '#3a3a3c' : '#f1f1f1'};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.darkMode ? '#787c7e' : '#888'};
    border-radius: 4px;
  }
`;

const Title = styled.h1<{ darkMode?: boolean }>`
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.8rem;
  width: 100%;
  color: ${props => props.darkMode ? '#ffffff' : '#1a1a1b'};
`;

const Instructions = styled.div`
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
  max-width: 350px;
  
  p {
    margin: 10px 0;
    font-size: 15px;
  }
`;

const Examples = styled.div`
  margin: 15px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ExamplesTitle = styled.h3`
  font-weight: bold;
  font-size: 1.2rem;
  margin: 15px 0;
  text-align: center;
  width: 100%;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
`;

const StatBox = styled.div<{ darkMode?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border: 1px solid ${props => props.darkMode ? '#3a3a3c' : '#d3d6da'};
  border-radius: 4px;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  text-transform: uppercase;
`;

const Button = styled.button<{ darkMode?: boolean }>`
  background-color: ${props => props.darkMode ? '#538d4e' : '#6aaa64'};
  color: white;
  border: none;
  padding: 16px 0;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.3rem;
  width: 100%;
  max-width: 350px;
  text-transform: uppercase;
  margin-top: 20px;

  &:hover {
    opacity: 0.9;
  }
`;

const Footer = styled.p<{ darkMode?: boolean }>`
  text-align: center;
  margin-top: 20px;
  color: ${props => props.darkMode ? '#787c7e' : '#787c7e'};
  width: 100%;
  font-size: 14px;
`;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'instructions' | 'statistics';
  title: string;
  stats?: {
    gamesPlayed: number;
    wins: number;
  };
  darkMode?: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, type, title, stats, darkMode }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '450px',
          width: '90%',
          maxHeight: '85vh',
          padding: 0,
          border: `1px solid ${darkMode ? '#3a3a3c' : '#d3d6da'}`,
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: 'transparent',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <ModalContent darkMode={darkMode}>
        {type === 'instructions' ? (
          <>
            <Title darkMode={darkMode}>{title}</Title>
            <Instructions>
              <p>Guess the hidden word in five attempts.</p>
              <p>Each attempt must be a valid 5-letter word.</p>
              <p>After each attempt, the color of the letters changes to show how close you are to guessing the word.</p>
            </Instructions>
            <Examples>
              <ExamplesTitle>Examples</ExamplesTitle>
              <ExampleTile word="weary" position={0} status="correct" darkMode={darkMode} />
              <ExampleTile word="pilot" position={2} status="present" darkMode={darkMode} />
              <ExampleTile word="vague" position={3} status="absent" darkMode={darkMode} />
            </Examples>
            <p>There may be repeated letters. The hints are independent for each letter.</p>
            <Footer darkMode={darkMode}>A new word each 5 minutes!</Footer>
            <Button darkMode={darkMode} onClick={onClose}>PLAY</Button>
          </>
        ) : (
          <>
            <Title darkMode={darkMode}>{title}</Title>
            {stats && (
              <StatsContainer>
                <StatBox darkMode={darkMode}>
                  <StatNumber>{stats.gamesPlayed}</StatNumber>
                  <StatLabel>Played</StatLabel>
                </StatBox>
                <StatBox darkMode={darkMode}>
                  <StatNumber>{stats.wins}</StatNumber>
                  <StatLabel>Wins</StatLabel>
                </StatBox>
                <StatBox darkMode={darkMode}>
                  <StatNumber>
                    {stats.gamesPlayed > 0
                      ? Math.round((stats.wins / stats.gamesPlayed) * 100)
                      : 0}
                    %
                  </StatNumber>
                  <StatLabel>Win Rate</StatLabel>
                </StatBox>
              </StatsContainer>
            )}
            <Button darkMode={darkMode} onClick={onClose}>Close</Button>
          </>
        )}
      </ModalContent>
    </ReactModal>
  );
};

export default Modal;
