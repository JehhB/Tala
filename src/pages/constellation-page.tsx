import { FunctionComponent, useEffect, useState } from "react";

import { useResponsiveSidebar } from "../hooks";
import { ConstellationContext } from "../contexts";
import { ReactComponent as MenuIcon } from "../assets/images/menu-icon.svg";
import { ReactComponent as XMarkIcon } from "../assets/images/xmark-icon.svg";

import HeaderBar from "../components/header-bar";
import NavigationDrawer from "../components/navigation-drawer";
import NoteContainer from "../components/note-container";

import "./styles/constellation-page.css";
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
      <div className="constellation-page">
        <HeaderBar>
          <div
            className={
              "constellation-page__header__menu" +
              (isSidebarActive ? "--active" : "")
            }
            onClick={function (event) {
              event.stopPropagation();
              toggleSidebar();
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
    </ConstellationContext.Provider>
  );
};

export default ConstellationPage;
