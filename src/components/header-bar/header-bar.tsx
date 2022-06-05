import { FunctionComponent } from "react";

import { ReactComponent as TalaLogo } from "../../assets/images/tala.svg";
import { SearchBox } from "../search-box";

import "./header-bar.css";

type HeaderBarProps = {
  user?: any;
  children?: JSX.Element | JSX.Element[];
};

export const HeaderBar: FunctionComponent<HeaderBarProps> = function (props) {
  return (
    <header className="header">
      <div className="header__title">
        <div className="header__title__container">
          <TalaLogo />
          <h1>Tala</h1>
        </div>
      </div>
      <div className="header__navigation">
        {props.children}
        <div className="header__navigation__search">
          <SearchBox />
        </div>
        <nav>
          <div className="header__navigation__links">
            <a href="#">Constellations</a>
            <a href="#">Explore</a>
            <a href="#">Help</a>
          </div>
          <div className="header__navigation__user"></div>
        </nav>
      </div>
    </header>
  );
};
