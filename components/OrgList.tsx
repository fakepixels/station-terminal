import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useContracts } from '../shared/contexts';
import { Body1, Heading1 } from '../shared/style/theme';
import { handleError } from '../utils/contract/helper';
import { Divider } from './shared/Divider';
import { ORGS } from '../utils/apollo/queries';
import { client } from '../utils/apollo/client';
import { ZERO_ADDRESS } from '../utils/keys';

interface docLinkProps {
  linkTitle: string;
  url: string;
}

const DocsLink = (props: docLinkProps): JSX.Element => {
  const { linkTitle, url } = props;

  return (
    <DocsLinkWrapper href={url}>
      <DocsLinkArrowIcon src={'/Arrow.svg'} alt={'arrow icon'} />
      <DocsLinkText>{linkTitle}</DocsLinkText>
    </DocsLinkWrapper>
  );
};

const OrgList = (): JSX.Element => {
  const { contracts } = useContracts();

  const [orgs, setOrgs] = useState<[any]>();

  const getOrgs = async () => {
    try {
      const res = await client.query({
        query: ORGS,
      });

      setOrgs(res.data.defaultOSs);
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    getOrgs();
  }, [contracts]);

  return (
    <OrgListWrapper>
      <OrgListHeaderContainer>
        <OrgListSummaryWrapper>
          <OrgListTitle>DEFAULT TERMINALS</OrgListTitle>
        </OrgListSummaryWrapper>
        <OrgListDescription>
          <OrgListDescriptionLabel>
            List of organizations
          </OrgListDescriptionLabel>
        </OrgListDescription>
      </OrgListHeaderContainer>

      <Divider />

      <OrgListContainer>
        <OrgListSummaryText>
          Default DAOs operate through governance, payments, and peer-to-peer
          coordination mechanisms that align incentives across organizational
          stakeholders and optimize for fairness and meritocracy.
        </OrgListSummaryText>
        <OrgListMapping>
          {orgs?.map((org) => {
            if (org.name == ZERO_ADDRESS) return;
            return (
              <DocsLink
                key={org.id}
                linkTitle={org.name}
                url={'/' + org.name}
              />
            );
          })}
        </OrgListMapping>
      </OrgListContainer>
    </OrgListWrapper>
  );
};

export default OrgList;

const OrgListWrapper = styled.div`
  background-color: #090909;
  width: 355px;
  max-height: 370px;
`;

const OrgListSummaryWrapper = styled.div``;

const OrgListTitle = styled(Heading1)`
  color: ${(props) => props.theme.colors.white};
  margin-bottom: 16px;
`;

const OrgListHeaderContainer = styled.div`
  padding: 20px;
`;

const OrgListDescription = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const OrgListDescriptionLabel = styled(Body1)`
  color: ${(props) => props.theme.colors.white};
  margin: 4px;
`;

const OrgListContainer = styled.div`
  margin: 20px 20px 16px 16px;
`;

const OrgListSummaryText = styled(Body1)`
  color: ${(props) => props.theme.colors.white};
  margin-bottom: 16px;
`;

const OrgListMapping = styled.div`
  max-height: 100px;
  overflow-y: auto;
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
