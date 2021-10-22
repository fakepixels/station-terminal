import React from 'react';
import type { ReactElement } from 'react';
import Layout from '../components/shared/Layout';

const Home = (): JSX.Element => {
  return <div></div>;
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
