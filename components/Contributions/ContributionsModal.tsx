import * as React from 'react';
import Modal from '../shared/Modal';
import styled from '@emotion/styled';

const ContributionModalWrapper = styled(Modal)`
  position: absolute;
  top: 10vh;
  left: 0px;
  right: 0px;
  bottom: initial;
  border: 1px solid #${(props) => props.theme.colors.white};
  overflow: auto;
  border-radius: 8px;
  outline: none;
  margin: 0 auto 0 auto;

  min-height: 592px;
  background: ${(props) => props.theme.colors.black};
  color: ${(props) => props.theme.colors.white};

  @media (min-width: 768px) {
    top: 10vh;
    bottom: initial;
    max-width: 572px;
    max-height: 592px;
  }
`;

interface Props {
  isOpen?: boolean;
  onRequestClose?: () => void;
}

const ContributionModal = ({
  isOpen = false,
  onRequestClose = () => null,
}: Props): JSX.Element => (
  <ContributionModalWrapper onRequestClose={onRequestClose} isOpen={isOpen}>
    This is the contribution modal
  </ContributionModalWrapper>
);

export default ContributionModal;
