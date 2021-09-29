import styled from '@emotion/styled';
import * as React from 'react';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #f2efef;
  border-bottom: 1px solid #090909;
  height: 57px;
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 24px;
  gap: 24px;
`;

const StationLogo = styled.img`
  height: 24px;
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
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #f2efef;
  font-family: Resistance;
  font-size: 30px;
  border-left: 1px solid #090909;
  padding: 0px 24px;
`;

const DropdownImage = styled.img`
  border-radius: 50%;
  border: 1px solid #090909;
  height: 36px;
  width: 36px;
  margin-right: 10px;
`;

const DropownAddress = styled.div`
  @media (max-width: 480px) {
    display: none;
  }
`;

const Dropdown = ({
  address,
  avatarURL,
}: {
  address: string;
  avatarURL: string;
}) => {
  const truncateAddress = (address: string): string => {
    if (!address) return '';

    const length = address.length;
    return (
      address.substring(0, 4) + '...' + address.substring(length - 4, length)
    );
  };

  const truncatedAddress = truncateAddress(address);

  return (
    <DropdownWrapper>
      <DropdownImage src={avatarURL} />
      <DropownAddress>{truncatedAddress}</DropownAddress>
    </DropdownWrapper>
  );
};

const NavBar = (): JSX.Element => {
  return (
    <Wrapper>
      <LogoWrapper>
        <FiveCircles
          src="/FiveCircles.svg"
          alt="Design of 5 subway stop circles"
        />
        <StationLogo src="/StationLogo.svg" alt="Station Logo" />
      </LogoWrapper>
      <ControlWrapper>
        <Dropdown
          address={'0xfakeaddress'}
          avatarURL={'./sampleAssets/Hobbes.png'}
        />
      </ControlWrapper>
    </Wrapper>
  );
};

export default NavBar;
