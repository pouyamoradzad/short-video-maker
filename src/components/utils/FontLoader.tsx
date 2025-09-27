import React from "react";
import { continueRender, delayRender } from "remotion";

const PERSIAN_FONTS_URL = "https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700;900&family=Vazir:wght@400;700;900&display=swap";

export const PersianFontLoader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  React.useEffect(() => {
    const handle = delayRender("Loading Persian fonts");

    // Check if the font link already exists
    const existingLink = document.querySelector(`link[href="${PERSIAN_FONTS_URL}"]`);
    
    if (existingLink) {
      setFontsLoaded(true);
      continueRender(handle);
      return;
    }

    // Create and append the font link
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = PERSIAN_FONTS_URL;
    
    link.onload = () => {
      setFontsLoaded(true);
      continueRender(handle);
    };
    
    link.onerror = () => {
      console.warn("Failed to load Persian fonts, falling back to system fonts");
      setFontsLoaded(true);
      continueRender(handle);
    };

    document.head.appendChild(link);

    return () => {
      // Cleanup function
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return <>{children}</>;
};

export const PERSIAN_FONT_FAMILY = "'Noto Sans Arabic', 'Vazir', 'Sahel', 'Tahoma', Arial, sans-serif";