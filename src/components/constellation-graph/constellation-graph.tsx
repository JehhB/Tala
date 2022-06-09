import { FunctionComponent, useContext } from "react";

import { NetworkGraph } from "../network-graph";
import { ConstellationContext } from "../../contexts";
import { RGBA, colorPalletGradient, rgb } from "../../utils";

export const ConstellationGraph: FunctionComponent<{}> = function () {
  const constellation = useContext(ConstellationContext);
  if (constellation.isLoading || constellation.error) return null;

  const { notes, links, categories } = constellation.data!;

  const getCategoryColor = (id: string) => {
    if (categories.length === 0) return rgb(255, 0, 0);

    const category = categories.find((category) => category.id === id);
    if (category === undefined) return null;

    return (
      colorPalletGradient((category.index + 1) / categories.length) ?? null
    );
  };

  return (
    <NetworkGraph
      nodes={notes
        .map((note) => ({
          label: note.title,
          description: note.description,
          color: getCategoryColor(note.category_id),
        }))
        .filter(
          (
            node
          ): node is {
            label: string;
            description: string | undefined;
            color: RGBA;
          } => node.color !== null
        )}
      links={links
        .map((link) => ({
          to: notes.findIndex((note) => link.noteID === note.id),
          from: notes.findIndex((note) => link.referenceID === note.id),
        }))
        .filter((link) => link.to === -1 || link.from === -1)}
    />
  );
};
