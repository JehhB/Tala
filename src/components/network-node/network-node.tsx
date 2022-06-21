import { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";

import "./network-node.css";

type NetworkNodeProps = {
  index: number;
  label: string;
  color: string;
  to: string;
  x: number;
  y: number;
  description?: string;
};

const NODE_RADIUS = 8;

export const NetworkNode: FunctionComponent<NetworkNodeProps> = function ({
  label,
  color,
  to,
  x,
  y,
}) {
  return (
    <g transform={`translate(${x},${y})`}>
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
