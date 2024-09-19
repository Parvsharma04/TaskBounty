"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  AbsoluteContainer,
  Div,
  Span as StyledSpan,
  Word as StyledWord,
} from "./styles";

type AnimationProps = {
  rest: {
    y: number;
    transition?: {
      duration?: number;
      ease?: number[];
      type?: string;
    };
  };
  hover: {
    y: number;
    transition: {
      duration: number;
      ease: number[];
      type: string;
    };
  };
};

const titleAnimation = {
  rest: {
    transition: {
      staggerChildren: 0.005,
    },
  },
  hover: {
    transition: {
      staggerChildren: 0.005,
    },
  },
};

const letterAnimation = {
  rest: {
    y: 0,
  },
  hover: {
    y: -25,
    transition: {
      duration: 0.3,
      ease: [0.6, 0.01, 0.05, 0.95],
      type: "tween",
    },
  },
};

const letterAnimationTwo = {
  rest: {
    y: 25,
  },
  hover: {
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.6, 0.01, 0.05, 0.95],
      type: "tween",
    },
  },
};

const AnimatedLink = ({
  title,
  href = "#",
}: {
  title: string;
  href?: string;
  // className?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href);
  return (
    <Div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`text-white hover:text-blue-700 transition-colors duration-300 ${
        isActive ? "text-blue-700" : ""
      }`}
    >
      <Link href={href}>
        <AnimatedWord
          title={title}
          animations={letterAnimation}
          isHovered={isHovered}
          isActive={isActive}
        />
        <AbsoluteContainer>
          <AnimatedWord
            title={title}
            animations={letterAnimationTwo}
            isHovered={isHovered}
            isActive={isActive}
          />
        </AbsoluteContainer>
      </Link>
    </Div>
  );
};

export default AnimatedLink;

const Word = motion(StyledWord);
const Span = motion(StyledSpan);

const AnimatedWord = ({
  title,
  animations,
  isHovered,
  isActive,
}: {
  title: string;
  animations: AnimationProps;
  isHovered: boolean;
  isActive: boolean;
}) => (
  <Word
    variants={titleAnimation}
    initial="rest"
    animate={isHovered ? "hover" : "rest"}
  >
    {title.split("").map((char, i) =>
      char === " " ? (
        <Span key={i}>&nbsp;</Span>
      ) : (
        <Span variants={animations} key={i} isActive={isActive}>
          {char}
        </Span>
      )
    )}
  </Word>
);
