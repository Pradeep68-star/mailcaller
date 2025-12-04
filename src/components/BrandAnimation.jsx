// src/components/BrandAnimation.jsx
import { useEffect, useState } from "react";

const BrandAnimation = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 200);
  }, []);

  const styledText = "MAIL CALLER".replace(/A/g, "Λ");

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "50%",                      // Perfect clean left half
        height: "100%",
        display: "flex",
        justifyContent: "center",          // CENTER FIX
        alignItems: "center",              // CENTER FIX
        pointerEvents: "none",
      }}
    >
      <div style={{ textAlign: "center" }}> {/* removed marginLeft */}

        {/* MAIN TITLE */}
        <div
          style={{
            fontFamily: "Ethnocentric, sans-serif",
            fontSize: "75px",
            fontWeight: "400",
            letterSpacing: show ? "14px" : "-50px",
            opacity: show ? 1 : 0,
            transition: "all 1.4s ease",
            transform: show
              ? "scale(1) translateY(0)"
              : "scale(0.9) translateY(-20px)",
            color: "#222",
            whiteSpace: "nowrap",          // ❗ Fixes MAIL/ALLER split
          }}
        >
          {styledText}
        </div>

        {/* REFLECTION */}
        <div
          style={{
            fontFamily: "Ethnocentric, sans-serif",
            fontSize: "75px",
            fontWeight: "400",
            letterSpacing: "14px",
            transform: "scaleY(-1)",
            color: "rgba(0,0,0,0.22)",
            opacity: show ? 0.22 : 0,
            marginTop: "-15px",             // closer shadow
            filter: "blur(1.8px)",
            transition: "opacity 1.3s ease 0.5s",
            whiteSpace: "nowrap",
          }}
        >
          {styledText}
        </div>
      </div>
    </div>
  );
};

export default BrandAnimation;
