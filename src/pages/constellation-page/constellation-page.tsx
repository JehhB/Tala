import { FunctionComponent } from "react";
import { Outlet, useParams } from "react-router-dom";
import useFetch from "react-fetch-hook";

import { useResponsiveSidebar } from "../../hooks";
import { ConstellationContext } from "../../contexts";
import {
  ConstellationGraph,
  HeaderBar,
  NavigationDrawer,
} from "../../components";
import { Constellation } from "../../utils";

import { ReactComponent as MenuIcon } from "../../assets/images/menu-icon.svg";
import { ReactComponent as XMarkIcon } from "../../assets/images/xmark-icon.svg";

import "./constellation-page.css";

export const ConstellationPage: FunctionComponent<{}> = function () {
  const [sidebarRef, isSidebarActive, toggleSidebar] = useResponsiveSidebar();
  const { userName, constellationName } = useParams();
  const constellation = useFetch<Constellation>(
    `/api/v1/${userName}/${constellationName}`
  );

  return (
    <ConstellationContext.Provider value={constellation}>
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
            <div className="content__graph">
              <ConstellationGraph />
            </div>
            <div className="content__note">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </ConstellationContext.Provider>
  );
};
