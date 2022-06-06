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
      if (isLaptop) {
        setSidebarActive(false);
        return;
      }

      const documentListener = (event: MouseEvent) => {
        const target = event.target;
        if (
          !(
            sidebarRef.current &&
            target instanceof Node &&
            sidebarRef.current.contains(target)
          )
        )
          setSidebarActive(false);
      };

      document.addEventListener("click", documentListener);

      return () => {
        document.removeEventListener("click", documentListener);
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
