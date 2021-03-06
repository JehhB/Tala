import { FunctionComponent, useContext } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

import { ConstellationContext } from "../../contexts";
import { ReactComponent as PlusIcon } from "../../assets/images/plus-icon.svg";
import { ReactComponent as TalaLogo } from "../../assets/images/tala.svg";

import {
  colorPalletGradient,
  cssColor,
  groupBy,
  rgb,
  toValidTitle,
} from "../../utils";

import "./navigation-drawer.css";

export const NavigationDrawer: FunctionComponent<{}> = function () {
  const constellation = useContext(ConstellationContext);

  let categories = null;

  if (constellation.error) {
    categories = (
      <h1 style={{ color: "red" }}>{constellation.error.message}</h1>
    );
  } else if (!constellation.isLoading && constellation.data) {
    const constellationData = constellation.data;

    const notesData = groupBy(
      constellationData.notes,
      (element) => element.category_id
    );

    const categoriesData = [...constellationData.categories].sort(
      (a, b) => a.index - b.index
    );

    categories = categoriesData.map((category, index) => (
      <div key={index} className="category">
        <div className="category__header">
          <h2>{category.name}</h2>
        </div>
        <nav
          className="category__nav"
          style={{
            borderLeftColor: cssColor(
              colorPalletGradient((index + 1) / categoriesData.length) ??
                rgb(255, 0, 0)
            ),
          }}
        >
          {notesData[category.id].map((note, index) => (
            <NavLink
              key={index}
              to={toValidTitle(note.title)}
              className={({ isActive }) =>
                "category__nav__link" + (isActive ? "--active" : "")
              }
            >
              {note.title}
            </NavLink>
          ))}
        </nav>
      </div>
    ));
  }

  return (
    <aside className="navigation-drawer">
      <div className="navigation-drawer__title">
        <div className="navigation-drawer__title__container">
          <TalaLogo />
          <h1>Tala</h1>
        </div>
      </div>
      <div className="navigation-drawer__categories">{categories}</div>
      <div className="navigation-drawer__options">
        <a href="#" className="option">
          <FontAwesomeIcon icon={faGear} className="option__icon" />
          <h3 className="option__title">Manage categories</h3>
        </a>
        <a href="#" className="option">
          <PlusIcon className="option__icon" />
          <h3 className="option__title">Create new category</h3>
        </a>
      </div>
    </aside>
  );
};
