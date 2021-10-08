import { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { Web3Provider } from '@ethersproject/providers';
import Button from '../shared/Button';
import Input from '../shared/Input';
import { formatMembers, Page } from './helper';
import { useContracts, useEndorsement } from '../../shared/contexts';
import { Divider } from '../shared/Divider';
import { Body1, Heading1, Heading4 } from '../../shared/style/theme';
import { client } from '../../utils/apollo/client';
import {
  ENDORSEMENTS,
  ENDORSEMENTS_FROM_MEMBER,
} from '../../utils/apollo/queries';
import { Member } from '../../utils/apollo/queryTypes';
import {
  getAvailableEndorsements,
  handleError,
} from '../../utils/contract/helper';
import TextLoadingDots from '../shared/Loading/TextDots';
import { useWeb3React } from '@web3-react/core';

const EndorsementScreen = (): JSX.Element => {
  const { contracts } = useContracts();
  const { account } = useWeb3React<Web3Provider>();

  const [availableEndorsement, setAvailableEndorsements] = useState<
    number | null
  >();
  const [loading, isLoading] = useState<boolean>(true);
  //Separate saved (to the contract) and unsaved inputs to distinguish if user has edited the field
  const [savedEndorsements, setSavedEndorsements] = useState<
    Record<string, number>
  >({});
  const [unsavedEndorsements, setUnsavedEndorsements] = useState<
    Record<string, number>
  >({});
  const [members, setMembers] = useState<Member[]>([]);
  const endorsementState = useEndorsement();

  const onSingleEndorsementChange = (key: string, value: number): void => {
    if (value < 0) return;
    const newEndorsements = { ...savedEndorsements };
    newEndorsements[key] = value;
    setUnsavedEndorsements(newEndorsements);
  };

  const fetchEndorsements = async () => {
    try {
      if (!account || !contracts || !contracts.OS) return;

      const os = contracts.OS.address.toLowerCase();
      const { data } = await client.query({
        query: ENDORSEMENTS,
        variables: { os },
      });

      const fetchedEndorsements = await client.query({
        query: ENDORSEMENTS_FROM_MEMBER,
        variables: {
          os,
          from: `${os}-${account.toLowerCase()}`,
        },
      });

      const newEndorsements: any = {};
      for (const a in fetchedEndorsements.data.endorsements) {
        const endorsement = fetchedEndorsements.data.endorsements[a];
        newEndorsements[endorsement.to.address] = endorsement.amount * 1000;
      }
      setMembers(formatMembers(data.members));
      setUnsavedEndorsements(newEndorsements);
      setSavedEndorsements(newEndorsements);
    } catch (err: any) {
      handleError(err);
    }
  };

  const fetchAvailableEndorsements = useCallback(async () => {
    try {
      setAvailableEndorsements(
        await getAvailableEndorsements(contracts.MBR, account || ''),
      );
    } catch (err: any) {
      handleError(err);
    }
  }, [contracts, account]);

  const endorse = async (amount: number, address: string) => {
    try {
      const newEndorsement =
        Number(unsavedEndorsements[address]) -
        Number(savedEndorsements[address] ? savedEndorsements[address] : 0);

      if (newEndorsement > 0) {
        await contracts.MBR.endorseMember(address, Math.abs(newEndorsement));
      } else if (newEndorsement < 0) {
        await contracts.MBR.withdrawEndorsementFrom(
          address,
          Math.abs(newEndorsement),
        );
      }

      const newEndorsements = { ...savedEndorsements };
      newEndorsements[address] = amount;
      //Only saving savedEndorsements because unsavedEndorsements is already updated during user input
      setSavedEndorsements(newEndorsements);
      setAvailableEndorsements(
        (availableEndorsement ? availableEndorsement : 0) + newEndorsement * -1,
      );
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
                      value={unsavedEndorsements[member.address]}
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
                        endorse(
                          unsavedEndorsements[member.address],
                          member.address,
                        )
                      }
                      leftFlatBorder
                      disabled={
                        unsavedEndorsements[member.address] ==
                        savedEndorsements[member.address]
                      }
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
