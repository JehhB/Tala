import { FunctionComponent, useState, useEffect, useRef } from "react";

import { useMediaQuery } from "../hooks";
import { ReactComponent as MenuIcon } from "../assets/images/menu-icon.svg";
import { ReactComponent as XMarkIcon } from "../assets/images/xmark-icon.svg";
import HeaderBar from "../components/header-bar";
import NavigationDrawer from "../components/navigation-drawer";
import NoteContainer from "../components/note-container";

import "./styles/constellation-page.css";

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
    <div className="constellation-page">
      <HeaderBar>
        <div
          className={
            "constellation-page__header__menu" +
            (isSidebarActive ? "--active" : "")
          }
          onClick={function (event) {
            event.stopPropagation();
            setSidebarActive((active) => !active);
          }}
        >
          {isSidebarActive ? <XMarkIcon /> : <MenuIcon />}
        </div>
      </HeaderBar>
      <div className="constellation-page__main">
        <div
          ref={sidebarRef}
          className={
            "constellation-page__main__sidebar" +
            (isSidebarActive ? "--active" : "")
          }
        >
          <NavigationDrawer />
        </div>
        <div className="content">
          <div className="content__note">
            <NoteContainer title="test"></NoteContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConstellationPage;
