import styled from '@emotion/styled';
import * as React from 'react';

export interface FormData {
  [key: string]: string;
}

interface Input {
  key: string;
  placeholder: string;
}

const FormTitle = styled.div`
  font-size: 20px;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  margin: 20px 4px;
  padding: 4px;
  background-color: #fff2f2;
`;

const ResultContainer = styled.div<{ isError: boolean }>`
  margin-top: 10px;
  color: ${({ isError }) => (isError ? 'red' : 'black')};
  word-wrap: break-word;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

  input {
    margin: 2px;
  }
`;

const SubmitButton = styled.button`
  background-color: #2272eb;
  color: #ffffff;
  font-weight: 900;
`;

const createFormData = (inputs: Input[]) => {
  const formData = {};
  inputs.forEach((elem) => {
    formData[elem.key] = '';
  });
  return formData;
};

const cleanFormData = (formData: FormData): FormData => {
  const newFormData = {};

  for (const input in formData) {
    newFormData[input] = '';
  }

  return newFormData;
};

interface FormProps {
  title: string;
  submitTransaction: (FormData?) => Promise<any>;
  parseResult: (any) => string;
  inputs?: Input[];
  isDisabled?: boolean;
}

export const Form = ({
  title,
  submitTransaction,
  parseResult,
  inputs = [],
  isDisabled = false,
}: FormProps): JSX.Element => {
  const [formData, setFormData] = React.useState<FormData>(
    createFormData(inputs),
  );

  const [result, setResult] = React.useState<string>('');

  const [isError, setIsError] = React.useState<boolean>(false);

  const onClick = async () => {
    try {
      const data = await submitTransaction(formData);
      setResult(parseResult(data));
      setFormData(cleanFormData(formData));
    } catch (error) {
      console.log(error);
      setIsError(true);
      setResult('There has been an error');
    }
  };

  function handleChange(evt) {
    const value =
      evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value;
    setFormData({
      ...formData,
      [evt.target.name]: value,
    });
  }

  return (
    <FormContainer>
      <FormTitle>{title}</FormTitle>
      <InputContainer>
        {inputs.map((elem) => (
          <input
            key={elem.key}
            placeholder={elem.placeholder}
            name={elem.key}
            value={formData[elem.key]}
            onChange={handleChange}
          />
        ))}
      </InputContainer>
      <SubmitButton onClick={onClick} disabled={isDisabled}>
        Submit
      </SubmitButton>
      <ResultContainer isError={isError}>{result}</ResultContainer>
    </FormContainer>
  );
};
