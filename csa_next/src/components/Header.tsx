"use client";

import Link from "next/link";
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
                                <Link
                                    href="/makes"
                                    className="italic p-1 text-nowrap hidden md:block"
                                >
                                    Upload <span className="text-[#e72328]">spot</span>
                                </Link>
                                <Link
                                    href="/discover"
                                    className="italic p-1 text-nowrap hidden md:block"
                                >
                                    Discover <span className="text-[#e72328]">spots</span>
                                </Link>
                                <Link
                                    href="/"
                                    className="italic p-1 text-nowrap hidden md:block"
                                >
                                    Home <span className="text-[#e72328]">page</span>
                                </Link>
                                <Link
                                    href={`/makes?username=${username}`}
                                    className="italic p-1 text-nowrap hidden md:block"
                                >
                                    Your <span className="text-[#e72328]">spots</span>
                                </Link>
                                <Link
                                    href="/profile"
                                    className="italic p-1 text-nowrap hidden md:block"
                                >
                                    Your <span className="text-[#e72328]">profile</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                    {isOpen && (
                        <div className="md:hidden flex flex-col gap-4 px-4 py-3">
                            <Link
                                href="/makes"
                                className="italic p-1 text-nowrap w-max"
                                onClick={() => setIsOpen(false)}
                            >
                                Upload <span className="text-[#e72328]">spot</span>
                            </Link>
                            <Link
                                href="/discover"
                                className="italic p-1 text-nowrap w-max"
                                onClick={() => setIsOpen(false)}
                            >
                                Discover <span className="text-[#e72328]">spots</span>
                            </Link>
                            <Link
                                href="/"
                                className="italic p-1 text-nowrap w-max"
                                onClick={() => setIsOpen(false)}
                            >
                                Home <span className="text-[#e72328]">page</span>
                            </Link>
                            <Link
                                href={`/makes?username=${username}`}
                                className="italic p-1 text-nowrap w-max"
                                onClick={() => setIsOpen(false)}
                            >
                                Your <span className="text-[#e72328]">spots</span>
                            </Link>
                            <Link
                                href="/profile"
                                className="italic p-1 text-nowrap w-max"
                                onClick={() => setIsOpen(false)}
                            >
                                Your <span className="text-[#e72328]">profile</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;