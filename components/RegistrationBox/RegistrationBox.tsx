import { useState, useCallback, useEffect } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import styled from '@emotion/styled';
import Button from '../shared/Button';
import { Body1 } from '../../shared/style/theme';
import { useContracts } from '../../shared/contexts';
import { handleError } from '../../utils/contract/helper';
import { useApplicationState } from '../../state/application/applicationSelectors';

const RegistrationBox = (): JSX.Element => {
  const { contracts } = useContracts();
  const { account } = useWeb3React<Web3Provider>();
  const applicationState = useApplicationState();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isRegisteredForNextEpoch, setIsRegisteredForNextEpoch] =
    useState<boolean>(false);

  const toggleOpen = (): void => {
    setIsOpen(!isOpen);
  };

  const registerForPeerRewards = useCallback(async () => {
    try {
      setIsSubmitting(true);
      if (!contracts || !contracts.PAY) return;
      await contracts.PAY.register();
    } catch (err: any) {
      handleError(err);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  }, [contracts]);

  useEffect(() => {
    const calculateIsRegistered = async (): Promise<void> => {
      if (!contracts || !contracts.PAY) return;
      try {
        const isRegistered = await contracts.PAY.eligibleForRewards(
          applicationState.currentEpoch + 1,
          account,
        );
        setIsRegisteredForNextEpoch(isRegistered);
      } catch (err) {
        handleError(err);
      }
    };
    calculateIsRegistered();
  }, [contracts, applicationState.currentEpoch]);

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
