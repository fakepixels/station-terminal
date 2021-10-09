import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { client } from '../utils/apollo/client';
import { MEMBERS } from '../utils/apollo/queries';
import { useContracts } from '../shared/contexts';
import { handleError } from '../utils/contract/helper';

import TopBar from './shared/Topbar';
import { Body1, Heading1 } from '../shared/style/theme';

const ContributorsListWrapper = styled.div`
  background-color: #feecde;
  max-height: 350px;
  max-width: 408px;
  overflow: scroll;
  border: 1px solid ${(props) => props.theme.colors.black};
`;

const ContributorListBodyWrapper = styled.div`
  padding: 20px;
`;

const AliasesWrapper = styled.div`
  column-count: 2;
`;

const Title = styled(Heading1)`
  margin-bottom: 20px;
  text-transform: uppercase;
`;

const Alias = styled(Body1)`
  margin-bottom: 10px;
`;

interface Member {
  alias: string;
  id: string;
}

const ContributorsList = (): JSX.Element => {
  const { contracts } = useContracts();

  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const fetch = async () => {
      if (!contracts || !contracts.OS) return;
      try {
        const res = await client.query({
          query: MEMBERS,
          variables: {
            os: contracts.OS.address.toLowerCase(),
          },
        });
        setMembers(res.data.members);
      } catch (err: any) {
        handleError(err);
      }
    };
    fetch();
  }, [contracts]);

  return (
    <ContributorsListWrapper>
      <TopBar mandatory={false} />
      <ContributorListBodyWrapper>
        <Title>CONTRIBUTOR DIRECTORY</Title>
        <AliasesWrapper>
          {members.map((member: Member, i: number) => (
            <Alias key={'alias' + i}>@{member.alias}</Alias>
          ))}
        </AliasesWrapper>
      </ContributorListBodyWrapper>
    </ContributorsListWrapper>
  );
};

export default ContributorsList;
