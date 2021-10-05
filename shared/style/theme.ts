import '@emotion/react';
import styled from '@emotion/styled';

// primary swatch
const GREEN = '#85D59A';
const PURPLE = '#6A6DCD';
const BLACK = '#090909';
const WHITE = '#F2EFEF';

// secondary swatch
const PINK = '#F38EEF';
const TEAL = '#98DBD4';
const ORANGE = '#EE8336';
const PLUM = '#382437';
const DARKGREEN = '#263332';
const BROWN = '#372112';
const SPACEGRAY = '#6D6D6D';

declare module '@emotion/react' {
  export interface Theme {
    defaultBorderRadius: string;
    colors: {
      white: string;
      black: string;
      primary: string;
      secondary: string;

      green: string;
      purple: string;
      pink: string;
      teal: string;
      orange: string;
      plum: string;
      darkgreen: string;
      brown: string;
      gray: string;
    };
  }
}

export const theme = {
  defaultBorderRadius: '4px',
  colors: {
    white: WHITE,
    black: BLACK,

    primary: GREEN,
    secondary: PURPLE,

    green: GREEN,
    purple: PURPLE,
    pink: PINK,
    teal: TEAL,
    orange: ORANGE,
    plum: PLUM,
    darkgreen: DARKGREEN,
    brown: BROWN,
    gray: SPACEGRAY,
  },
};

// typography
export const Heading0 = styled.div`
  font-size: 48px;
  font-family: Resistance;
`;

export const Body0 = styled.div`
  font-size: 20px;
  font-family: Resistance;
`;

export const Heading1 = styled.div`
  font-size: 30px;
  font-family: Terminal;
`;

export const Body1 = styled.div`
  font-size: 14px;
  font-family: Favorit Pro;
`;

export const Heading4 = styled.div`
  font-size: 10px;
  font-family: Favorit Pro;
  font-weight: bold;
`;

export const GlobalNavigation = styled.div`
  font-size: 30px;
  line-height: 32px;
  font-family: 'VT323';
`;

export const Metadata = styled.div`
  font-size: 8px;
  font-family: Favorit Pro;
`;

export const CTA0 = styled.div`
  font-size: 20px;
  font-family: Favorit Pro;
  font-weight: bold;
`;

export const CTA1 = styled.div`
  font-size: 14px;
  font-family: Favorit Pro;
  font-weight: bold;
`;

export const CTA2 = styled.div`
  font-size: 10px;
  font-family: Favorit Pro;
  font-weight: bold;
`;
