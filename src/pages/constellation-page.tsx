import { FunctionComponent, useState, useEffect } from "react";

import { useMediaQuery } from "../hooks";
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
      <HeaderBar />
      <div className="page__main">
        <div
          className={
            "page__main__sidebar" +
            (isSidebarActive ? " page__main__sidebar--active" : "")
          }
        >
          <NavigationDrawer />
        </div>
      </div>
    </div>
  );
};

export default ConstellationPage;
