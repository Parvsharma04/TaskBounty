"use client";
import Image from "next/image";
import Link from "next/link"; // Import Link for navigation
import ic_copyright from "../../public/svgs/ic_copyright.svg";

// Styled components import
import {
  CopyRight,
  FooterBottom,
  FooterLogo,
  FooterMainContent,
  FooterNavigation,
  GridColumn,
  Inner,
  LinksContainer,
  Wrapper,
} from "./styles";

const linksArr = [
  {
    title: "About us",
    links: ["Dev Team"],
  },
  {
    title: "Legal",
    links: ["Privacy"],
  },
];

const Footer = () => {
  return (
    <Wrapper>
      <Inner>
        <FooterMainContent>
          <FooterLogo>
            <Image
              src="/images/Task Bounty.png"
              alt="raft_footer_logo"
              width={363}
              height={164}
            />
          </FooterLogo>
          <FooterNavigation>
            {linksArr.map((l, i) => (
              <GridColumn key={i}>
                <h3>{l.title}</h3>
                <LinksContainer>
                  {l.links.map((link, i) => (
                    <li key={i}>
                      {/* Wrap each link with the Next.js Link component */}
                      <Link href={`/${link.toLowerCase().replace(" ", "-")}`}>
                        {link}
                      </Link>
                    </li>
                  ))}
                </LinksContainer>
              </GridColumn>
            ))}
          </FooterNavigation>
        </FooterMainContent>
        <FooterBottom>
          <CopyRight>
            <Image src={ic_copyright} alt="copyright svg" />
            TaskBounty, LLC.
          </CopyRight>
        </FooterBottom>
      </Inner>
    </Wrapper>
  );
};

export default Footer;
