import { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { toast } from 'react-toastify';
import { Heading1, CTA0, Body1 } from '../../shared/style/theme';
import { Web3Provider } from '@ethersproject/providers';
import Button from '../shared/Button';
import Input from '../shared/Input';
import { Divider, DottedDivider } from '../shared/Divider';
import { useContracts } from '../../shared/contexts';
import { MintMultipler } from './helper';
import {
  getAvailableEndorsements,
  handleError,
} from '../../utils/contract/helper';
import { useWeb3React } from '@web3-react/core';

const MintPage = (): JSX.Element => {
  const { account } = useWeb3React<Web3Provider>();
  const { contracts } = useContracts();

  const [availableEndorsements, setAvailableEndorsements] = useState<
    number | null
  >();
  const [loading, setLoading] = useState<boolean>(false);
  const [tokenAvailable, setTokenAvailable] = useState<number | null>();
  const [tokenAllowance, setTokenAllowance] = useState<number | null>();
  const [stakeAmount, setStakeAmount] = useState<number>(1); // min 1
  const [lockedWeeks, setLockedWeeks] = useState<number>(50); // min number of weeks

  const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(false);
    setStakeAmount(Number(e.target.value));
  };

  const onWeeksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(false);
    setLockedWeeks(Number(e.target.value));
  };

  const fetchAvailableEndorsements = useCallback(async () => {
    if (!contracts || !contracts.MBR || !account) return;
    try {
      setAvailableEndorsements(
        await getAvailableEndorsements(contracts.MBR, account || ''),
      );
    } catch (err: any) {
      handleError(err);
    }
  }, [contracts, account]);

  const mintEndorsements = useCallback(
    async (weeks: number, amount: number) => {
      if (weeks < 50) {
        toast.error('Must mint at least 50 weeks');
        return;
      }
      if (!contracts || !contracts.MBR) return;
      try {
        await contracts.MBR.mintEndorsements(weeks, amount);
      } catch (err: any) {
        handleError(err);
      }
    },
    [contracts, account],
  );

  const approveTokens = useCallback(
    async (amount: number) => {
      if (!contracts || !contracts.MBR) return;
      try {
        await contracts.TKN.approve(contracts.MBR.address, amount);
        setLoading(true);
      } catch (err: any) {
        console.log(err);
      }
    },
    [contracts, account],
  );

  const getTokenAllowance = async (account: string) => {
    if (!contracts || !contracts.TKN || !account) return;
    try {
      const res = await contracts.TKN.allowance(account, contracts.MBR.address);
      setTokenAllowance(res.toNumber());
    } catch (err: any) {
      handleError(err);
    }
  };

  const getTokenBalance = async (account: string) => {
    if (!contracts || !contracts.TKN || !account) return;
    try {
      const res = await contracts.TKN.balanceOf(account);
      setTokenAvailable(res.toNumber());
    } catch (err: any) {
      handleError(err);
    }
  };

  const listenToApprovalEvent = () => {
    if (!contracts || !contracts.TKN || !account) return;
    try {
      contracts.TKN.on('Approval', (owner, spender, amount) => {
        amount = amount.toNumber();
        if (owner == account && amount >= stakeAmount) {
          setTokenAllowance(amount);
          setLoading(false);
        }
      });
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAvailableEndorsements();
    getTokenAllowance(account || '');
    getTokenBalance(account || '');
    listenToApprovalEvent();
  }, [contracts, account]);

  return (
    <MintPageMasterContainer>
      <div>
        <MintHeaderContainer>
          <HeaderContainer>
            <Heading1>MINT ENDORSEMENTS</Heading1>
          </HeaderContainer>
          <MintRowContainer>
            <Body1>Endorsements Available</Body1>
            <Body1>{availableEndorsements}</Body1>
          </MintRowContainer>

          <MintRowContainer>
            <Body1>Total $DEF available</Body1>
            <Body1>{tokenAvailable}</Body1>
          </MintRowContainer>
        </MintHeaderContainer>
        <Divider />

        <MintBottomContainer>
          <MintBottomTopContainer>
            <MintRowContainer>
              <Body1>Tokens to stake</Body1>
              <Input
                value={stakeAmount}
                onChange={onAmountChange}
                type="number"
                placeholder="$DEF"
              />
            </MintRowContainer>
            <MintRowContainer>
              <Body1>Number of weeks locked (Min 50)</Body1>
              <Input
                value={lockedWeeks}
                onChange={onWeeksChange}
                type="number"
                placeholder="WEEKS"
              />
            </MintRowContainer>

            <DottedDivider />

            <MintRowContainer>
              <Body1>Endorsements</Body1>
              <CTA0>{MintMultipler(lockedWeeks) * stakeAmount}</CTA0>
            </MintRowContainer>
            <br />
          </MintBottomTopContainer>
        </MintBottomContainer>
      </div>
      <BottomCTAContainer>
        <Button
          width="100%"
          disabled={loading}
          onClick={() => {
            if (tokenAllowance && tokenAllowance < stakeAmount) {
              approveTokens(stakeAmount);
            } else {
              mintEndorsements(lockedWeeks, stakeAmount);
            }
          }}
        >
          {tokenAllowance && tokenAllowance < stakeAmount ? 'Approve' : 'Mint'}
        </Button>
      </BottomCTAContainer>
    </MintPageMasterContainer>
  );
};

export default MintPage;

const HeaderContainer = styled.div`
  margin-bottom: 24px;
`;

const MintHeaderContainer = styled.div`
  padding: 16px;
`;

const MintBottomContainer = styled.div`
  padding: 16px;
`;

const MintBottomTopContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const MintRowContainer = styled.div`
  padding: 2px 0px;
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const MintPageMasterContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const BottomCTAContainer = styled.div`
  padding: 20px;
`;
