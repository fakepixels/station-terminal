import { useState, useCallback, useEffect } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import styled from '@emotion/styled';
import Button from '../shared/Button';
import { Body1 } from '../../shared/style/theme';
import { useContracts } from '../../shared/contexts';
import { handleError } from '../../utils/contract/helper';

const RegistrationBox = (): JSX.Element => {
  const { contracts } = useContracts();
  const { account } = useWeb3React<Web3Provider>();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isRegisteredForNextEpoch, setIsRegisteredForNextEpoch] =
    useState<boolean>(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const getEpoch = async () => {
    if (!contracts || !contracts.EPC || !contracts.PAY) return;
    try {
      const currentEpoch = await contracts.EPC.current();
      const isRegistered = await contracts.PAY.eligibleForRewards(
        currentEpoch + 1,
        account,
      );
      setIsRegisteredForNextEpoch(isRegistered);
    } catch (err) {
      handleError(err);
    }
  };

  const registerForPeerRewards = useCallback(async () => {
    try {
      setIsSubmitting(true);
      if (!contracts || !contracts.PAY) return;
      await contracts.PAY.register();
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsSubmitting(false);
    }
  }, [contracts]);

  useEffect(() => {
    getEpoch();
  }, [contracts]);

  return (
    <>
      {!isRegisteredForNextEpoch && (
        <MasterContainer>
          <TitleBox
            onClick={() => {
              toggleOpen();
            }}
          >
            <RegisterMainText>REGISTER</RegisterMainText>
          </TitleBox>
          {isOpen && (
            <ContentBox>
              <TextContainer>
                Register to reward your collaborators and claim your rewards
                next week before Sunday 11:59PM GMT.
              </TextContainer>
              <Button
                onClick={() => registerForPeerRewards()}
                width="100%"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'SUBMITTING ...' : 'REGISTER'}
              </Button>
            </ContentBox>
          )}
        </MasterContainer>
      )}
    </>
  );
};

export default RegistrationBox;

const MasterContainer = styled.div`
  position: fixed;
  right: 0;
  top: 100px;
  display: flex;
  flex-direction: row;
  height: 160px;
  background-color: ${(props) => props.theme.colors.teal};
  border: 1px solid ${(props) => props.theme.colors.black};
`;

const TitleBox = styled.div`
  padding: 16px 20px;
  cursor: pointer;
  width: 10px;
`;

const RegisterMainText = styled.div`
  transform: rotate(90deg);
  font-family: 'VT323';
  font-size: 30px;
  width: 10px;
`;

const ContentBox = styled.div`
  padding: 16px 20px;
  width: 151px;
  border-left: 1px solid ${(props) => props.theme.colors.black};
`;

const TextContainer = styled(Body1)`
  margin-bottom: 16px;
`;
