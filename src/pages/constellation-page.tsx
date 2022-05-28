import { FunctionComponent, useState, useEffect, useRef } from "react";

import { useMediaQuery } from "../hooks";
import { ReactComponent as MenuIcon } from "../assets/images/menu-icon.svg";
import { ReactComponent as XMarkIcon } from "../assets/images/xmark-icon.svg";
import HeaderBar from "../components/header-bar";
import NavigationDrawer from "../components/navigation-drawer";

import "./styles/page.css";

const ConstellationPage: FunctionComponent<{}> = function () {
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

  return (
    <div className="page">
      <HeaderBar>
        <div
          className={"page__header__menu" + (isSidebarActive ? "--active" : "")}
          onClick={function (event) {
            event.stopPropagation();
            setSidebarActive((active) => !active);
          }}
        >
          {isSidebarActive ? <XMarkIcon /> : <MenuIcon />}
        </div>
      </HeaderBar>
      <div className="page__main">
        <div
          ref={sidebarRef}
          className={
            "page__main__sidebar" + (isSidebarActive ? "--active" : "")
          }
        >
          <NavigationDrawer />
        </div>
      </div>
    </div>
  );
};

export default ConstellationPage;
