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
}

const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ checked, onChange }) => {
  return (
    <Container>
      <StatsIcon>
        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20">
          <path fill="currentColor" d="M16,11V3H8v6H2v12h20V11H16z M10,5h4v14h-4V5z M4,11h4v8H4V11z M20,19h-4v-6h4V19z"></path>
        </svg>
      </StatsIcon>
      <Switch data-checked={checked} onClick={onChange}>
        <Handle checked={checked} />
      </Switch>
    </Container>
  );
};

export default ThemeSwitch;
