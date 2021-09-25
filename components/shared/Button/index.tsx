import React from 'react';
import styled from '@emotion/styled';

interface ButtonMainProps {
  secondary: boolean;
  disabled: boolean;
  width?: string;
}

const ButtonMain = styled.button<ButtonMainProps>`
  color: ${(props) => props.theme.colors.black};
  background-color: ${(props) => props.theme.colors.green};
  padding: 9px 18px;
  outline: none;
  border: 1px solid ${(props) => props.theme.colors.black};
  border-radius: 100px;
  font-family: Favorit Pro;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
  display: inline-block;
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  height: 40px;
  width: ${(props) => (props.width ? props.width : '205px')};
  pointer-events: ${(props) => props.disabled && 'none'};

  &:hover {
    transition: 0.2s;
  }
`;

interface ownProps {
  children: React.ReactNode;
  disabled?: boolean;
  secondary?: boolean;
  width?: string;
  icon?: string;
  onClick?: () => void;
}

const Button = (props: ownProps) => {
  const { children, disabled, secondary, width, onClick, ...otherProps } =
    props;

  return (
    <ButtonMain
      secondary={secondary || false}
      disabled={disabled || false}
      width={width}
      onClick={onClick}
      {...otherProps}
    >
      {children}
    </ButtonMain>
  );
};

export default Button;
