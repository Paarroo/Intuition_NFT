"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { hardhat } from "viem/chains";
import { Bars3Icon, BugAntIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick, useTargetNetwork } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "My NFTs",
    href: "/myNFTs",
    icon: <PhotoIcon className="h-4 w-4" />,
  },
  {
    label: "Transfers",
    href: "/transfers",
    icon: <ArrowPathIcon className="h-4 w-4" />,
  },
  {
    label: "Debug Contracts",
    href: "/debug",
    icon: <BugAntIcon className="h-4 w-4" />,
  },
];

export const HeaderMenuLinks = ({ isMobile = false }: { isMobile?: boolean }) => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={
                isMobile
                  ? `${isActive ? "bg-secondary" : ""}`
                  : `${
                      isActive ? "bg-secondary shadow-md" : ""
                    } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-2 px-4 text-sm rounded-full gap-2 grid grid-flow-col transition-all duration-200`
              }
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  const burgerMenuRef = useRef<HTMLDetailsElement>(null);
  useOutsideClick(burgerMenuRef, () => {
    burgerMenuRef?.current?.removeAttribute("open");
  });

  return (
    <div className="sticky lg:static top-0 navbar min-h-0 shrink-0 justify-between z-20 px-0 sm:px-2">
      <div className="navbar-start w-auto lg:w-1/4">
        <details className="dropdown" ref={burgerMenuRef}>
          <summary className="ml-1 btn btn-ghost lg:hidden hover:bg-transparent">
            <Bars3Icon className="h-1/2" />
          </summary>
          <ul
            className="dropdown-content menu z-2 p-2 mt-2 glassmorphism-dropdown rounded-box w-52 gap-1"
            onClick={() => {
              burgerMenuRef?.current?.removeAttribute("open");
            }}
          >
            <HeaderMenuLinks isMobile={true} />
          </ul>
        </details>
        <Link
          href="/myNFTs"
          passHref
          className="hidden lg:flex items-center gap-3 ml-4 shrink-0 hover:opacity-80 transition-opacity duration-200"
        >
          <div className="flex relative w-10 h-10">
            <Image alt="SE2 logo" className="cursor-pointer" fill src="/logo.svg" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-tight text-base">NFT Collection</span>
            <span className="text-xs opacity-70">Scaffold-ETH 2</span>
          </div>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex lg:w-1/2">
        <ul className="menu menu-horizontal justify-around w-full">
          <HeaderMenuLinks />
        </ul>
      </div>
      <div className="navbar-end w-auto lg:w-1/4 mr-2 lg:mr-4 gap-2">
        <RainbowKitCustomConnectButton />
        {isLocalNetwork && <FaucetButton />}
      </div>
    </div>
  );
};
