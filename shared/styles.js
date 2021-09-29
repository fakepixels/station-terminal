import { css, Global } from '@emotion/react';

export const globalStyles = (
  <Global
    styles={css`
      html,
      body {
        padding: 0;
        margin: 0;
        font-family: 'Public Sans';
        margin-bottom: 160px;
      }

      @font-face {
        font-family: 'Resistance';
        src: url('/fonts/resistance.otf') format('opentype');
      }

      @font-face {
        font-family: 'Terminal';
        src: url('/fonts/terminal-grotesque.ttf') format('truetype');
      }

      @font-face {
        font-family: 'Favorit Pro';
        src: url('/fonts/FavoritPro-Regular.otf') format('opentype');
      }
    `}
  />
);
