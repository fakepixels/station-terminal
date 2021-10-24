import React from 'react';
import styled from '@emotion/styled';
import Layout from '../components/shared/Layout';
import OrgList from '../components/OrgList';

const Home = (): JSX.Element => {
  return <div></div>;
};

Home.getLayout = function getLayout() {
  return (
    <Layout>
      <ContentWrapper>
        <OrgList />
      </ContentWrapper>
    </Layout>
  );
};

const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 760px) {
    padding: 10px;
  }
`;

export default Home;
