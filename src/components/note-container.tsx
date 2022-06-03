import { FunctionComponent, ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListUl, faPen } from "@fortawesome/free-solid-svg-icons";

import { colorPalletGradient, cssColor, colorPallet } from "../utils";

import "./styles/note-container.css";

type NoteContainerProps = {
  title: string;
  color_percent?: number;
  children?: ReactNode;
};

const NoteContainer: FunctionComponent<NoteContainerProps> = function (props) {
  return (
    <main className="note">
      <div
        className="note__header"
        style={{
          borderTopColor: cssColor(
            colorPalletGradient(props.color_percent ?? 0) ?? colorPallet[0]
          ),
        }}
      >
        <FontAwesomeIcon icon={faListUl} className="note__header__toc" />
        <h1 className="note__header__title">{props.title}</h1>
        <FontAwesomeIcon icon={faPen} className="note__header__edit" />
      </div>
      <article className="note__body">{props.children}</article>
    </main>
  );
};

export default NoteContainer;
