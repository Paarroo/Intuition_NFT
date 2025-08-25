"use client";

import { lazy, useEffect, useState } from "react";
import type { NextPage } from "next";
import AnimatedBackground from "~~/components/ui/AnimatedBackground";
import { notification } from "~~/utils/scaffold-eth";
import { addToIPFS } from "~~/utils/simpleNFT/ipfs-fetch";
import nftsMetadata from "~~/utils/simpleNFT/nftsMetadata";

const LazyReactJson = lazy(() => import("react-json-view"));

const IpfsUpload: NextPage = () => {
  const [yourJSON, setYourJSON] = useState<object>(nftsMetadata[0]);
  const [loading, setLoading] = useState(false);
  const [uploadedIpfsPath, setUploadedIpfsPath] = useState("");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleIpfsUpload = async () => {
    setLoading(true);
    const notificationId = notification.loading("Uploading to IPFS...");
    try {
      const uploadedItem = await addToIPFS(yourJSON);
      notification.remove(notificationId);
      notification.success("Uploaded to IPFS");

      setUploadedIpfsPath(uploadedItem.path);
    } catch (error) {
      notification.remove(notificationId);
      notification.error("Error uploading to IPFS");
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
          <span className="block text-2xl sm:text-3xl lg:text-4xl font-bold">Upload to IPFS</span>
        </h1>

        {mounted && (
          <div className="w-full max-w-4xl mb-6">
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
        <button
          className={`btn btn-secondary mt-4 min-h-[48px] px-6 sm:px-8 text-sm sm:text-base ${loading ? "loading" : ""}`}
          disabled={loading}
          onClick={handleIpfsUpload}
        >
          Upload to IPFS
        </button>
        {uploadedIpfsPath && (
          <div className="mt-4 sm:mt-6 w-full max-w-4xl">
            <a
              href={`https://ipfs.io/ipfs/${uploadedIpfsPath}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm sm:text-base break-all hover:text-primary transition-colors"
            >
              {`https://ipfs.io/ipfs/${uploadedIpfsPath}`}
            </a>
          </div>
        )}
      </div>
    </>
  );
};

export default IpfsUpload;
