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
    <div className="sticky lg:static top-0 navbar min-h-[48px] sm:min-h-[52px] md:min-h-[60px] lg:min-h-[72px] shrink-0 justify-between z-20 px-1 sm:px-2 md:px-3 lg:px-4 overflow-hidden">
      <div className="navbar-start w-auto lg:w-1/4 min-w-0 flex-shrink">
        <details className="dropdown" ref={burgerMenuRef}>
          <summary className="btn btn-xs sm:btn-sm md:btn-md btn-ghost lg:hidden hover:bg-transparent px-1 sm:px-2 md:px-3 min-h-[32px] sm:min-h-[36px] md:min-h-[40px]">
            <Bars3Icon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-1/2 lg:w-1/2" />
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
          className="flex items-center gap-1 sm:gap-2 lg:gap-3 ml-0 sm:ml-1 lg:ml-8 shrink-0 hover:opacity-80 transition-opacity duration-200"
        >
          <div className="flex relative w-14 h-9 sm:w-18 sm:h-11 md:w-22 md:h-14 lg:w-32 lg:h-20 z-10">
            <Image alt="Intuition logo" className="cursor-pointer" fill src="/logo.svg" />
          </div>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex lg:w-1/2">
        <ul className="menu menu-horizontal justify-around w-full">
          <HeaderMenuLinks />
        </ul>
      </div>
      <div className="navbar-end w-auto lg:w-1/4 gap-1 sm:gap-2 min-w-0 flex-shrink">
        <RainbowKitCustomConnectButton />
        {isLocalNetwork && <FaucetButton />}
      </div>
    </div>
  );
};
