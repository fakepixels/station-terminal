import { useEffect } from 'react';
import styled from '@emotion/styled';
import { client } from '../utils/apollo/client';
import { MEMBERS } from '../utils/apollo/queries';
import { useContracts } from '../shared/contexts';
import { handleError } from '../utils/contract/helper';
import TopBar from './shared/Topbar';
import { Body1, Heading1 } from '../shared/style/theme';
import { useDispatch } from 'react-redux';
import { userProfileActions } from '../state/userProfile/userProfileActions';
import { appStateActions, MODAL } from '../state/appState/appStateActions';
import { applicationActions } from '../state/application/applicationActions';
import { useApplicationState } from '../state/application/applicationSelectors';

export interface Member {
  alias: string;
  id: string;
  address: string;
}

const ContributorsList = (): JSX.Element => {
  const { contracts } = useContracts();
  const applicationState = useApplicationState();
  const dispatch = useDispatch();

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
        dispatch(applicationActions.setUserList(res.data.members));
      } catch (err: any) {
        handleError(err);
      }
    };
    fetch();
  }, [contracts]);

  const selectContributor = (address: string) => {
    dispatch(appStateActions.setModal(MODAL.CONTRIBUTOR_PROFILE));
    dispatch(userProfileActions.setSelectedDirectoryUser(address));
  };

  return (
    <ContributorsListWrapper>
      <TopBar mandatory={false} />
      <ContributorListBodyWrapper>
        <Title>CONTRIBUTOR DIRECTORY</Title>
        <AliasesWrapper>
          {applicationState.userList?.map((member: Member, idx: number) => (
            <Alias
              key={'alias' + idx}
              onClick={() => selectContributor(member.address)}
            >
              @{member.alias}
            </Alias>
          ))}
        </AliasesWrapper>
      </ContributorListBodyWrapper>
    </ContributorsListWrapper>
  );
};

export default ContributorsList;

const ContributorsListWrapper = styled.div`
  background-color: #feecde;
  max-height: 370px;
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
  cursor: pointer;
`;
