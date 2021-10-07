import React from 'react';
import styled from '@emotion/styled';

interface ButtonMainProps {
  secondary: boolean;
  disabled: boolean;
  width?: string;
  leftFlatBorder?: boolean;
}

const ButtonMain = styled.button<ButtonMainProps>`
  color: ${(props) =>
    props.secondary ? props.theme.colors.primary : props.theme.colors.black};
  background-color: ${(props) =>
    props.secondary ? props.theme.colors.black : props.theme.colors.green};
  padding: 9px 18px;
  outline: none;
  border: 1px solid
    ${(props) =>
      props.theme.colors.secondary
        ? props.theme.colors.primary
        : props.theme.colors.black};
  border-radius: ${(props) => (props.leftFlatBorder ? '0px' : '100px')} 100px
    100px ${(props) => (props.leftFlatBorder ? '0px' : '100px')};
  font-family: Favorit Pro;
  font-size: 14px;
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
  width: ${(props) => props.width && props.width};
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
  leftFlatBorder?: boolean;
}

const Button = (props: ownProps): JSX.Element => {
  const {
    children,
    disabled,
    secondary,
    width,
    onClick,
    leftFlatBorder,
    ...otherProps
  } = props;

  return (
    <ButtonMain
      secondary={secondary || false}
      disabled={disabled || false}
      width={width}
      onClick={onClick}
      leftFlatBorder={leftFlatBorder || false}
      {...otherProps}
    >
      {children}
    </ButtonMain>
  );
};

export default Button;
