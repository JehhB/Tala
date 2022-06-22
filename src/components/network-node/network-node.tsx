import { FunctionComponent, useContext, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import * as d3 from "d3";

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
  const nodeRef = useRef<SVGGElement>(null);
  const simulation = useContext(SimulationContext);
  const node = simulation.nodes()[index];
  if (node === undefined) return null;

  useEffect(
    function () {
      if (nodeRef.current === null) return;

      const dragStarted = (event: any) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        node.fx = node.x;
        node.fy = node.y;
      };

      const dragged = (event: any) => {
        node.fx = event.x;
        node.fy = event.y;
      };

      const dragEnded = (event: any) => {
        if (!event.active) simulation.alphaTarget(0);
        node.fx = null;
        node.fy = null;
      };

      const nodeEl = d3
        .select(nodeRef.current)
        .call(
          d3
            .drag<SVGGElement, unknown>()
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragEnded)
        );

      return () => {
        nodeEl.on("mousedown.drag", null);
      };
    },
    [node, simulation]
  );

  return (
    <g ref={nodeRef} transform={`translate(${node.x},${node.y})`}>
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
