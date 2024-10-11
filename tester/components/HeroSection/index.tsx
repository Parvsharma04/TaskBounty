"use client";
import MaskText from "@/components/MaskText";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import GetStartedButton from "../../components/GetStartedButton";
import { useIsMobile } from "../../libs/useIsMobile";
import ic_chevron_right from "../../public/svgs/ic_chevron_right.svg";
import {
  mobileParagraphPhrases,
  mobilePhrases,
  paragraphPhrases,
  phrases,
} from "./constants";
import Hero from "./Hero";
import {
  Column,
  ColumnRobot,
  FlexWrapper,
  HeroTextContainer,
  Inner,
  Pill,
  Wrapper
} from './styles';

const HeroSection = () => {
  const router = useRouter();
  const isMobile = useIsMobile();

  useEffect(() => {
    router.push("/");
  }, []);

  return (
    <FlexWrapper>
      <Column>
        <Wrapper>
          <Inner>
            <Pill>
              <span>Introducing TaskBounty</span>
              <Image src={ic_chevron_right} alt="chevron-right" />
            </Pill>
            <HeroTextContainer>
              {isMobile ? (
                <>
                  <MaskText phrases={mobilePhrases} tag="h1" />
                  <MaskText phrases={mobileParagraphPhrases} tag="p" />
                </>
              ) : (
                <>
                  <MaskText phrases={phrases} tag="h1" />
                  <MaskText phrases={paragraphPhrases} tag="p" />
                </>
              )}
            </HeroTextContainer>
            <GetStartedButton padding="1rem 2rem" />
          </Inner>
        </Wrapper>
      </Column>
      <ColumnRobot>
        <Hero />
        {/* <Overlay>
          TaskBounty
        </Overlay> */}
      </ColumnRobot>
    </FlexWrapper>
  );
};

export default HeroSection;
