import styled from '@emotion/styled';
import * as React from 'react';

const CloseButton = styled.div`
  margin-right: 3px;
  border: solid 1px ${(props) => props.theme.colors.gray};
  padding: 4px;
  width: 14px;
  height: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
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
  border: solid 1px ${(props) => props.theme.colors.gray};
  margin: 2px;
`;

const TopBar = ({
  mandatory = false,
  onRequestClose,
  onBack,
}: {
  mandatory: boolean;
  onRequestClose?: () => void | undefined;
  onBack?: () => void;
}): JSX.Element => (
  <HeaderWrapper>
    {mandatory ? null : (
      <>
        {onBack ? (
          <CloseButton onClick={onBack}>
            <img src="/Back.svg" alt="back button" />
          </CloseButton>
        ) : (
          <CloseButton onClick={onRequestClose}>
            <img src="/Close.svg" alt="close button" />
          </CloseButton>
        )}
      </>
    )}
    <HeaderLinesContainer>
      <HeaderLines />
      <HeaderLines />
      <HeaderLines />
      <HeaderLines />
    </HeaderLinesContainer>
  </HeaderWrapper>
);

export default TopBar;
