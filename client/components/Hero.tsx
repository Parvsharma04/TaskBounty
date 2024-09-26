"use client";

import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";
import { BACKEND_URL } from "@/utils";
import axios from "axios";
import { useRouter } from "next/navigation";

export const Hero = () => {
  const comp = useRef(null);
  const { publicKey, disconnect, signMessage, connected } = useWallet();
  const [hasToken, setHasToken] = useState(false);
  const navigate = useRouter();
  const WalletMultiButtonDynamic = dynamic(
    async () =>
      (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
  );

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const t1 = gsap.timeline();
      t1.from("#hero-slider", {
        opacity: 0,
        y: "+=10",
        stagger: 0.5,
      }).from(["#hero-title", "#hero-description", "#hero-btn"], {
        opacity: 0,
        y: "+=30",
        stagger: 0.5,
      });
    }, comp);

    return () => ctx.revert();
  }, [comp]);
  useEffect(() => {
    async function getToken() {
      try {
        if (!publicKey) return;
        //! make the message unique which makes it more secure
        const message = new TextEncoder().encode(
          "Wallet confirmation 🌓🚀\n\nI have read and agreed to the Terms and Conditions.\n\nNo amount will be charged."
        );
        const signature = await signMessage?.(message);
        let response = await axios.post(`${BACKEND_URL}/v1/user/signin`, {
          signature,
          publicKey: publicKey?.toString(),
        });
        localStorage.setItem("token", response.data.token);
        setHasToken(true);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    }

    if (publicKey) {
      getToken();
    }
  }, [publicKey, signMessage]);

  useEffect(() => {
    if (!publicKey) {
      localStorage.removeItem("token");
      setHasToken(false);
      navigate.replace("/");
    }
  }, [publicKey, navigate]);

  return (
    <div className="relative" ref={comp}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-hidden opacity-35 h-screen">
        <div className="grid gap-4">
          <div>
            <Image
              className="h-auto max-w-full rounded-lg"
              src="/img1.png"
              alt="bg image 1"
              width={500}
              height={500}
            />
          </div>
          <div>
            <Image
              className="h-auto max-w-full rounded-lg w-96"
              src="/img3.png"
              alt="bg image 3"
              width={300}
              height={500}
            />
          </div>
        </div>
        <div className="grid gap-4">
          <div>
            <Image
              className="h-auto max-w-full rounded-lg"
              src="/img4.png"
              alt="bg image 4"
              width={500}
              height={800}
            />
          </div>
          <div>
            <Image
              className="h-auto max-w-full rounded-lg"
              src="/img5.png"
              alt="bg image 5"
              width={500}
              height={800}
            />
          </div>
          <div>
            <Image
              className="h-auto max-w-full rounded-lg"
              src="/img6.png"
              alt="bg image 6"
              width={500}
              height={800}
            />
          </div>
        </div>
        <div className="grid gap-4">
          <div>
            <Image
              className="h-auto max-w-full rounded-lg"
              src="/img9.png"
              alt="bg image 7"
              width={500}
              height={800}
            />
          </div>
          <div>
            <Image
              className="h-auto max-w-full rounded-lg"
              src="/img8.png"
              alt="bg image 8"
              width={500}
              height={800}
            />
          </div>
          <div>
            <Image
              className="h-auto max-w-full rounded-lg"
              src="/img9.png"
              alt="bg image 9"
              width={500}
              height={800}
            />
          </div>
        </div>
        <div className="grid gap-4">
          <div>
            <Image
              className="h-auto max-w-full rounded-lg"
              src="/img15.png"
              alt="bg image 10"
              width={500}
              height={800}
            />
          </div>
          <div>
            <Image
              className="h-auto max-w-full rounded-lg"
              src="/img11.png"
              alt="bg image 11"
              width={500}
              height={800}
            />
          </div>
          <div>
            <Image
              className="h-auto max-w-full rounded-lg"
              src="/img12.png"
              alt="bg image 12"
              width={500}
              height={800}
            />
          </div>
        </div>
      </div>
      <div
        className="flex flex-col justify-center items-center text-center absolute top-40 w-full"
        id="hero-slider"
      >
        <h1
          id="hero-title"
          className="max-w-4xl mb-4 text-6xl font-extrabold tracking-tight leading-none md:text-8xl text-white font-myFont2"
        >
          Empower Your Data with{" "}
          <span className="text-blue-600">TaskBounty</span>
        </h1>
        <p
          id="hero-description"
          className="max-w-2xl mb-6 font-light text-white lg:mb-8 md:text-xl lg:text-2xl md:text-justify  font-myFont3 text-xl tracking-wider"
        >
          Elevate your AI projects with TaskBounty&apos;s expert labeling
          services. We&apos;re more than just a platform, we&apos;re your
          partner in success.
        </p>
        <div
          className="flex justify-center gap-5 items-center w-full"
          id="hero-btn"
        >
          <WalletMultiButtonDynamic
            style={{
              borderRadius: "0.375rem",
              backgroundColor: "#1B57D6",
              padding: "0.5rem 1rem",
            }}
          >
            {publicKey
              ? `${publicKey.toBase58().substring(0, 7)}...`
              : "Connect Wallet"}
          </WalletMultiButtonDynamic>
          <Link
            href="#section7"
            className="inline-flex items-center justify-center px-3 md:px-5 py-3 mr-3 md:text-base text-sm font-medium text-center text-white rounded-lg bg-transparent border hover:bg-white hover:text-black focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
          >
            Learn More
            <svg
              className="w-5 h-5 ml-2 -mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};
