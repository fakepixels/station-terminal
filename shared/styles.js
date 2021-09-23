import { css, Global } from '@emotion/react';

export const globalStyles = (
  <Global
    styles={css`
      html,
      body {
        padding: 0;
        margin: 0;
        font-family: 'Public Sans';
      }
    `}
  />
);
