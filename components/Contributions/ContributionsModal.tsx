import * as React from 'react';
import Modal from '../shared/Modal';
import styled from '@emotion/styled';

const ContributionModalWrapper = styled(Modal)`
  position: absolute;
  top: 10vh;
  left: 0px;
  right: 0px;
  bottom: initial;
  border: 1px solid #f2efef;
  overflow: auto;
  border-radius: 8px;
  outline: none;
  margin: 0 auto 0 auto;

  min-height: 592px;
  background: #090909;
  color: white;

  @media (min-width: 768px) {
    top: 10vh;
    bottom: initial;
    max-width: 572px;
    max-height: 592px;
  }
`;

interface Props {
  children: React.ReactChild | React.ReactChild[];
  isOpen?: boolean;
  onRequestClose?: () => void;
}

const ContributionModal = ({
  children,
  isOpen = false,
  onRequestClose = () => null,
}: Props): JSX.Element => (
  <ContributionModalWrapper onRequestClose={onRequestClose} isOpen={isOpen}>
    {children}
  </ContributionModalWrapper>
);

export default ContributionModal;
