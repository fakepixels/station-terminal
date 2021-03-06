import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useContracts } from '../shared/contexts';
import { Body1, Heading1 } from '../shared/style/theme';
import { handleError } from '../utils/contract/helper';
import { Divider } from './shared/Divider';
import { useApplicationState } from '../state/application/applicationSelectors';

interface docLinkProps {
  linkTitle: string;
  url: string;
}

const DocsLink = (props: docLinkProps): JSX.Element => {
  const { linkTitle, url } = props;

  return (
    <DocsLinkWrapper href={url} target="_blank">
      <DocsLinkArrowIcon src={'/Arrow.svg'} alt={'arrow icon'} />
      <DocsLinkText>{linkTitle}</DocsLinkText>
    </DocsLinkWrapper>
  );
};

const OrgSummary = (): JSX.Element => {
  const { contracts } = useContracts();
  const appState = useApplicationState();

  const [budget, setBudget] = useState<string>('');

  const getBudget = async () => {
    if (!contracts || !contracts.EPC) return;
    try {
      const res = await contracts.EPC.TOKEN_BONUS();
      setBudget(res.toNumber());
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    getBudget();
  }, [contracts]);

  return (
    <DAOSummaryWrapper>
      <DaoSummaryHeaderContainer>
        <DaoSummaryContributionsWrapper>
          <DaoSummaryContributionsTitle>
            WEEK {appState.currentEpoch}
          </DaoSummaryContributionsTitle>
        </DaoSummaryContributionsWrapper>
        <DaoSummaryStatRow>
          <DaoSummaryLabel>Contributors</DaoSummaryLabel>
          <DaoSummaryValue>{appState.userList?.length}</DaoSummaryValue>
        </DaoSummaryStatRow>

        <DaoSummaryStatRow>
          <DaoSummaryLabel>Contributor Fund</DaoSummaryLabel>
          <DaoSummaryValue>
            {budget}
            <DaoSummaryToken>{'$' + appState.tokenSymbol}</DaoSummaryToken>
          </DaoSummaryValue>
        </DaoSummaryStatRow>
      </DaoSummaryHeaderContainer>

      <Divider />

      <DaoSummaryTextWrapper>
        <DAOSummaryText>
          Default creates building blocks for governance, payments, and
          peer-to-peer coordination mechanisms that align incentives across
          organizational stakeholders and optimize for fairness and meritocracy.
        </DAOSummaryText>
        <DocsLink linkTitle={'Default OS'} url={'https://default-os.xyz/'} />
        <DocsLink linkTitle={'Docs'} url={'/'} />
        <DocsLink linkTitle={'Discord'} url={'/'} />
        <DocsLink linkTitle={'Twitter'} url={'/'} />
        <DocsLink linkTitle={'Github'} url={'/'} />
      </DaoSummaryTextWrapper>
    </DAOSummaryWrapper>
  );
};

export default OrgSummary;

const DAOSummaryWrapper = styled.div`
  background-color: #090909;
  width: 355px;
  max-height: 370px;
`;

const DaoSummaryContributionsWrapper = styled.div``;

const DaoSummaryContributionsTitle = styled(Heading1)`
  color: ${(props) => props.theme.colors.white};
  margin-bottom: 16px;
`;

const DaoSummaryHeaderContainer = styled.div`
  padding: 20px;
`;

const DaoSummaryToken = styled(Body1)`
  margin-left: 4px;
  color: ${(props) => props.theme.colors.gray};
`;

const DaoSummaryStatRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const DaoSummaryLabel = styled(Body1)`
  color: ${(props) => props.theme.colors.white};
  margin: 4px;
`;

const DaoSummaryValue = styled(Body1)`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${(props) => props.theme.colors.white};
`;

const DaoSummaryTextWrapper = styled.div`
  margin: 20px 20px 16px 16px;
`;

const DAOSummaryText = styled(Body1)`
  color: ${(props) => props.theme.colors.white};
  margin-bottom: 16px;
`;

const DocsLinkWrapper = styled.a`
  display: flex;
  flex-direction: row;
  text-decoration: none;
`;

const DocsLinkArrowIcon = styled.img`
  margin-right: 10px;
`;

const DocsLinkText = styled(Body1)`
  color: ${(props) => props.theme.colors.green};
  text-decoration: none;
`;
