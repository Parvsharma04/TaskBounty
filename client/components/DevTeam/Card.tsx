"use client";

import styled from "styled-components";

interface CardProps {
  title: string;
  linkedin: string;
  github: string;
  img: string;
}

const Card = ({ title, github, linkedin, img }: CardProps) => {
  return (
    <StyledWrapper>
      <div className="parent">
        <div className="card">
          <div className="logo">
            <span className="circle circle1" />
            <span className="circle circle2" />
            <span className="circle circle3" />
            <span className="circle circle4" />
            <span className="circle circle5">
              <img src="/images/icon-removebg-preview.png" alt="Logo" />
            </span>
          </div>
          <div className="glass" />
          <div className="content">
            <img src={img} alt="Headshot" className="headshot" />
            <p className="title">{title}</p>
            <span className="text-black">Co-Founder</span>
          </div>
          <div className="bottom">
            <div className="social-buttons-container">
              <button className="social-button social-button1">
                <a href={github} target="_blank" rel="noopener noreferrer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 64 64"
                    className="svg"
                  >
                    <path d="M32 6C17.641 6 6 17.641 6 32c0 12.277 8.512 22.56 19.955 25.286-.592-.141-1.179-.299-1.755-.479V50.85c0 0-.975.325-2.275.325-3.637 0-5.148-3.245-5.525-4.875-.229-.993-.827-1.934-1.469-2.509-.767-.684-1.126-.686-1.131-.92-.01-.491.658-.471.975-.471 1.625 0 2.857 1.729 3.429 2.623 1.417 2.207 2.938 2.577 3.721 2.577.975 0 1.817-.146 2.397-.426.268-1.888 1.108-3.57 2.478-4.774-6.097-1.219-10.4-4.716-10.4-10.4 0-2.928 1.175-5.619 3.133-7.792C19.333 23.641 19 22.494 19 20.625c0-1.235.086-2.751.65-4.225 0 0 3.708.026 7.205 3.338C28.469 19.268 30.196 19 32 19s3.531.268 5.145.738c3.497-3.312 7.205-3.338 7.205-3.338.567 1.474.65 2.99.65 4.225 0 2.015-.268 3.19-.432 3.697C46.466 26.475 47.6 29.124 47.6 32c0 5.684-4.303 9.181-10.4 10.4 1.628 1.43 2.6 3.513 2.6 5.85v8.557c-.576.181-1.162.338-1.755.479C49.488 54.56 58 44.277 58 32 58 17.641 46.359 6 32 6zM33.813 57.93C33.214 57.972 32.61 58 32 58 32.61 58 33.213 57.971 33.813 57.93zM37.786 57.346c-1.164.265-2.357.451-3.575.554C35.429 57.797 36.622 57.61 37.786 57.346zM32 58c-.61 0-1.214-.028-1.813-.07C30.787 57.971 31.39 58 32 58zM29.788 57.9c-1.217-.103-2.411-.289-3.574-.554C27.378 57.61 28.571 57.797 29.788 57.9z"></path>
                  </svg>
                </a>
              </button>
              <button className="social-button social-button2">
                <a href={linkedin} target="_blank" rel="noopener noreferrer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="svg"
                    viewBox="0 0 50 50"
                  >
                    <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"></path>
                  </svg>
                </a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .parent {
    width: 400px; /* Increased width */
    height: 450px; /* Increased height */
    perspective: 1000px;
  }

  .card {
    height: 100%;
    border-radius: 50px;
    background: linear-gradient(135deg, #1a56db 0%, #447efa 100%);
    transition: all 0.5s ease-in-out;
    transform-style: preserve-3d;
    box-shadow: rgba(5, 71, 17, 0) 40px 50px 25px -40px,
      rgba(5, 71, 17, 0.2) 0px 25px 25px -5px;
  }

  @media (max-width: 768px) {
    .parent {
      // margin-top: 7rem;
      width: 300px; /* Decreased width for mobile */
      height: 350px; /* Decreased height for mobile */
    }

    .content {
      padding: 60px 30px 0px 15px; /* Adjusted padding for mobile */
    }

    .headshot {
      width: 90px; /* Smaller headshot size for mobile */
      height: 90px; /* Smaller headshot size for mobile */
      margin-top: -5rem; /* Move image up */
    }

    .content .title {
      font-size: 18px; /* Smaller title font size for mobile */
    }

    .content .text {
      font-size: 14px; /* Smaller text font size for mobile */
    }

    .bottom {
      padding: 10px; /* Adjusted padding for mobile */
    }

    .bottom .social-buttons-container .social-button {
      width: 30px; /* Smaller social button size for mobile */
      padding: 5px; /* Adjusted padding for mobile */
    }

    .bottom .social-buttons-container .social-button .svg {
      width: 12px; /* Smaller SVG size for mobile */
    }

    /* Hide logo and span rings on mobile */
    .logo {
      display: none; /* Hide the logo */
    }

    .parent:hover .card .logo {
      display: none; /* Prevent hover effects from showing logo */
    }

    /* Adjust the positions of the circles */
    .logo .circle {
      display: block;
      position: absolute;
      aspect-ratio: 1;
      border-radius: 50%;
      top: 0;
      right: 0;
      box-shadow: rgba(100, 100, 111, 0.2) -10px 10px 20px 0px;
      -webkit-backdrop-filter: blur(5px);
      backdrop-filter: blur(5px);
      background: rgba(26, 86, 219, 0.2); /* Lightened #1a56db */
      transition: all 0.5s ease-in-out;
    }

    .logo .circle1 {
      width: 230px; /* Increased size */
      transform: translate3d(0, 0, 20px);
      top: 5px; /* Move up */
      right: 5px;
      background: rgba(68, 126, 250, 0.3); /* Lightened #447efa */
    }

    .logo .circle2 {
      width: 180px; /* Increased size */
      transform: translate3d(0, 0, 40px);
      top: 7px; /* Move up */
      right: 7px;
      -webkit-backdrop-filter: blur(1px);
      backdrop-filter: blur(1px);
      background: rgba(68, 126, 250, 0.2); /* Lightened #447efa */
      transition-delay: 0.4s;
    }

    .logo .circle3 {
      width: 140px; /* Increased size */
      transform: translate3d(0, 0, 60px);
      top: 14px; /* Move up */
      right: 14px;
      background: rgba(26, 86, 219, 0.3); /* Lightened #1a56db */
      transition-delay: 0.8s;
    }

    .logo .circle4 {
      width: 100px; /* Increased size */
      transform: translate3d(0, 0, 80px);
      top: 20px; /* Move up */
      right: 20px;
      background: rgba(68, 126, 250, 0.3); /* Lightened #447efa */
      transition-delay: 1.2s;
    }

    .logo .circle5 {
      width: 70px; /* Increased size */
      transform: translate3d(0, 0, 100px);
      top: 26px; /* Move up */
      right: 26px;
      display: grid;
      place-content: center;
      background: rgba(26, 86, 219, 0.4); /* Lightened #1a56db */
      transition-delay: 1.6s;
    }

    .logo .circle5 .svg {
      width: 20px;
      fill: white;
    }

    .parent:hover .card {
      transform: rotate3d(1, 1, 0, 30deg);
      box-shadow: rgba(5, 71, 17, 0.3) 30px 50px 25px -40px,
        rgba(5, 71, 17, 0.1) 0px 25px 30px 0px;
    }

    .parent:hover .card .bottom .social-buttons-container .social-button {
      transform: translate3d(0, 0, 50px);
      box-shadow: rgba(5, 71, 17, 0.2) -5px 20px 10px 0px;
    }

    .parent:hover .card .logo .circle2 {
      transform: translate3d(0, 0, 60px);
    }

    .parent:hover .card .logo .circle3 {
      transform: translate3d(0, 0, 80px);
    }

    .parent:hover .card .logo .circle4 {
      transform: translate3d(0, 0, 100px);
    }

    .parent:hover .card .logo .circle5 {
      transform: translate3d(0, 0, 120px);
    }
  }
  .glass {
    transform-style: preserve-3d;
    position: absolute;
    inset: 10px; /* Adjusted inset for better fit */
    border-radius: 55px;
    border-top-right-radius: 100%;
    background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.349) 0%,
      rgba(255, 255, 255, 0.815) 100%
    );
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
    transform: translate3d(0px, 0px, 25px);
    border-left: 1px solid white;
    border-bottom: 1px solid white;
    transition: all 0.5s ease-in-out;
  }
  .headshot {
    width: 150px; /* Set appropriate width */
    height: 150px; /* Set appropriate height */
    border-radius: 50%; /* Circular image */
    object-fit: cover; /* Crop the image to fit */
    margin-bottom: 10px; /* Space between image and title */
  }
  .content {
    padding: 120px 80px 0px 40px; /* Adjusted padding */
    transform: translate3d(0, 0, 26px);
  }

  .content .title {
    display: block;
    color: #000000;
    font-weight: 900;
    font-size: 25px; /* Increased font size */
  }

  .content .text {
    display: block;
    color: rgba(255, 255, 255, 0.7647058824);
    font-size: 18px; /* Increased font size */
    margin-top: 20px;
  }

  .bottom {
    padding: 15px 16px; /* Adjusted padding */
    transform-style: preserve-3d;
    position: absolute;
    bottom: 30px; /* Adjusted position */
    left: 30px; /* Adjusted position */
    right: 30px; /* Adjusted position */
    display: flex;
    align-items: center;
    justify-content: space-between;
    transform: translate3d(0, 0, 26px);
  }

  .bottom .view-more {
    display: flex;
    align-items: center;
    width: 40%;
    justify-content: flex-end;
    transition: all 0.2s ease-in-out;
  }

  .bottom .view-more:hover {
    transform: translate3d(0, 0, 10px);
  }

  .bottom .view-more .view-more-button {
    background: none;
    border: none;
    color: #00c37b;
    font-weight: bolder;
    font-size: 12px;
  }

  .bottom .view-more .svg {
    fill: none;
    stroke: #00c37b;
    stroke-width: 3px;
    max-height: 15px;
  }

  .bottom .social-buttons-container {
    display: flex;
    gap: 10px;
    transform-style: preserve-3d;
  }

  .bottom .social-buttons-container .social-button {
    width: 40px; /* Increased button size */
    aspect-ratio: 1;
    padding: 7px; /* Adjusted padding */
    background: rgb(255, 255, 255);
    border-radius: 50%;
    border: none;
    display: grid;
    place-content: center;
    box-shadow: rgba(5, 71, 17, 0.5) 0px 7px 5px -5px;
  }

  .bottom .social-buttons-container .social-button:first-child {
    transition: transform 0.2s ease-in-out 0.4s,
      box-shadow 0.2s ease-in-out 0.4s;
  }

  .bottom .social-buttons-container .social-button:nth-child(2) {
    transition: transform 0.2s ease-in-out 0.6s,
      box-shadow 0.2s ease-in-out 0.6s;
  }

  .bottom .social-buttons-container .social-button:nth-child(3) {
    transition: transform 0.2s ease-in-out 0.8s,
      box-shadow 0.2s ease-in-out 0.8s;
  }

  .bottom .social-buttons-container .social-button .svg {
    width: 15px;
    fill: #1a56db;
  }

  .bottom .social-buttons-container .social-button:hover {
    background: black;
  }

  .bottom .social-buttons-container .social-button:hover .svg {
    fill: white;
  }

  .bottom .social-buttons-container .social-button:active {
    background: rgb(255, 234, 0);
  }

  .bottom .social-buttons-container .social-button:active .svg {
    fill: black;
  }

  .logo {
    position: absolute;
    right: 0;
    top: 0;
    transform-style: preserve-3d;
  }

  .logo .circle {
    display: block;
    position: absolute;
    aspect-ratio: 1;
    border-radius: 50%;
    top: 0;
    right: 0;
    box-shadow: rgba(100, 100, 111, 0.2) -10px 10px 20px 0px;
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
    background: rgba(26, 86, 219, 0.2); /* Lightened #1a56db */
    transition: all 0.5s ease-in-out;
  }

  .logo .circle1 {
    width: 230px; /* Increased size */
    transform: translate3d(0, 0, 20px);
    top: 8px;
    right: 8px;
    background: rgba(68, 126, 250, 0.3); /* Lightened #447efa */
  }

  .logo .circle2 {
    width: 180px; /* Increased size */
    transform: translate3d(0, 0, 40px);
    top: 10px;
    right: 10px;
    -webkit-backdrop-filter: blur(1px);
    backdrop-filter: blur(1px);
    background: rgba(68, 126, 250, 0.2); /* Lightened #447efa */
    transition-delay: 0.4s;
  }

  .logo .circle3 {
    width: 140px; /* Increased size */
    transform: translate3d(0, 0, 60px);
    top: 17px;
    right: 17px;
    background: rgba(26, 86, 219, 0.3); /* Lightened #1a56db */
    transition-delay: 0.8s;
  }

  .logo .circle4 {
    width: 100px; /* Increased size */
    transform: translate3d(0, 0, 80px);
    top: 23px;
    right: 23px;
    background: rgba(68, 126, 250, 0.3); /* Lightened #447efa */
    transition-delay: 1.2s;
  }

  .logo .circle5 {
    width: 70px; /* Increased size */
    transform: translate3d(0, 0, 100px);
    top: 30px;
    right: 30px;
    display: grid;
    place-content: center;
    background: rgba(26, 86, 219, 0.4); /* Lightened #1a56db */
    transition-delay: 1.6s;
  }

  .logo .circle5 .svg {
    width: 20px;
    fill: white;
  }

  .parent:hover .card {
    transform: rotate3d(1, 1, 0, 30deg);
    box-shadow: rgba(5, 71, 17, 0.3) 30px 50px 25px -40px,
      rgba(5, 71, 17, 0.1) 0px 25px 30px 0px;
  }

  .parent:hover .card .bottom .social-buttons-container .social-button {
    transform: translate3d(0, 0, 50px);
    box-shadow: rgba(5, 71, 17, 0.2) -5px 20px 10px 0px;
  }

  .parent:hover .card .logo .circle2 {
    transform: translate3d(0, 0, 60px);
  }

  .parent:hover .card .logo .circle3 {
    transform: translate3d(0, 0, 80px);
  }

  .parent:hover .card .logo .circle4 {
    transform: translate3d(0, 0, 100px);
  }

  .parent:hover .card .logo .circle5 {
    transform: translate3d(0, 0, 120px);
  }
`;

export default Card;
