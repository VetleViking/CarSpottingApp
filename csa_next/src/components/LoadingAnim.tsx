import React from 'react';

const LoadingAnimation = () => {
  return (
    <div className="flex justify-center items-center flex-col">
      <p className="text-white text-center text-xl m-4 font-ListComponent">
        Uploading
        <span className="animate-blink">.</span>
        <span className="animate-blink-delay-1">.</span>
        <span className="animate-blink-delay-2">.</span>
      </p>
    </div>
  );
};

export default LoadingAnimation;
