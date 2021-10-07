import { useState } from 'react';
import styled from '@emotion/styled';
import { ethers } from 'ethers';
import { Body1, Heading1 } from '../../shared/style/theme';
import Button from '../shared/Button';
import Input from '../shared/Input/Index';
import { useContracts } from '../../shared/contexts';
import { handleError } from '../../utils/contract/endorsement';

const MasterContainer = styled.div`
  width: 400px;
  margin: 100px auto;
  background-color: ${(props) => props.theme.colors.black};
  padding: 36px 16px;
  color: ${(props) => props.theme.colors.green};
`;

const LoginHeaderText = styled(Heading1)`
  margin-bottom: 20px;
`;

const LoginBodyText = styled(Body1)`
  margin-bottom: 16px;
  text-transform: uppercase;
`;

const InputContainer = styled.div`
  margin-bottom: 16px;
`;

interface ownProps {
  finishAlias: () => void;
}

const Login = (props: ownProps): JSX.Element => {
  const { finishAlias } = props;
  const { contracts } = useContracts();
  const [alias, setAlias] = useState('');

  const submitAlias = async () => {
    console.log(ethers.utils.formatBytes32String(alias));
    try {
      await contracts.MBR.setAlias(ethers.utils.formatBytes32String(alias));
      finishAlias();
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <MasterContainer>
      <LoginHeaderText>Pick an alias</LoginHeaderText>
      <LoginBodyText>Anom is welcomed ~</LoginBodyText>
      <InputContainer>
        <Input
          value={alias}
          onChange={(e: any) => setAlias(e.target.value)}
          width="100%"
        />
      </InputContainer>
      <Button
        width="100%"
        onClick={() => {
          submitAlias();
        }}
      >
        CONTINUE
      </Button>
    </MasterContainer>
  );
};

export default Login;
