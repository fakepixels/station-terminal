import styled from '@emotion/styled';

const AnimationDots = styled.div`
  animation: dots 1s steps(5, end) infinite;
  font-size: 16px;

  @keyframes dots {
    0%,
    20% {
      color: rgba(0, 0, 0, 0);
      text-shadow: 0.25em 0 0 rgba(0, 0, 0, 0), 0.5em 0 0 rgba(0, 0, 0, 0);
    }
    40% {
      color: white;
      text-shadow: 0.25em 0 0 rgba(0, 0, 0, 0), 0.5em 0 0 rgba(0, 0, 0, 0);
    }
    60% {
      text-shadow: 0.25em 0 0 white, 0.5em 0 0 rgba(0, 0, 0, 0);
    }
    80%,
    100% {
      text-shadow: 0.25em 0 0 white, 0.5em 0 0 white;
    }
  }
`;

const TextLoadingDots = () => {
  return <AnimationDots>.</AnimationDots>;
};

export default TextLoadingDots;
