import Image from 'next/image';
import ic_baseline_apple from '../../public/svgs/ic_baseline_apple.svg';
import ic_chevron_down from '../../public/svgs/ic_chevron_down.svg';
import ic_copyright from '../../public/svgs/ic_copyright.svg';
import ic_google_playstore from '../../public/svgs/ic_google_playstore.svg';
import qr_code from '../../public/svgs/qr_code.svg';

const linksArr = [
  {
    title: 'About us',
    links: ['Our Company', 'Careers', 'Press kits'],
  },
  {
    title: 'Legal',
    links: ['Terms of use', 'Privacy policy', 'About us'],
  },
  {
    title: 'About us',
    links: ['Contact us', 'FAQ'],
  },
];

import {
  CopyRight,
  FooterBottom,
  FooterLogo,
  FooterMainContent,
  FooterMiddle,
  FooterNavigation,
  GridColumn,
  IconCtn,
  Inner,
  LinksContainer,
  QRContainer,
  QRImageCtn,
  TextCtn,
  Translator,
  Wrapper,
} from './styles';

const Footer = () => {
  return (
    <Wrapper>
      <Inner>
        <FooterLogo className='border-sky-100 border-solid border-spacing-6'>
          <Image src="/images/Task Bounty.png" alt="raft_footer_logo" width={363} height={164}/>
        </FooterLogo>
        <FooterMainContent>
          <FooterMiddle>
            <QRContainer>
              <QRImageCtn>
                <Image src={qr_code} alt="qr_code" />
              </QRImageCtn>
              <TextCtn>
                <p>Scan to download App on the Playstore and Appstore.</p>
                <IconCtn>
                  <Image src={ic_google_playstore} alt="playstore icon" />
                  <Image src={ic_baseline_apple} alt="apple icon" />
                </IconCtn>
              </TextCtn>
            </QRContainer>
            <FooterNavigation>
              {linksArr.map((l, i) => (
                <GridColumn key={i}>
                  <h3>{l.title}</h3>
                  <LinksContainer>
                    {l.links.map((link, i) => (
                      <li key={i}>{link}</li>
                    ))}
                  </LinksContainer>
                </GridColumn>
              ))}
            </FooterNavigation>
          </FooterMiddle>
          <FooterBottom>
            <Translator>
              <h3>English (United Kingdom)</h3>
              <Image src={ic_chevron_down} alt="chevron down" />
            </Translator>
            <CopyRight>
              <Image src={ic_copyright} alt="copyright svg" />
              Raft Corp, LLC.
            </CopyRight>
          </FooterBottom>
        </FooterMainContent>
      </Inner>
    </Wrapper>
  );
};

export default Footer;
