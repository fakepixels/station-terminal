import { css } from '@emotion/react';
import * as React from 'react';
import { default as ReactModal } from 'react-modal';

import styled from '@emotion/styled';

const modalStyles = css``;

const ModalContentWrapper = styled.div`
  height: 100%;
`;

const CloseButton = styled.div`
  margin-right: 3px;
  border: solid 1px #626262;
  padding: 4px;
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeaderWrapper = styled.div`
  padding: 7px;
  display: flex;
  flex-direction: row;
`;

const HeaderLinesContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`;

const HeaderLines = styled.div`
  width: 100%;
  border: solid 1px #626262;
  margin: 2px;
`;

const Header = ({
  mandatory = false,
  onRequestClose,
}: {
  mandatory: boolean;
  onRequestClose?: () => void | undefined;
}) => (
  <HeaderWrapper>
    {mandatory ? null : (
      <CloseButton onClick={onRequestClose}>
        <img src="/Close.svg" alt="close button" />
      </CloseButton>
    )}
    <HeaderLinesContainer>
      <HeaderLines />
      <HeaderLines />
      <HeaderLines />
      <HeaderLines />
    </HeaderLinesContainer>
  </HeaderWrapper>
);

const Modal = ({
  children,
  isOpen,
  onOpen,
  onRequestClose,
  className,
  contentWrapperOverride,
  mandatory = false,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  onOpen?: () => void;
  onRequestClose?: () => void;
  className?: string;
  contentWrapperOverride?: string;
  mandatory?: boolean;
}): JSX.Element => {
  const contents = children;

  return (
    <ReactModal
      isOpen={isOpen}
      onAfterOpen={() => onOpen}
      onRequestClose={onRequestClose}
      className={`${modalStyles.toString()} ${className}`}
      closeTimeoutMS={200}
      shouldCloseOnOverlayClick={mandatory ? false : true}
    >
      <Header mandatory={mandatory} onRequestClose={onRequestClose} />
      <ModalContentWrapper className={`${contentWrapperOverride}`}>
        {contents}
      </ModalContentWrapper>
    </ReactModal>
  );
};

export default Modal;
