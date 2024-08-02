"use client";
import Link from "next/link";
import React from "react";
import ChangeApiKey from "./ChangeApiKey";

type Props = {};

const Navbar = (props: Props) => {
  return (
    <div className="py-6 px-12 flex flex-row justify-between items-center text-neutral-100 overflow-hidden">
      <Link href="/" className="text-4xl font-bold group">
        <span className="group-hover:text-transparent bg-gradient-to-tr to-[#1e5192] from-brand transition-all bg-clip-text">
          CPP
        </span>
        <span className="text-transparent bg-clip-text to-[#1e5192] from-brand bg-gradient-to-tr group-hover:text-neutral-100 transition-all">
          Admin
        </span>
      </Link>
      <div className="flex flex-row gap-4 text-neutral-300 font-medium items-center justify-center">
        <NavLink href="/">Event Log</NavLink>
        <NavLink href="/commands">Commands</NavLink>
        <ChangeApiKey />
      </div>
    </div>
  );
};

const NavLink = (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <Link
    className="transition-all text-lg hover:-translate-y-[2px] hover:text-transparent bg-clip-text to-[#1e5192] from-brand bg-gradient-to-tr"
    href={props.href!}
    {...props}
  >
    {props.children}
  </Link>
);

export default Navbar;
