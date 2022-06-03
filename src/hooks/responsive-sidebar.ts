import { useRef, useState, useEffect, RefObject } from "react";

import { useMediaQuery } from "../hooks";

export function useResponsiveSidebar(): [
  RefObject<HTMLDivElement>,
  boolean,
  () => void
] {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isSidebarActive, setSidebarActive] = useState<boolean>(false);
  const isLaptop = useMediaQuery("screen and (min-width: 905px)");

  useEffect(
    function () {
      if (isLaptop) setSidebarActive(false);

      const documentListener = () => {
        setSidebarActive(false);
      };
      const sidebarListener = (event: Event) => {
        event.stopPropagation();
      };

      document.addEventListener("click", documentListener);
      sidebarRef.current?.addEventListener("click", sidebarListener);

      return () => {
        document.removeEventListener("click", documentListener);
        sidebarRef.current?.removeEventListener("click", sidebarListener);
      };
    },
    [isLaptop]
  );

  return [
    sidebarRef,
    isSidebarActive,
    () => {
      setSidebarActive((state) => !state);
    },
  ];
}
