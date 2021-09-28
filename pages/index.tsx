import * as React from 'react';
import type { ReactElement } from 'react';

import Layout from '../components/shared/Layout';

const Home = (): JSX.Element => {
  return <div>TODO: Redirect to sign-in</div>;
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
