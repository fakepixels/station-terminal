import React, { useState } from 'react';
import Modal from '../shared/Modal';
import styled from '@emotion/styled';
import MintScreen from './MintScreen';
import EndorsementScreen from './EndorsementScreen';
import { endorsementContext } from '../../shared/contexts';
import { Page } from './helper';

const EndorsementModalWrapper = styled(Modal)`
  position: absolute;
  top: 10vh;
  left: 0px;
  right: 0px;
  bottom: initial;
  border: 1px solid ${(props) => props.theme.colors.gray};
  overflow: auto;
  outline: none;
  margin: 0 auto 0 auto;

  min-height: 592px;
  background: ${(props) => props.theme.colors.black};
  color: white;

  @media (min-width: 768px) {
    top: 10vh;
    bottom: initial;
    max-width: 572px;
    max-height: 592px;
  }
`;

interface ownProps {
  isOpen: boolean;
  onRequestClose?: () => void;
}

const EndorsementModal = (props: ownProps): JSX.Element => {
  const { isOpen, onRequestClose } = props;
  const [page, setPage] = useState<Page>(Page.endorse);

  const onBackFunction = () => {
    if (page === Page.mint) return () => setPage(Page.endorse);
    return undefined;
  };

  return (
    <endorsementContext.Provider value={{ page, setPage }}>
      <EndorsementModalWrapper
        onRequestClose={onRequestClose}
        isOpen={isOpen}
        onBack={onBackFunction()}
      >
        {page === Page.endorse && <EndorsementScreen />}
        {page === Page.mint && <MintScreen />}
      </EndorsementModalWrapper>
    </endorsementContext.Provider>
  );
};

export default EndorsementModal;
