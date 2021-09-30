import styled from '@emotion/styled';
import React from 'react';

import Navbar from './NavBar';

const BackgroundWrapper = styled.div`
  position: absolute;
  top: 0px;
  z-index: -1;
  height: 100%;
  width: 100%;
  background: linear-gradient(#ffffff, #ff816e);
`;

const BackgroundGrid = styled.div`
  height: 100%;
  width: 100%;
  background-image: url('/Grid.svg');
`;

const Background = () => {
  return (
    <BackgroundWrapper>
      <BackgroundGrid></BackgroundGrid>
    </BackgroundWrapper>
  );
};

export default function Layout({
  children,
}: {
  children: React.ReactChild | React.ReactChild[];
}): JSX.Element {
  return (
    <>
      <Navbar />
      <Background />
      <main>{children}</main>
    </>
  );
}
