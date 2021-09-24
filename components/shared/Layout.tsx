import styled from '@emotion/styled';
import React from 'react';

import Navbar from './NavBar';

const Main = styled.main``;

export default function Layout({
  children,
}: {
  children: React.ReactChild | React.ReactChild[];
}): JSX.Element {
  return (
    <>
      <Navbar />
      <Main>{children}</Main>
    </>
  );
}
