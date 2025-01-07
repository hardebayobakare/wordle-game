import React from 'react';
import styled from '@emotion/styled';

const Switch = styled.div`
  position: relative;
  width: 40px;
  height: 20px;
  background: #3a3a3c;
  border-radius: 10px;
  padding: 2px;
  cursor: pointer;
  transition: background-color 0.3s;

  &[data-checked="true"] {
    background: #538d4e;
  }
`;

const Handle = styled.div<{ checked: boolean }>`
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s;
  transform: translateX(${props => props.checked ? '20px' : '0'});
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatsIcon = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: white;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface ThemeSwitchProps {
  checked: boolean;
  onChange: () => void;
  setGameOver: (value: boolean) => void;
}

const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ checked, onChange, setGameOver }) => {
  return (
    <Container>
      <StatsIcon onClick={() => setGameOver(true)}>
        {darkMode ? (
          <svg width="36" height="32" viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.87868 4.87868C3 5.75736 3 7.17157 3 10V22C3 24.8284 3 26.2426 3.87868 27.1213C4.75736 28 6.17157 28 9 28H27C29.8284 28 31.2426 28 32.1213 27.1213C33 26.2426 33 24.8284 33 22V10C33 7.17157 33 5.75736 32.1213 4.87868C31.2426 4 29.8284 4 27 4H9C6.17157 4 4.75736 4 3.87868 4.87868Z"
              fill="white"
            />
            <path d="M24 11C24.5523 11 25 11.4477 25 12V22.6667C25 23.219 24.5523 23.6667 24 23.6667C23.4477 23.6667 23 23.219 23 22.6667V12C23 11.4477 23.4477 11 24 11Z" fill="white" />
            <path d="M13 14.6667C13 14.1144 12.5523 13.6667 12 13.6667C11.4477 13.6667 11 14.1144 11 14.6667V22.6667C11 23.219 11.4477 23.6667 12 23.6667C12.5523 23.6667 13 23.219 13 22.6667V14.6667Z" fill="white" />
            <path d="M19 17.3333C19 16.781 18.5523 16.3333 18 16.3333C17.4477 16.3333 17 16.781 17 17.3333V22.6667C17 23.219 17.4477 23.6667 18 23.6667C18.5523 23.6667 19 23.219 19 22.6667V17.3333Z" fill="white" />
          </svg>
        ) : (
          <svg width="40" height="36" viewBox="0 0 40 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4.93549" y="6" width="29.6129" height="24" rx="2" fill="black" fillOpacity="0.49" />
            <path d="M13.1613 15L13.1613 24" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19.7419 18V24" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M26.3226 12V24" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </StatsIcon>
      <Switch data-checked={checked} onClick={onChange}>
        <Handle checked={checked} />
      </Switch>
    </Container>
  );
};

export default ThemeSwitch;
