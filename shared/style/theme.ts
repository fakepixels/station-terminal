import '@emotion/react';
import styled from '@emotion/styled';

// primary swatch
const GREEN = '#1dbf53';
const PURPLE = '#6A6DCD';

// secondary swatch
const PINK = '#F38EEF';
const TEAL = '#98DBD4';
const ORANGE = '#EE8336';
const PLUM = '#382437';
const DARKGREEN = '#263332';
const BROWN = '#372112';

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
    };
  }
}

export const theme = {
  defaultBorderRadius: '4px',
  colors: {
    white: 'white',
    black: 'black',

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
  },
};

// typography
export const Header1 = styled.div`
  font-size: 30px;
  font-weight: 700;
`;

export const Header2 = styled.div`
  font-size: 30px;
  font-weight: 700;
`;

export const Header3 = styled.div`
  font-size: 18px;
  font-weight: 700;
`;

export const Header4 = styled.div`
  font-size: 16px;
  font-weight: 700;
`;

export const Body1 = styled.div`
  font-size: 16px;
  line-height: 20px;
`;

export const Body2 = styled.div`
  font-size: 12px;
  line-height: 16px;
`;

export const Body3 = styled.div`
  font-size: 10px;
  line-height: 14px;
`;
