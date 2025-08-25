"use client";

import { lazy, useEffect, useState } from "react";
import type { NextPage } from "next";
import AnimatedBackground from "~~/components/ui/AnimatedBackground";
import { notification } from "~~/utils/scaffold-eth";
import { getMetadataFromIPFS } from "~~/utils/simpleNFT/ipfs-fetch";

const LazyReactJson = lazy(() => import("react-json-view"));

const IpfsDownload: NextPage = () => {
  const [yourJSON, setYourJSON] = useState({});
  const [ipfsPath, setIpfsPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleIpfsDownload = async () => {
    setLoading(true);
    const notificationId = notification.loading("Getting data from IPFS");
    try {
      const metaData = await getMetadataFromIPFS(ipfsPath);
      notification.remove(notificationId);
      notification.success("Downloaded from IPFS");

      setYourJSON(metaData);
    } catch (error) {
      notification.remove(notificationId);
      notification.error("Error downloading from IPFS");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatedBackground />
      <div className="flex items-center flex-col flex-grow pt-6 sm:pt-8 lg:pt-10 relative z-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-center mb-4 sm:mb-6">
          <span className="block text-2xl sm:text-3xl lg:text-4xl font-bold">Download from IPFS</span>
        </h1>
        <div
          className={`flex border-2 border-accent/95 bg-base-200 rounded-full text-accent w-full max-w-md sm:max-w-lg`}
        >
          <input
            className="input input-ghost focus:outline-none focus:bg-transparent focus:text-secondary-content h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-secondary-content/75"
            placeholder="IPFS CID"
            value={ipfsPath}
            onChange={e => setIpfsPath(e.target.value)}
            autoComplete="off"
          />
        </div>
        <button
          className={`btn btn-secondary my-6 min-h-[48px] px-6 sm:px-8 text-sm sm:text-base ${loading ? "loading" : ""}`}
          disabled={loading}
          onClick={handleIpfsDownload}
        >
          Download from IPFS
        </button>

        {mounted && (
          <div className="w-full max-w-4xl">
            <LazyReactJson
              style={{
                padding: window.innerWidth < 640 ? "0.75rem" : "1rem",
                borderRadius: "0.75rem",
                fontSize: window.innerWidth < 640 ? "0.75rem" : "0.875rem",
              }}
              src={yourJSON}
              theme="solarized"
              enableClipboard={false}
              collapsed={window.innerWidth < 640 ? 2 : false}
              onEdit={edit => {
                setYourJSON(edit.updated_src);
              }}
              onAdd={add => {
                setYourJSON(add.updated_src);
              }}
              onDelete={del => {
                setYourJSON(del.updated_src);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default IpfsDownload;
