import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAnnouncer } from "~~/hooks/useA11y";

interface A11yContextType {
  announceMessage: (message: string, priority?: "polite" | "assertive") => void;
  skipLinkTargets: { [key: string]: string };
  setSkipLinkTarget: (key: string, selector: string) => void;
}

const A11yContext = createContext<A11yContextType | undefined>(undefined);

export const useA11y = () => {
  const context = useContext(A11yContext);
  if (!context) {
    throw new Error("useA11y must be used within A11yProvider");
  }
  return context;
};

interface A11yProviderProps {
  children: React.ReactNode;
}

export const A11yProvider: React.FC<A11yProviderProps> = ({ children }) => {
  const { announce, announcerRef } = useAnnouncer();
  const [skipLinkTargets, setSkipLinkTargetsState] = useState<{ [key: string]: string }>({
    main: "#main-content",
    navigation: "#main-navigation",
    search: "#search-filter",
    nfts: "#nft-grid",
  });

  const setSkipLinkTarget = (key: string, selector: string) => {
    setSkipLinkTargetsState(prev => ({ ...prev, [key]: selector }));
  };

  const announceMessage = useCallback(
    (message: string, priority: "polite" | "assertive" = "polite") => {
      announce(message, priority);
    },
    [announce],
  );

  useEffect(() => {
    const handleRouteChange = () => {
      announceMessage(`Navigated to ${document.title}`, "assertive");
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, [announceMessage]);

  return (
    <A11yContext.Provider
      value={{
        announceMessage,
        skipLinkTargets,
        setSkipLinkTarget,
      }}
    >
      {children}
      <div ref={announcerRef} className="sr-only" aria-live="polite" aria-atomic="true" />
      <SkipLinks targets={skipLinkTargets} />
    </A11yContext.Provider>
  );
};

interface SkipLinksProps {
  targets: { [key: string]: string };
}

const SkipLinks: React.FC<SkipLinksProps> = ({ targets }) => {
  const handleSkipToContent = (selector: string) => {
    const element = document.querySelector(selector);
    if (element) {
      if (element instanceof HTMLElement) {
        element.focus();
      }
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="sr-only-focusable" aria-label="Skip navigation links">
      <a
        href="#main-content"
        className="skip-link"
        onClick={e => {
          e.preventDefault();
          handleSkipToContent(targets.main);
        }}
      >
        Skip to main content
      </a>
      <a
        href="#main-navigation"
        className="skip-link"
        onClick={e => {
          e.preventDefault();
          handleSkipToContent(targets.navigation);
        }}
      >
        Skip to navigation
      </a>
      {targets.search && (
        <a
          href="#search-filter"
          className="skip-link"
          onClick={e => {
            e.preventDefault();
            handleSkipToContent(targets.search);
          }}
        >
          Skip to search
        </a>
      )}
      {targets.nfts && (
        <a
          href="#nft-grid"
          className="skip-link"
          onClick={e => {
            e.preventDefault();
            handleSkipToContent(targets.nfts);
          }}
        >
          Skip to NFT collection
        </a>
      )}
    </nav>
  );
};

export default A11yProvider;
