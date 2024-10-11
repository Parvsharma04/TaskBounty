import { styled } from "styled-components";

export const Wrapper = styled.footer`
  padding-bottom: 2rem; /* Reduced padding */
  display: flex;
  background-color: black;
  flex-direction: column;
  justify-content: space-between;
`;

export const Inner = styled.div`
  width: 90%;
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem; /* Reduced gap */

  @media (max-width: 768px) {
    gap: 1.5rem; /* Reduced gap for smaller screens */
  }
`;

export const FooterMainContent = styled.div`
  display: flex;
  justify-content: space-between; /* Ensures spacing between logo and links */
  align-items: center;
  padding: 3rem 0; /* Adjusted padding */
  border-top: 1px solid #3d3d3d;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem; /* Reduced gap */
  }
`;

export const FooterLogo = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    width: 13.2rem;
    height: 5.6rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
`;

export const FooterNavigation = styled.div`
  display: flex;
  gap: 1.5rem; /* Adjusted gap */

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem; /* Adjusted gap for smaller screens */
  }
`;

export const GridColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem; /* Adjusted gap */
`;

export const LinksContainer = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* Adjusted gap */
  margin-right: 2rem;

  li {
    color: #efefef;
    font-size: 1rem;
    font-weight: 400;
    cursor: pointer;
    position: relative;
    transition: color 0.3s ease;

    &::after {
      position: absolute;
      content: "";
      width: 100%;
      height: 1px;
      background-color: #efefef;
      left: 0;
      bottom: -5px;
      transform: scaleX(0);
      transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
      transform-origin: center;
    }

    &:hover {
      color: #4a90e2; /* Change color on hover */
      &::after {
        transform: scaleX(1);
      }
    }
  }
`;

export const FooterBottom = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem 0;
  border-bottom: 1px solid #3d3d3d;
`;

export const CopyRight = styled.div`
  font-size: 1rem;
  font-weight: 400;
  display: flex;
  align-items: center;
  color: #efefef;

  img {
    margin-right: 0.5rem;
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
    gap: 0.25rem;
  }
`;
