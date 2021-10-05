import * as React from 'react';
import styled from '@emotion/styled';
import { GlobalNavigation } from '../../shared/style/theme';
import { useAccount } from '../../shared/contexts';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: ${(props) => props.theme.colors.white};
  border-bottom: 1px solid ${(props) => props.theme.colors.black};
  height: 57px;
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 24px;
  gap: 24px;
`;

const FiveCircles = styled.img`
  height: 20px;
`;

const ControlWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
`;

const DropdownWrapper = styled.div`
  border-left: 1px solid ${(props) => props.theme.colors.black};
  color: ${(props) => props.theme.colors.black};
  height: 100%;
  width: 259px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'VT323';
`;

const StationLogoText = styled.div`
  font-size: 30px;
  font-family: 'VT323';
`;

interface DropdownProps {
  address: string;
}

const Dropdown = (props: DropdownProps): JSX.Element => {
  const { address } = props;
  return (
    <DropdownWrapper>
      <GlobalNavigation>{address}</GlobalNavigation>
    </DropdownWrapper>
  );
};

const trimmedAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(
    address.length - 5,
    address.length,
  )}`;
};

const NavBar = (): JSX.Element => {
  const account = useAccount();

  return (
    <Wrapper>
      <LogoWrapper>
        <FiveCircles
          src="/FiveCircles.svg"
          alt="Design of 5 subway stop circles"
        />
        <StationLogoText>STATION</StationLogoText>
      </LogoWrapper>
      <ControlWrapper>
        <Dropdown address={trimmedAddress(account)} />
      </ControlWrapper>
    </Wrapper>
  );
};

export default NavBar;
