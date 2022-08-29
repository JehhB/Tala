import { FunctionComponent, ReactNode } from "react";
import { colorPalletGradient, cssColor, colorPallet } from "../../utils";

import "./note-container.css";

type NoteContainerProps = {
  title: string;
  color_percent?: number;
  children?: ReactNode;
  left_actions?: ReactNode;
  right_actions?: ReactNode;
};

export const NoteContainer: FunctionComponent<NoteContainerProps> = function (
  props
) {
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
        <div className="note__header__left">{props.left_actions}</div>
        <h1 className="note__header__title">{props.title}</h1>
        <div className="note__header__right">{props.right_actions}</div>
      </div>
      <article className="note__body">{props.children}</article>
    </main>
  );
};
