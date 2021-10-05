import { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import Button from '../shared/Button';
import Input from '../shared/Input';
import { formatMembers, Page } from './helper';
import {
  useAccount,
  useContracts,
  useEndorsement,
} from '../../shared/contexts';
import { Divider } from '../shared/Divider';
import { Body1, Heading1, Heading4 } from '../../shared/style/theme';
import { client } from '../../apollo/client';
import { ENDORSEMENTS } from '../../apollo/queries';
import { Member } from '../../apollo/queryTypes';
import {
  getAvailableEndorsements,
  handleError,
} from '../../utils/contract/endorsement';
import TextLoadingDots from '../shared/Loading/TextDots';

const EndorsementScreen = (): JSX.Element => {
  const { contracts } = useContracts();
  const account = useAccount();

  const [availableEndorsement, setAvailableEndorsements] = useState<
    number | null
  >();
  const [loading, isLoading] = useState<boolean>(true);
  const [endorsements, setEndorsements] = useState<Record<string, number>>({});
  const [members, setMembers] = useState<Member[]>([]);
  const endorsementState = useEndorsement();

  const onSingleEndorsementChange = (key: string, value: number): void => {
    const newEndorsements = { ...endorsements };
    newEndorsements[key] = value;
    setEndorsements(newEndorsements);
  };

  const fetchEndorsements = async () => {
    try {
      const { data } = await client.query({
        query: ENDORSEMENTS,
        variables: { os: contracts.OS.address.toLowerCase() },
      });

      setMembers(formatMembers(data.members));
    } catch (err: any) {
      handleError(err);
    }
  };

  const fetchAvailableEndorsements = useCallback(async () => {
    try {
      setAvailableEndorsements(
        await getAvailableEndorsements(contracts.MBR, account),
      );
    } catch (err: any) {
      // handleError(err);
    }
  }, [contracts, account]);

  const endorse = async (amount: number, address: string) => {
    try {
      await contracts.MBR.endorseMember(address, amount);
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        isLoading(true);
        await fetchEndorsements();
      } catch (err: any) {
        console.log(err);
      } finally {
        isLoading(false);
      }
    };

    if (contracts.OS) {
      fetch();
    }
  }, [contracts]);

  useEffect(() => {
    if (!contracts || !contracts.MBR) return;
    fetchAvailableEndorsements();
  }, [contracts]);

  return (
    <>
      <EndorsementHeaderArea>
        <EndorsementModalHello>
          <Heading1>Endorse</Heading1>
          <Button secondary onClick={() => endorsementState.setPage(Page.mint)}>
            MINT
          </Button>
        </EndorsementModalHello>
        <EndorsementCountContainer>
          <Body1>Endorsement available</Body1>
          {loading ? (
            <TextLoadingDots />
          ) : (
            <Body1>{availableEndorsement}</Body1>
          )}
        </EndorsementCountContainer>
      </EndorsementHeaderArea>
      <Divider />

      <EndorsementTableContainer>
        {loading ? (
          <div>Loading ...</div>
        ) : (
          <EndorsementTable>
            <EndorsementTableRowContainer>
              <EndorsementTableHeaderText>
                <Heading4>Contributors</Heading4>
              </EndorsementTableHeaderText>

              <EndorsementTableHeaderText>
                <Heading4>Endorsement Received</Heading4>
              </EndorsementTableHeaderText>

              <EndorsementTableHeaderText>
                <Heading4>Amount to Endorse</Heading4>
              </EndorsementTableHeaderText>
            </EndorsementTableRowContainer>
            {members.map((member: Member) => (
              <EndorsementTableRowContainer key={member.address}>
                <td>@{member.alias}</td>
                <td>{member.endorsementsReceived}</td>
                <tr>
                  <EndorsementTableRowCell>
                    <Input
                      value={endorsements[member.address]}
                      type="number"
                      onChange={(e: any) =>
                        onSingleEndorsementChange(
                          member.address,
                          e.target.value,
                        )
                      }
                      rightFlatBorder
                    />
                    <Button
                      onClick={() =>
                        endorse(endorsements[member.address], member.address)
                      }
                      leftFlatBorder
                    >
                      Endorse
                    </Button>
                  </EndorsementTableRowCell>
                </tr>
              </EndorsementTableRowContainer>
            ))}
          </EndorsementTable>
        )}
      </EndorsementTableContainer>
    </>
  );
};

export default EndorsementScreen;

const EndorsementHeaderArea = styled.div`
  padding: 20px;
`;

const EndorsementModalHello = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 30px;
`;

const EndorsementCountContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const EndorsementTableContainer = styled.div`
  padding: 20px;
`;

const EndorsementTableHeaderText = styled.th`
  height: 30px;
  text-transform: uppercase;
`;

const EndorsementTable = styled.table`
  width: 100%;
`;

const EndorsementTableRowContainer = styled.tr`
  text-align: left;
`;

const EndorsementTableRowCell = styled.td`
  text-align: left;
  display: flex;
  flex-direction: row;
`;