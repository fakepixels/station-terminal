import React from 'react';
import styled from '@emotion/styled';
import { isNil } from 'lodash';

interface inputOwnProps {
  caption?: string;
  value: string;
  onChange: any;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  isTextarea?: boolean;
  rows?: number;
  disableResize?: boolean;
  width?: string;
}

const InputCaptionContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const InputMain = styled.input`
  padding: 10px 12px;
  border: none;
  font-size: 16px;
  transition: 0.05s;
  width: 100%;

  box-sizing: border-box;
  border: 2px solid #d1d1d1;
  color: ${(props) => props.theme.colors.black};
  border-radius: 100px;

  width: ${(props) => (props.width ? props.width : '200px')};

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
  } = props;

  return (
    <React.Fragment>
      <InputCaptionContainer>
        {!isNil(caption) && <div>{caption}</div>}
      </InputCaptionContainer>

      <InputMain
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength || 1000000}
        disabled={disabled}
        width={width}
      />
    </React.Fragment>
  );
};

export default Input;
