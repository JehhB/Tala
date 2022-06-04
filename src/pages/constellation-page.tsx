import { FunctionComponent, useEffect, useState } from "react";

import { useResponsiveSidebar } from "../hooks";
import { ConstellationContext } from "../contexts";
import { ReactComponent as MenuIcon } from "../assets/images/menu-icon.svg";
import { ReactComponent as XMarkIcon } from "../assets/images/xmark-icon.svg";

import HeaderBar from "../components/header-bar";
import NavigationDrawer from "../components/navigation-drawer";

import "./styles/page.css";
import { Constellation } from "../utils";

const ConstellationPage: FunctionComponent<{}> = function () {
  const [sidebarRef, isSidebarActive, toggleSidebar] = useResponsiveSidebar();

  const [constellationData, setConstellationData] =
    useState<Constellation | null>(null);

  useEffect(function () {
    fetch("/api/v1/constellation/test", { method: "GET" })
      .then((response) => response.json())
      .then((data) => setConstellationData(data));
  }, []);

  return (
    <ConstellationContext.Provider
      value={
        constellationData ?? { id: "", categories: [], notes: [], links: [] }
      }
    >
      <div className="page">
        <HeaderBar>
          <div
            className={
              "page__header__menu" + (isSidebarActive ? "--active" : "")
            }
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
    </ConstellationContext.Provider>
  );
};

export default ConstellationPage;
