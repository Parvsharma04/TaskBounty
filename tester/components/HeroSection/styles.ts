import styled from "styled-components";
import hero_background from "../../public/images/grid_background.png";

export const Wrapper = styled.section`
  margin-top: 4rem; // Adjust as needed
`;

export const Inner = styled.div`
  background: url(${hero_background.src}) no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 56rem;
  margin: 0 auto;
  text-align: center;
  background-position: top center;
  background-size: cover;
  padding: 0.5rem 0;
`;

export const Pill = styled.div`
  display: flex;
  padding: 0.375rem 0.75rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  border-radius: 6.25rem;
  border: 0.2px solid #989898;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  margin-bottom: 0.5rem;

  span {
    color: var(--light-gray);
    font-size: 1rem;
    font-weight: 400;
  }
`;

export const HeroTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 1.2rem;

  h1 {
    font-size: 6rem;
    font-weight: 400;
    line-height: 1.3; // Increase line height here for larger screens
  }

  p {
    max-width: 41.75rem;
    color: #bdbdbd;
    font-size: 1.5rem;
    font-weight: 400;
    margin: 0 auto;
    line-height: 1.5; // Increase line height here for larger screens
  }

  @media (max-width: 768px) {
    gap: 1rem;
    padding-bottom: 1rem;

    h1 {
      font-size: 2.5rem;
      font-weight: 400;
      line-height: 2.5; // Further increase line height for mobile
    }

    p {
      font-size: 1rem;
      line-height: 2; // Further increase line height for mobile
    }
  }
`;

// Wrapper for the entire layout using Flexbox
export const FlexWrapper = styled.div`
  display: flex;
  flex-direction: row; // Default to row for larger screens
  height: 100vh; // Full height of the screen
  background-color: black;
  color: white;

  @media (max-width: 768px) {
    flex-direction: column; // Change to column layout on mobile screens
    justify-content: center; // Center content vertically on mobile
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center; // Center content vertically
  align-items: center; // Center content horizontally by default
  width: 100%;
  padding-top: 3rem;

  @media (min-width: 768px) {
    align-items: flex-start; // Align items to the start (left) on larger screens
  }
`;

// Updated ColumnRobot for rounded style and positioning
// export const ColumnRobot = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: flex-end; // Align to the bottom of the column
//   height: 100%; // Adjust height to fill remaining space
//   padding: 1rem;
//   width: 100%;
//   border-radius: 1rem;

//   @media (max-width: 768px) {
//     display: none; // Hide this column on mobile screens
//   }
// `;

export const ColumnRobot = styled.div`
  height: 95%;
  padding-bottom: 2rem;
  width: 100%;
  position: relative; // Add this line
  @media (max-width: 768px) {
    display: none; // Hide this column on mobile screens
  }
`;


export const Overlay = styled.div`
  position: absolute;
  bottom: 40px; // Position from the bottom
  right: 40px; // Position from the right
  width: 130px; // Adjust width as needed
  text-align:center;
  padding-top: 1px;
  height: 30px; // Adjust height as needed
  background: #161616;
  z-index: 10;
  opacity: 1;
`;
