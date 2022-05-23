import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [match, setMatch] = useState<boolean>(false);

  useEffect(
    function () {
      const media = window.matchMedia(query);
      const listener = () => setMatch(media.matches);

      window.addEventListener("resize", listener);
      return () => window.removeEventListener("resize", listener);
    },
    [query]
  );

  return match;
}
