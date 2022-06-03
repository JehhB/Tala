import { FunctionComponent } from "react";

import { useResponsiveSidebar } from "../hooks";
import { ReactComponent as MenuIcon } from "../assets/images/menu-icon.svg";
import { ReactComponent as XMarkIcon } from "../assets/images/xmark-icon.svg";
import HeaderBar from "../components/header-bar";
import NavigationDrawer from "../components/navigation-drawer";

import "./styles/page.css";

const ConstellationPage: FunctionComponent<{}> = function () {
  const [sidebarRef, isSidebarActive, toggleSidebar] = useResponsiveSidebar();

  return (
    <div className="page">
      <HeaderBar>
        <div
          className={"page__header__menu" + (isSidebarActive ? "--active" : "")}
          onClick={function (event) {
            event.stopPropagation();
            toggleSidebar();
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
