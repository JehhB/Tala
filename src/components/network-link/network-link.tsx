import { FunctionComponent, useContext } from "react";

import { RGBA, colorID } from "../../utils";
import { SimulationContext } from "../../contexts";

type NetworkLinkProps = {
  watcher: number;
  source: number;
  target: number;
  c1: RGBA;
  c2: RGBA;
};

const LINK_THICKEST = 5;
const LINK_THINNEST = 1;

export const NetworkLink: FunctionComponent<NetworkLinkProps> = function ({
  source,
  target,
  c1,
  c2,
}) {
  const simulation = useContext(SimulationContext);
  const sourceNode = simulation.nodes()[source];
  const targetNode = simulation.nodes()[target];
  if (sourceNode === undefined || targetNode === undefined) return null;

  let { x: x1, y: y1 } = sourceNode;
  let { x: x2, y: y2 } = targetNode;
  (x1 = x1!), (y1 = y1!), (x2 = x2!), (y2 = y2!);

  const dx = x1 - x2;
  const dy = y1 - y2;
  const r = Math.sqrt(dx * dx + dy * dy);
  const theta = (Math.atan2(dy, dx) * 180) / Math.PI + 180;
  const c = colorID(c1) + colorID(c2);

  return (
    <polygon
      points={`${x1},${y1 + LINK_THICKEST / 2} 
${x1},${y1 - LINK_THICKEST / 2} 
${x1 + r},${y1 - LINK_THINNEST / 2} 
${x1 + r},${y1 + LINK_THINNEST / 2}`}
      transform-origin="left"
      transform={`rotate(${theta})`}
      fill={`url(#${c})`}
    />
  );
};
