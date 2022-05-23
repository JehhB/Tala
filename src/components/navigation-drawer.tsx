import { CSSProperties, FunctionComponent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

import { colorPalletGradient, cssColor, rgb } from "../utils";
import { ReactComponent as PlusIcon } from "../assets/images/plus-icon.svg";

import "./styles/navigation-drawer.css";

type Category = { name: string; notes: { name: string }[] };
const mockData: Category[] = [
  {
    name: "Fleeting notes",
    notes: [
      { name: "Fleeting note 1" },
      { name: "Fleeting note 2" },
      { name: "Fleeting note with long title" },
    ],
  },
  {
    name: "Literature notes",
    notes: [
      { name: "Literature note 1" },
      { name: "Literature note 2" },
      { name: "Literature note with long title" },
    ],
  },
  {
    name: "Permanent notes",
    notes: [
      { name: "Permanent note 1" },
      { name: "Permanent note 2" },
      { name: "Permanent note with long title" },
    ],
  },
];

const NavigationDrawer: FunctionComponent<{}> = function () {
  const categories = mockData.map((category, index) => (
    <div key={index} className="category">
      <div className="category__header">
        <h2>{category.name}</h2>
      </div>
      <nav
        className="category__nav"
        style={
          {
            "--category-color": cssColor(
              colorPalletGradient((index + 1) / mockData.length) ??
                rgb(255, 0, 0)
            ),
          } as CSSProperties
        }
      >
        {category.notes.map((note, index) => (
          <a href="#" key={index} className="category__nav__link">
            {note.name}
          </a>
        ))}
      </nav>
    </div>
  ));

  return (
    <div className="navigation-drawer">
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
    </div>
  );
};

export default NavigationDrawer;
