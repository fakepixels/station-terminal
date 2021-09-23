import Navbar from './NavBar';
import React from 'react';

export default function Layout({
  children,
}: {
  children: React.ReactChild | React.ReactChildren;
}): JSX.Element {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
