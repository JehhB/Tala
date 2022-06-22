import { FunctionComponent, useContext } from "react";
import { NavLink } from "react-router-dom";

import { SimulationContext } from "../../contexts";

import "./network-node.css";

type NetworkNodeProps = {
  index: number;
  label: string;
  color: string;
  to: string;
  watcher: number;
  description?: string;
};

const NODE_RADIUS = 8;

export const NetworkNode: FunctionComponent<NetworkNodeProps> = function ({
  index,
  label,
  color,
  to,
}) {
  const simulation = useContext(SimulationContext);
  const node = simulation.nodes()[index];
  if (node === undefined) return null;

  return (
    <g transform={`translate(${node.x},${node.y})`}>
      <NavLink
        to={to}
        className={({ isActive }) =>
          "network-node" + (isActive ? "--active" : "")
        }
      >
        <circle stroke="#000000" r={NODE_RADIUS} fill={color} />
        <text textAnchor="middle" y={3 * NODE_RADIUS}>
          {label}
        </text>
      </NavLink>
    </g>
  );
};
