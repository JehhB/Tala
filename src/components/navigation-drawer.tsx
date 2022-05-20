import { useEffect, useState } from "react";

const useMediaQuery = function (query: string): boolean {
  const [match, setMatch] = useState<boolean>(false);

  useEffect(() => {
    const listener = () => setMatch(window.matchMedia(query).matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, []);

  return match;
};

const NavigationDrawer = function () {};
