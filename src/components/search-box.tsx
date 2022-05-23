import { FunctionComponent, useRef } from "react";

import { ReactComponent as SearchIcon } from "../assets/images/search-icon.svg";

import "./styles/search-box.css";

const SearchBox: FunctionComponent<{}> = function () {
  const input = useRef<HTMLInputElement>(null);

  return (
    <div className="search">
      <div
        className="search__box"
        onClick={() => {
          input.current?.focus();
        }}
      >
        <input
          ref={input}
          className="search__box__input"
          placeholder="Search"
        />
        <SearchIcon className="search__box__icon" />
      </div>
      <div className="search__results"></div>
    </div>
  );
};

export default SearchBox;
