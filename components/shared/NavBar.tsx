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
  background-color: #6a6dcd;
  color: white;
  height: 100%;
  width: 259px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Dropdown = ({ address }: { address: string }) => {
  return <DropdownWrapper>{address}</DropdownWrapper>;
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
        <Dropdown address={'0xfakeaddress'} />
      </ControlWrapper>
    </Wrapper>
  );
};

export default NavBar;
