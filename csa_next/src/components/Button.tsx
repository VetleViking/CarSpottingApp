import React from "react";

interface ButtonProps {
    text: string;
    onClick: () => void;
    className?: string;
}

const Button = ({ text, onClick, className }: ButtonProps) => {
    return (
        <button
            onClick={() => onClick()}
            className={
                className + " bg-[#e72328] text-white p-2 border border-black italic text-nowrap"
            }
        >
            {text}
        </button>
    );
};

export default Button;
