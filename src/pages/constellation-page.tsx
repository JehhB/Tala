import { FunctionComponent, useState, useEffect } from "react";

import { useMediaQuery } from "../hooks";
import { ReactComponent as MenuIcon } from "../assets/images/menu-icon.svg";
import { ReactComponent as XMarkIcon } from "../assets/images/xmark-icon.svg";
import HeaderBar from "../components/header-bar";
import NavigationDrawer from "../components/navigation-drawer";

import "./styles/page.css";

const ConstellationPage: FunctionComponent<{}> = function () {
  const [isSidebarActive, setSidebarActive] = useState<boolean>(false);
  const isLaptop = useMediaQuery("screen and (min-width: 905px)");

  useEffect(
    function () {
      if (isLaptop) setSidebarActive(false);
    },
    [isLaptop]
  );

  return (
    <div className="page">
      <HeaderBar>
        <div
          className={"page__header__menu" + (isSidebarActive ? "--active" : "")}
          onClick={function () {
            setSidebarActive((active) => !active);
          }}
        >
          {isSidebarActive ? <XMarkIcon /> : <MenuIcon />}
        </div>
      </HeaderBar>
      <div className="page__main">
        <div
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
