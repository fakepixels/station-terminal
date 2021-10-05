import styled from '@emotion/styled';
import * as React from 'react';
import { client } from '../apollo/client';
import { MEMBERS } from '../apollo/queries';

import TopBar from './shared/TopBar';

const ContributorsListWrapper = styled.div`
  background-color: #feecde;
  height: 461px;
  max-width: 408px;
  overflow: scroll;
`;

const ContributorsListTitle = styled.h2`
  margin: 20px;
  font-family: Terminal;
  font-size: 30px;
`;

const AliasesWrapper = styled.div`
  column-count: 2;
  margin: 0px 20px;
`;

const Alias = styled.div`
  margin-bottom: 10px;
  font-size: 14px;
  font-family: Favorit Pro;
`;

type Member = {
  alias: string;
  id: string;
};

const ContributorsList = (): JSX.Element => {
  const [members, setMembers] = React.useState<Array<Member>>([]);

  React.useEffect(() => {
    const fetch = () => {
      //testOS os address to use as an example. Remove later
      const testOS = '0xb7a5bd0345ef1cc5e66bf61bdec17d2461fbd968';
      client
        .query({
          query: MEMBERS,
          variables: {
            os: testOS,
          },
        })
        .then((res) => {
          setMembers(res.data.members);
        })
        .catch((e) => {
          console.log(e);
        });
    };
    fetch();
  }, []);
  return (
    <ContributorsListWrapper>
      <TopBar mandatory={false} />
      <ContributorsListTitle>CONTRIBUTOR DIRECTORY</ContributorsListTitle>
      <AliasesWrapper>
        {members.map((member: Member, i: number) => (
          <Alias key={'alias' + i}>@{member.alias}</Alias>
        ))}
      </AliasesWrapper>
    </ContributorsListWrapper>
  );
};

export default ContributorsList;
