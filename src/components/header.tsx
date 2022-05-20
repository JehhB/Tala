import { useState } from "react";

import SearchBox from "./search-box";

import { ReactComponent as TalaLogo } from "../assets/images/tala.svg";
import { ReactComponent as MenuIcon } from "../assets/images/menu-icon.svg";

import "./styles/header.css";

function HeaderBar() {
  const [sidebar, toggleSidebar] = useState<boolean>(false);

  return (
    <header className="header">
      <div className="header__title">
        <TalaLogo />
        <h1>Tala</h1>
      </div>
      <div className="header__navigation">
        <MenuIcon className="header__navigation__menu" />
        <div className="header__navigation__search">
          <SearchBox />
        </div>
        <nav>
          <div className="header__navigation__links">
            <h3>Constellations</h3>
            <h3>Explore</h3>
            <h3>Help</h3>
          </div>
          <div className="header__navigation__user"></div>
        </nav>
      </div>
    </header>
  );
}

export default HeaderBar;
