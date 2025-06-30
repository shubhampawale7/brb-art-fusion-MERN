import React from "react";

const Logo = () => {
  // We're placing the SVG code directly inside the component's return statement
  return (
    <svg
      width="250"
      height="60"
      viewBox="0 0 250 60"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:wght@400&display=swap');
          `}
        </style>
      </defs>

      <text
        x="0"
        y="35"
        fontFamily="'Playfair Display', serif"
        fontSize="36"
        fontWeight="700"
        fill="#334155"
      >
        BRB
      </text>

      <text
        x="105"
        y="33"
        fontFamily="'Montserrat', sans-serif"
        fontSize="20"
        fontWeight="400"
        fill="#64748B"
      >
        Art Fusion
      </text>

      <rect x="0" y="48" width="220" height="1.5" fill="#BFA181" />
    </svg>
  );
};

export default Logo;
