import { css } from '@emotion/react';
import * as React from 'react';
import { default as ReactModal } from 'react-modal';
import styled from '@emotion/styled';
import TopBar from '../Topbar';

const modalStyles = css``;

const ModalContentWrapper = styled.div`
  height: 100%;
`;

const Modal = ({
  children,
  isOpen,
  onOpen,
  onRequestClose,
  className,
  contentWrapperOverride,
  mandatory = false,
  onBack,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  onOpen?: () => void;
  onRequestClose?: () => void;
  className?: string;
  contentWrapperOverride?: string;
  mandatory?: boolean;
  onBack?: () => void;
}): JSX.Element => {
  return (
    <ReactModal
      isOpen={isOpen}
      onAfterOpen={() => onOpen}
      onRequestClose={onRequestClose}
      className={`${modalStyles.toString()} ${className}`}
      closeTimeoutMS={200}
      shouldCloseOnOverlayClick={mandatory ? false : true}
    >
      <TopBar
        mandatory={mandatory}
        onRequestClose={onRequestClose}
        onBack={onBack}
      />
      <ModalContentWrapper className={`${contentWrapperOverride}`}>
        {children}
      </ModalContentWrapper>
    </ReactModal>
  );
};

export default Modal;
