"use client";
import { Chip } from "@nextui-org/react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "../libs/utils";
import { HoveredLink, Menu } from "./ui/Navbar";

export default function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const pathname = usePathname();

  // Set active link based on pathname
  const handleLinkClick = (item: string) => {
    setActive(item);
  };

  return (
    <div
      className={cn("sticky inset-x-0 w-full mx-auto z-50 bg-black", className)}
    >
      <Menu setActive={setActive}>
        <a
          href="/"
          className="flex items-center rtl:space-x-reverse"
          onClick={() => handleLinkClick("Home")}
        >
          <motion.img
            src="/icon-removebg-preview.png"
            alt="TaskBounty Logo"
            width={50}
            className="h-fit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          <motion.span
            className="self-center text-2xl font-semibold whitespace-nowrap text-white flex justify-center items-center gap-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            TaskBounty{"  "}
            <Chip color="secondary">Beta</Chip>
          </motion.span>
        </a>
        {pathname === "/" ? (
          <motion.div
            className="absolute right-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <HoveredLink
              href="/services"
              onClick={() => handleLinkClick("Services")}
              className={cn(active === "Services" ? "font-bold" : "")} // Change style if active
            >
              Services
            </HoveredLink>
          </motion.div>
        ) : (
          <motion.div
            className="absolute right-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <HoveredLink
              href="/"
              onClick={() => handleLinkClick("Home")}
              className={cn(active === "Home" ? "font-bold" : "")} // Change style if active
            >
              Home
            </HoveredLink>
          </motion.div>
        )}
      </Menu>
    </div>
  );
}
