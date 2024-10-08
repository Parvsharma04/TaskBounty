"use client";
import { BACKEND_URL } from "@/utils";
import {
  Activity,
  ChevronDown,
  Flash,
  Lock,
  Scale,
  Server,
  TagUser,
} from "@/utils/icons";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useReducer, useState } from "react";
import "../styles/home.css";
import AnimatedLink from "./AnimatedLink";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const NavBar = () => {
  const { publicKey, disconnect, signMessage, connected } = useWallet();
  const [hasToken, setHasToken] = useState(false);
  const [activeBtn, setActiveBtn] = useState("home");
  const navigate = useRouter();
  const wallet = useWallet();
  const [isMenuOpen, setIsMenuOpen] = useReducer((current) => !current, false);

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

  const icons = {
    chevron: <ChevronDown fill="currentColor" size={16} />,
    scale: <Scale fill="currentColor" size={30} />,
    lock: <Lock fill="currentColor" size={30} />,
    activity: <Activity fill="currentColor" size={30} />,
    flash: <Flash fill="currentColor" size={30} />,
    server: <Server fill="currentColor" size={30} />,
    user: <TagUser fill="currentColor" size={30} />,
  };

  return (
    <Navbar
      className="flex justify-center items-center w-full bg-gray-900 text-white pt-1 pb-1 my-auto shadow-lg"
      style={{ zIndex: 1000 }}
      maxWidth="full"
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="sm:hidden" justify="start">
        {wallet.connected && (
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
        )}
        {!wallet.connected && (
          <NavbarBrand>
            <Link
              href="/"
              className="flex items-center space-x-1 rtl:space-x-reverse -mt-1"
            >
              <Image
                src="/icon-removebg-preview.png"
                alt="TaskBounty Logo"
                height={60}
                width={40}
              />
              <span className="self-center md:text-2xl font-semibold whitespace-nowrap dark:text-white">
                TaskBounty
              </span>
            </Link>
          </NavbarBrand>
        )}
      </NavbarContent>
      <NavbarBrand>
        <Link
          href="/"
          className="hidden md:flex items-center space-x-1 rtl:space-x-reverse -mt-1"
        >
          <Image
            src="/icon-removebg-preview.png"
            alt="TaskBounty Logo"
            height={60}
            width={40}
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            TaskBounty
          </span>
        </Link>
      </NavbarBrand>
      {wallet.connected && (
        <NavbarContent className="hidden sm:flex gap-5" justify="center">
          <NavbarItem>
            <AnimatedLink title="Home" href="/" key="home" />
          </NavbarItem>
          <Dropdown>
            <NavbarItem>
              <DropdownTrigger>
                <Button
                  disableRipple
                  className="p-0 bg-transparent data-[hover=true]:bg-transparent text-white text-md"
                  endContent={icons.chevron}
                  radius="sm"
                  variant="light"
                >
                  <AnimatedLink title="Features" key="features" href="#" />
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label="Features"
              className="w-[340px] bg-gray-800 border-none outline-none p-0"
              itemClasses={{
                base: "gap-4",
              }}
            >
              <DropdownItem
                onClick={() => navigate.push("/uploadUiUx")}
                key="UI/UX Design"
                description="label your tasks and get them done by the best designers in the world."
                startContent={icons.scale}
              >
                <Link href="/uploadUiUx">UI/UX Design</Link>
              </DropdownItem>
              <DropdownItem
                onClick={() => navigate.push("/uploadIdea")}
                key="idea / product"
                description="Get your ideas and products to the market faster with our platform."
                startContent={icons.activity}
              >
                <Link href="/uploadIdea">Idea / Product</Link>
              </DropdownItem>
              <DropdownItem
                onClick={() => navigate.push("/uploadTask")}
                key="Youtube thumbnail"
                description="Get your youtube thumbnails rated by the best designers in the world."
                startContent={icons.flash}
              >
                <Link href="/uploadTask">Youtube Thumbnail</Link>
              </DropdownItem>
              <DropdownItem
                onClick={() => navigate.push("/miscellaneousUpload")}
                key="miscellaneous"
                description="rate your miscellaneous tasks and get them done by the humans of the world."
                startContent={icons.server}
              >
                <Link href="/miscellaneousUpload">Miscellaneous</Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <NavbarItem>
            <AnimatedLink
              title="Task Analytics"
              href="/taskAnalytics"
              key="task-analytics"
            />
          </NavbarItem>
          <NavbarItem>
            <AnimatedLink
              title="Transaction History"
              href="/transactionHistory"
              key="transaction-history"
            />
          </NavbarItem>
        </NavbarContent>
      )}
      <NavbarContent justify="end">
        <NavbarItem>
          <WalletMultiButtonDynamic>
            {publicKey
              ? `${publicKey.toBase58().substring(0, 7)}...`
              : "Connect Wallet"}
          </WalletMultiButtonDynamic>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="bg-gray-800 pt-5">
        <NavbarMenuItem key="Home">
          <Link className="w-full" href="/" onClick={() => setIsMenuOpen()}>
            Home
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem key="Features">
          <Dropdown>
            <NavbarItem>
              <DropdownTrigger>
                <Button
                  disableRipple
                  className="p-0 bg-transparent data-[hover=true]:bg-transparent text-white text-md"
                  endContent={icons.chevron}
                  radius="sm"
                  variant="light"
                >
                  Features
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label="Features"
              className="w-[340px] bg-gray-800 border-none outline-none p-0"
              itemClasses={{
                base: "gap-4",
              }}
            >
              <DropdownItem
                onClick={() => navigate.push("/uploadUiUx")}
                key="UI/UX Design"
                description="label your tasks and get them done by the best designers in the world."
                startContent={icons.scale}
              >
                <Link href="/uploadUiUx" onClick={() => setIsMenuOpen()}>
                  UI/UX Design
                </Link>
              </DropdownItem>
              <DropdownItem
                onClick={() => navigate.push("/uploadIdea")}
                key="idea / product"
                description="Get your ideas and products to the market faster with our platform."
                startContent={icons.activity}
              >
                <Link href="/uploadIdea" onClick={() => setIsMenuOpen()}>
                  Idea / Product
                </Link>
              </DropdownItem>
              <DropdownItem
                onClick={() => navigate.push("/uploadTask")}
                key="Youtube thumbnail"
                description="Get your youtube thumbnails rated by the best designers in the world."
                startContent={icons.flash}
              >
                <Link href="/uploadTask" onClick={() => setIsMenuOpen()}>
                  Youtube Thumbnail
                </Link>
              </DropdownItem>
              <DropdownItem
                onClick={() => navigate.push("/miscellaneousUpload")}
                key="miscellaneous"
                description="rate your miscellaneous tasks and get them done by the humans of the world."
                startContent={icons.server}
              >
                <Link
                  href="/miscellaneousUpload"
                  onClick={() => setIsMenuOpen()}
                >
                  Miscellaneous
                </Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarMenuItem>
        <NavbarMenuItem key="taskAnalytics" className="mb-2">
          <Link
            className="w-full"
            href="/taskAnalytics"
            onClick={() => setIsMenuOpen()}
          >
            Task Analytics
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem key="transactionHistory">
          <Link
            className="w-full"
            href="/transactionHistory"
            onClick={() => setIsMenuOpen()}
          >
            Transaction History
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default NavBar;
