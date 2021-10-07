import styled from '@emotion/styled';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Body1, Heading1 } from '../../shared/style/theme';
import { injected } from '../../shared/wallet/initializeWallet';
import Button from '../shared/Button';

const LoginContainer = styled.div`
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
  margin-bottom: 60px;
  text-transform: uppercase;
`;

const Login = (): JSX.Element => {
  const { account, activate } = useWeb3React<Web3Provider>();

  return (
    <LoginContainer>
      {account}
      <LoginHeaderText>Welcome to Station</LoginHeaderText>
      <LoginBodyText>
        HERE, YOU’LL BE ABLE TO NAVIGATE AND CONTRIBUTE TO OUR DECENTRALIZED
        FUTURE. Your FIRST STOP IS DEFAULT.
      </LoginBodyText>
      <Button
        width="100%"
        onClick={() => {
          activate(injected);
        }}
      >
        CONNECT WALLET
      </Button>
    </LoginContainer>
  );
};

export default Login;
