import React from 'react';
import styled from '@emotion/styled';
import { isNil } from 'lodash';

interface inputOwnProps {
  caption?: string;
  value: string | number;
  onChange: any;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  isTextarea?: boolean;
  rows?: number;
  disableResize?: boolean;
  width?: string;
  type?: string;
  margin?: string;
  rightFlatBorder?: boolean;
}

const InputCaptionContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 8px;
  -webkit-appearance: none;
  margin: 0;
`;

interface inputProps {
  rightFlatBorder?: boolean;
  margin?: string;
}

const InputMain = styled.input<inputProps>`
  padding: 6px 12px;
  border: none;
  font-size: 16px;
  transition: 0.05s;
  width: 100%;

  color: ${(props) => props.theme.colors.white};
  box-sizing: border-box;
  border-width: 2px;
  border-style: solid;
  margin: ${(props) => (props.margin ? props.margin : '0px')};
  border-color: ${(props) => props.theme.colors.gray};
  border-right: ${(props) => props.rightFlatBorder && 'none'};

  background-color: black;

  width: ${(props) => (props.width ? props.width : '90px')};
  border-radius: 100px ${(props) => (props.rightFlatBorder ? '0px' : '100px')}
    ${(props) => (props.rightFlatBorder ? '0px' : '100px')} 100px;

  &:focus {
    outline: none;
  }
`;

const Input = (props: inputOwnProps): JSX.Element => {
  const {
    caption,
    value,
    onChange,
    placeholder,
    maxLength,
    disabled,
    width,
    type,
    margin,
    rightFlatBorder,
  } = props;

  return (
    <React.Fragment>
      {!isNil(caption) && (
        <InputCaptionContainer>{caption}</InputCaptionContainer>
      )}

      <InputMain
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength || 1000000}
        disabled={disabled}
        width={width}
        type={type}
        margin={margin}
        rightFlatBorder={rightFlatBorder || false}
      />
    </React.Fragment>
  );
};

export default Input;
