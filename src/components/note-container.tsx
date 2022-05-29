import { FunctionComponent, ReactNode } from "react";

import "./styles/note-container.css";

type NoteContainerProps = {
  title: string;
  color_percent?: number;
  children?: ReactNode;
};

const NoteContainer: FunctionComponent<NoteContainerProps> = function (props) {
  return (
    <main className="note">
      <div className="note__header"></div>
      <article className="note__body">{props.children}</article>
    </main>
  );
};

export default NoteContainer;
