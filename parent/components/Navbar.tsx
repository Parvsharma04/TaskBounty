"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "../libs/utils";
import { HoveredLink, Menu } from "./ui/Navbar";

export function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2" />
      <p className="text-black dark:text-white">
        The Navbar will show on top of the page
      </p>
    </div>
  );
}

export default function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div className={cn("fixed inset-x-0 w-full mx-auto z-50", className)}>
      <Menu setActive={setActive}>
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
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
            className="self-center text-2xl font-semibold whitespace-nowrap text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            TaskBounty
          </motion.span>
        </a>
        <motion.div
          className="absolute right-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <HoveredLink href="/services">Services</HoveredLink>
        </motion.div>
      </Menu>
    </div>
  );
}
