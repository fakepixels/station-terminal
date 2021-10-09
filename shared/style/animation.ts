import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

export const fadeIn = keyframes`
from {
  opacity: 0;
}
to {
    opacity: 1;
}
`;

export const FadeIn = styled.div`
  animation: ${fadeIn} 0.5s;
`;
