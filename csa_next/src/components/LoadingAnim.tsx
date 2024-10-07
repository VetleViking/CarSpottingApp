import React from 'react';

type LoadingAnimationProps = {
    text: string;
    className?: string;
};

const LoadingAnimation = ({ text, className }: LoadingAnimationProps) => {
    return <div className={`flex justify-center items-center flex-col text-xl ${className}`}>
        <p className="text-white text-center m-2 font-ListComponent">
            {text}
            <span className="animate-blink">.</span>
            <span className="animate-blink-delay-1">.</span>
            <span className="animate-blink-delay-2">.</span>
        </p>
    </div>
};

export default LoadingAnimation;
