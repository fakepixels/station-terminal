import styled from '@emotion/styled';

export const Divider = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.colors.gray};
`;

export const DottedDivider = styled.hr`
  border: none;
  border-top: 1px dotted ${(props) => props.theme.colors.gray};
  height: 1px;
  width: 100%;
`;
