import { FunctionComponent, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import * as d3 from "d3";
import { Selection, SimulationNodeDatum, ZoomBehavior } from "d3";

import { RGBA, cssColor } from "../../utils";

import "./network-graph.css";

const NODE_RADIUS = 8;
const NODE_MARGIN = 1.5;
const LINK_LENGHT = 100;
const NODE_GRAVITY = 0.05;
const NODE_REPULSION = 190;

type Node = {
  id: string;
  label: string;
  to: string;
  color: RGBA;
  degree?: number;
  description?: string;
};

type Link = {
  source: string;
  target: string;
};

type NetworkGraphProp = {
  nodes: Node[];
  links: Link[];
};

const zoomAndPan = function <
  ZoomElement extends Element,
  ChildElement extends Element
>(
  child: Selection<ChildElement, unknown, null, undefined>
): ZoomBehavior<ZoomElement, unknown> {
  const zoom = d3.zoom<ZoomElement, unknown>();
  let zooming = false;

  const zoomstarted = function () {
    zooming = true;
  };

  const zoomed = function ({ transform }: any) {
    child.attr("transform", transform);
  };

  const zoomended = function (this: ZoomElement) {
    zooming = false;
    setTimeout(() => {
      if (!zooming)
        d3.select(this).transition().call(zoom.transform, d3.zoomIdentity);
    }, 5000);
  };

  return zoom.on("start", zoomstarted).on("zoom", zoomed).on("end", zoomended);
};

export const NetworkGraph: FunctionComponent<NetworkGraphProp> = function (
  props
) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<
    { index: number; x: number; y: number }[] | null
  >(null);

  const nodesIndex = new Map<string, number>();
  props.nodes.forEach(({ id }, i) => {
    nodesIndex.set(id, i);
  });

  useEffect(
    function () {
      const simulationNodes = Array(props.nodes.length)
        .fill(0)
        .map((_) => ({} as SimulationNodeDatum));
      const simulationLinkDatum = props.links.map((link) => ({ ...link }));

      d3.forceSimulation(simulationNodes)
        .force("center", d3.forceCenter())
        .force("colide", d3.forceCollide(NODE_RADIUS * NODE_MARGIN))
        .force("charge", d3.forceManyBody().strength(-NODE_REPULSION))
        .force(
          "link",
          d3
            .forceLink(simulationLinkDatum)
            .distance(LINK_LENGHT)
            .id(({ index }) => props.nodes[index ?? -1]?.id ?? "")
        )
        .force("forceX", d3.forceX().strength(NODE_GRAVITY))
        .force("forceY", d3.forceY().strength(NODE_GRAVITY))
        .on("tick", ticked);

      function ticked() {
        const state = Array<{ index: number; x: number; y: number }>();
        simulationNodes.forEach(({ index, x, y }) =>
          state.push({
            index: index ?? -1,
            x: x ?? 0,
            y: y ?? 0,
          })
        );
        setNodes(state);
      }
    },
    [props.nodes.length, props.links.length]
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

      const svgSelection = d3.select(svgRef.current!);
      svgSelection.call(zoomAndPan(svgSelection.select<SVGGElement>(".graph")));

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
    >
      <g className="graph">
        <g className="graph__links">
          {nodes &&
            props.links.map(({ source, target }, i) => {
              const sourceNode = nodes[nodesIndex.get(source) ?? -1];
              const targetNode = nodes[nodesIndex.get(target) ?? -1];
              if (sourceNode === undefined || targetNode === undefined)
                return null;

              const { x: x1, y: y1 } = sourceNode;
              const { x: x2, y: y2 } = targetNode;

              return (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#aaa" />
              );
            })}
        </g>
        <g className="graph__nodes" strokeWidth="1px">
          {nodes &&
            nodes.map(({ index, x, y }) => {
              const node = props.nodes[index];
              if (node === undefined) return null;

              return (
                <g transform={`translate(${x},${y})`}>
                  <NavLink
                    key={node.id}
                    to={node.to}
                    className={({ isActive }) =>
                      "graph__node" + (isActive ? "--active" : "")
                    }
                  >
                    <circle
                      stroke="#000000"
                      r={NODE_RADIUS}
                      fill={cssColor(node.color)}
                    />
                    <text textAnchor="middle" y={3 * NODE_RADIUS}>
                      {node.label}
                    </text>
                  </NavLink>
                </g>
              );
            })}
        </g>
      </g>
    </svg>
  );
};
