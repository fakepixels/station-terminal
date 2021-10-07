import { useState } from 'react';
import styled from '@emotion/styled';
import { GlobalNavigation } from '../../shared/style/theme';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import Chevron from '../assets/Chevron';

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
  text-transform: uppercase;
`;

const DisconnectText = styled(GlobalNavigation)`
  cursor: pointer;
`;

const DropdownContainer = styled.div`
  position: absolute;
  padding: 16px;
  top: 57px;
  border: 1px solid black;
  border-right: none;
  right: 0;
  background-color: ${(props) => props.theme.colors.white};
`;

const trimmedAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(
    address.length - 5,
    address.length,
  )}`;
};

const ChevronContainer = styled.div`
  margin-left: 16px;
  cursor: pointer;
`;

const Flipped = styled.div`
  transform: rotate(180deg);
`;

const NavBar = (): JSX.Element => {
  const { active, account, deactivate } = useWeb3React<Web3Provider>();

  const [isDropdownOpen, setIsDropdownOen] = useState<boolean>(false);

  const toggleDropdown = () => {
    setIsDropdownOen(!isDropdownOpen);
  };

  return (
    <Wrapper>
      <LogoWrapper>
        <FiveCircles
          src="/FiveCircles.svg"
          alt="Design of 5 subway stop circles"
        />
        <StationLogoText>STATION</StationLogoText>
      </LogoWrapper>
      {active && (
        <ControlWrapper>
          <DropdownWrapper>
            <GlobalNavigation>{trimmedAddress(account || '')}</GlobalNavigation>
            <ChevronContainer onClick={() => toggleDropdown()}>
              {isDropdownOpen ? (
                <Flipped>
                  <Chevron />
                </Flipped>
              ) : (
                <Chevron />
              )}
            </ChevronContainer>
          </DropdownWrapper>

          {isDropdownOpen && active && (
            <DropdownContainer>
              <DisconnectText
                onClick={() => {
                  deactivate();
                  setIsDropdownOen(false);
                }}
              >
                Disconnect
              </DisconnectText>
            </DropdownContainer>
          )}
        </ControlWrapper>
      )}
    </Wrapper>
  );
};

export default NavBar;
