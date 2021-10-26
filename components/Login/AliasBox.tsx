import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { Body1, Heading1 } from '../../shared/style/theme';
import Button from '../shared/Button';
import Input from '../shared/Input/Index';
import { useContracts } from '../../shared/contexts';
import { handleError } from '../../utils/contract/helper';
import { useWeb3React } from '@web3-react/core';

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
  const { account } = useWeb3React<Web3Provider>();
  const { contracts } = useContracts();
  const [alias, setAlias] = useState('');

  const submitAlias = async () => {
    try {
      await contracts.MBR.setAlias(ethers.utils.formatBytes32String(alias));
    } catch (err) {
      handleError(err);
    }
  };

  const listenToAliasEvent = () => {
    if (!contracts || !contracts.MBR || !account) return;
    console.log('Mounted');
    try {
      contracts.MBR.on('MemberRegistered', () => {
        console.log('Registered');
        finishAlias;
      });
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    listenToAliasEvent();
  }, [account, contracts]);

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
