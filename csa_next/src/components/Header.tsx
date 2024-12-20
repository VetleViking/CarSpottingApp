"use client";

import React, { useState } from "react";

interface HeaderProps {
    username: string;
};

const Header = ({ username }: HeaderProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="pb-20">
            <div className="fixed top-0 left-0 w-full z-50">
                <div className="bg-white border-b-[6px] border-white">
                    <div className="flex justify-between items-center gap-8 px-4 py-3 border-b-[6px] border-black md:justify-center md:gap-24">
                        <button
                            className="md:hidden text-xl"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            &#9776;
                        </button>
                        <div className="w-full flex gap-8 justify-between md:justify-center md:gap-24 items-center">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => (window.location.href = `/makes`)}
                                    className="italic p-1 text-nowrap hidden md:block"
                                >
                                    Upload <span className="text-[#e72328]">spot</span>
                                </button>
                                <button
                                    onClick={() =>
                                    (window.location.href = `/makes?username=${username}`)
                                    }
                                    className="italic p-1 text-nowrap hidden md:block"
                                >
                                    Your <span className="text-[#e72328]">spots</span>
                                </button>
                                <button
                                    onClick={() => (window.location.href = `/discover`)}
                                    className="italic p-1 text-nowrap hidden md:block"
                                >
                                    Discover <span className="text-[#e72328]">spots</span>
                                </button>
                                <button
                                    onClick={() => (window.location.href = `/`)}
                                    className="italic p-1 text-nowrap hidden md:block"
                                >
                                    Home <span className="text-[#e72328]">page</span>
                                </button>
                                <button
                                    onClick={() => (window.location.href = `/profile`)}
                                    className="italic p-1 text-nowrap hidden md:block"
                                >
                                    Your <span className="text-[#e72328]">profile</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    {isOpen && (
                        <div className="md:hidden flex flex-col gap-4 px-4 py-3">
                            <button
                                onClick={() =>
                                    (window.location.href = `/makes?username=${username}`)
                                }
                                className="italic p-1 text-nowrap w-max"
                            >
                                Your <span className="text-[#e72328]">spots</span>
                            </button>
                            <button
                                onClick={() => (window.location.href = `/makes`)}
                                className="italic p-1 text-nowrap w-max"
                            >
                                Upload <span className="text-[#e72328]">spot</span>
                            </button>
                            <button
                                onClick={() => (window.location.href = `/discover`)}
                                className="italic p-1 text-nowrap w-max"
                            >
                                Discover <span className="text-[#e72328]">spots</span>
                            </button>
                            <button
                                onClick={() => (window.location.href = `/`)}
                                className="italic p-1 text-nowrap w-max"
                            >
                                Home <span className="text-[#e72328]">page</span>
                            </button>
                            <button
                                onClick={() => (window.location.href = `/profile`)}
                                className="italic p-1 text-nowrap w-max"
                            >
                                Your <span className="text-[#e72328]">profile</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;