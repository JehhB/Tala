import { FunctionComponent, useRef, useEffect } from "react";

import {
  RGBA,
  cssColor,
  Point,
  Simulation,
  forceCenter,
  forceCharges,
} from "../../utils";

export interface Node extends Point {
  id: string;
  label: string;
  color: RGBA;
  description?: string;
}

type NetworkGraphProp = {
  nodes: Node[];
  links: { source: string; target: string }[];
};

export const NetworkGraph: FunctionComponent<NetworkGraphProp> = function ({
  nodes,
  links,
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(
    function () {
      if (svgRef.current === null) return;
      const simulation = new Simulation(nodes, [
        forceCenter({ x: 0, y: 0 }, 0.2),
        forceCharges(30, 1),
      ]);

      const nodeGroup = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );
      nodeGroup.setAttribute("stroke-width", "1");
      nodeGroup.setAttribute("stroke", "#000000");
      svgRef.current.appendChild(nodeGroup);

      const nodeElements = nodes.map(({ color }) => {
        const element = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        element.setAttribute("fill", cssColor(color));
        element.setAttribute("r", "12");
        nodeGroup.append(element);

        return element;
      });

      const interval = setInterval(() => {
        simulation.advance(1 / 30);
        simulation.bodies.forEach(({ x, y }, i) => {
          nodeElements[i].setAttribute("cx", x!.toString());
          nodeElements[i].setAttribute("cy", y!.toString());
        });
      }, 1000 / 30);

      return () => {
        clearInterval(interval);
        svgRef.current!.innerHTML = "";
      };
    },
    [nodes.length, links.length]
  );

  useEffect(
    function () {
      if (!svgRef.current) return;

      const svg = svgRef.current;
      const listener = () => {
        svg.removeAttribute("viewBox");

        const width = svg.clientWidth;
        const height = svg.clientHeight;
        svg.setAttribute(
          "viewBox",
          `${-width / 2} ${-height / 2} ${width} ${height}`
        );
      };

      listener();

      window.addEventListener("resize", listener);
      return () => window.removeEventListener("resize", listener);
    },
    [svgRef]
  );

  return (
    <svg
      width="100%"
      height="100%"
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
    ></svg>
  );
};
