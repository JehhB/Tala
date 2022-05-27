import { FunctionComponent } from "react";

import HeaderBar from "../components/header";
import NavigationDrawer from "../components/navigation-drawer";

import "./styles/page.css";

const ConstellationPage: FunctionComponent<{}> = function () {
  return (
    <div className="page">
      <HeaderBar />
      <div className="page__main">
        <NavigationDrawer />
      </div>
    </div>
  );
};

export default ConstellationPage;
