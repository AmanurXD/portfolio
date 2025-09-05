import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

const LottieAnimation = ({ src, style = {}, loop = true, autoplay = true }) => {
  return (
    <Player
      autoplay={autoplay}
      loop={loop}
      src={src}
      style={{ height: '400px', width: '400px', ...style }} // Default style, can be overridden
    >
    </Player>
  );
};

export default LottieAnimation;