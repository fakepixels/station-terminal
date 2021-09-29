import styled from '@emotion/styled';
import * as React from 'react';

import { useContracts } from '../shared/contexts';

const DAOSummaryWrapper = styled.div`
  background-color: #090909;
  margin: 50px 10px 0px 0px;
  height: 347px;
  width: 355px;
`;

const DaoSummaryContibutionsWrapper = styled.div``;

const DaoSummaryContibutionsTitle = styled.div`
  font-family: Terminal;
  font-size: 30px;
  color: ${(props) => props.theme.colors.white};
  margin: 20px 16px 0px;
`;

const DaoSummaryContibutionsGrid = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: 20px 20px;
  color: ${(props) => props.theme.colors.white};
  margin: 12px 16px 20px;
`;

const DaoSummaryLabel = styled.p`
  color: ${(props) => props.theme.colors.white};
  font-size: 14px;
  font-family: Favorit Pro;
`;

const DaoSummaryValue = styled.p`
  text-align: right;
  color: ${(props) => props.theme.colors.white};
  font-size: 14px;
  font-family: Favorit Pro;
`;

const DaoSummaryToken = styled.span`
  color: #626262;
`;

const DaoSummaryDivider = styled.div`
  border-bottom: 1px solid #626262;
  width: 100%;
`;

const DaoSummaryTextWrapper = styled.div`
  margin: 20px 20px 16px 16px;
`;

const DAOSummaryText = styled.p`
  color: ${(props) => props.theme.colors.white};
  font-size: 14px;
  font-family: Favorit Pro;
`;

const DocsLinkWrapper = styled.a`
  display: flex;
  flex-direction: row;
`;

const DocsLinkArrowIcon = styled.img`
  margin-right: 10px;
`;

const DocsLinkText = styled.p`
  color: ${(props) => props.theme.colors.green};
  font-size: 14px;
  font-family: Favorit Pro;
  margin: 0px;
`;

const DocsLink = ({
  linkTitle,
  url,
}: {
  linkTitle: string;
  url: string;
}): JSX.Element => {
  return (
    <DocsLinkWrapper href={url} target="_blank">
      <DocsLinkArrowIcon src={'/Arrow.svg'} alt={'arrow icon'} />
      <DocsLinkText>{linkTitle}</DocsLinkText>
    </DocsLinkWrapper>
  );
};

const OrgSummary = (): JSX.Element => {
  const { contracts } = useContracts();
  const [week, setWeek] = React.useState('');
  const [budget, setBudget] = React.useState('');
  const [tokenSymbol, setTokenSymbol] = React.useState('');
  const contributorCount = 25;

  const getEpoch = async () => {
    if (!contracts || !contracts.EPC) return;
    try {
      const epoch = await contracts.EPC.current();
      setWeek(epoch);
    } catch (err) {
      console.log('ERR: ', err);
    }
  };

  const getBudget = async () => {
    if (!contracts || !contracts.EPC) return;
    try {
      const res = await contracts.EPC.TOKEN_BONUS();
      setBudget(res.toNumber());
    } catch (err) {
      console.log('ERR: ', err);
    }
  };

  const getSymbol = async () => {
    if (!contracts || !contracts.TKN) return;
    try {
      const res = await contracts.TKN.symbol();
      setTokenSymbol(res);
    } catch (err) {
      console.log('ERR: ', err);
    }
  };

  React.useEffect(() => {
    getEpoch();
    getBudget();
    getSymbol();
  }, [contracts]);

  return (
    <DAOSummaryWrapper>
      <DaoSummaryContibutionsWrapper>
        <DaoSummaryContibutionsTitle>WEEK {week}</DaoSummaryContibutionsTitle>
      </DaoSummaryContibutionsWrapper>
      <DaoSummaryContibutionsGrid>
        <DaoSummaryLabel>Contributors</DaoSummaryLabel>
        <DaoSummaryValue>{contributorCount}</DaoSummaryValue>
        <DaoSummaryLabel>Contributor budget</DaoSummaryLabel>
        <DaoSummaryValue>
          {budget} <DaoSummaryToken>{'$' + tokenSymbol}</DaoSummaryToken>
        </DaoSummaryValue>
      </DaoSummaryContibutionsGrid>
      <DaoSummaryDivider />
      <DaoSummaryTextWrapper>
        <DAOSummaryText>
          Default creates building blocks for governance, payments, and
          peer-to-peer coordination mechanisms that align incentives across
          organizational stakeholders and optimize for fairness and meritocracy.
        </DAOSummaryText>
        <DocsLink linkTitle={'Contributor Directory'} url={'/'} />
        <DocsLink linkTitle={'Docs'} url={'/'} />
        <DocsLink linkTitle={'Discord'} url={'/'} />
        <DocsLink linkTitle={'Twitter'} url={'/'} />
        <DocsLink linkTitle={'Github'} url={'/'} />
      </DaoSummaryTextWrapper>
    </DAOSummaryWrapper>
  );
};

export default OrgSummary;
