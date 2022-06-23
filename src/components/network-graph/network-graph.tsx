import {
  FunctionComponent,
  ReactNode,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import * as d3 from "d3";
import { Selection, Simulation, SimulationNodeDatum, ZoomBehavior } from "d3";

import { NetworkNode, NetworkLink } from "../index";
import { RGBA, cssColor, colorID } from "../../utils";
import { SimulationContext } from "../../contexts";

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
  source: number;
  target: number;
};

type NetworkGraphProps = {
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
  let timer: number;

  const zoomed = function (this: ZoomElement, { transform }: any) {
    child.attr("transform", transform);
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      d3.select(this).transition().call(zoom.transform, d3.zoomIdentity);
    }, 5000);
  };

  return zoom.on("zoom", zoomed);
};

export const NetworkGraph: FunctionComponent<NetworkGraphProps> = function ({
  nodes,
  links,
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [watcher, advance] = useState(0);
  const [simulation, setSimulation] = useState<Simulation<
    SimulationNodeDatum,
    undefined
  > | null>(null);

  const colors = nodes
    .map(({ color }) => color)
    .filter((v, i, s) => s.findIndex((c) => colorID(c) == colorID(v)) === i);

  useEffect(
    function () {
      const simulationNodes = Array(nodes.length)
        .fill(0)
        .map((_) => ({} as SimulationNodeDatum));
      const simulationLinkDatum = links.map((link) => ({ ...link }));

      const gravity = (i: number) =>
        (nodes[i]?.degree ?? 0) > 0 ? NODE_GRAVITY / 4 : NODE_GRAVITY;

      const simulation = d3
        .forceSimulation(simulationNodes)
        .alphaDecay(0.01)
        .force("center", d3.forceCenter())
        .force("colide", d3.forceCollide(NODE_RADIUS * NODE_MARGIN))
        .force("charge", d3.forceManyBody().strength(-NODE_REPULSION))
        .force("link", d3.forceLink(simulationLinkDatum).distance(LINK_LENGHT))
        .force(
          "forceX",
          d3.forceX().strength(({ index }) => gravity(index ?? -1))
        )
        .force(
          "forceY",
          d3.forceY().strength(({ index }) => gravity(index ?? -1))
        )
        .on("tick", function () {
          advance((a) => a + 1);
        });
      setSimulation(simulation);

      return () => {
        setSimulation(null);
      };
    },
    [nodes.length, links.length]
  );

  useEffect(function () {
    const svg = svgRef.current!;
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
    return () => {
      window.removeEventListener("resize", listener);
    };
  }, []);

  const handleGraph = useCallback(function (graph: SVGGElement) {
    const svgSelection = d3.select(svgRef.current!);
    svgSelection.call(zoomAndPan(d3.select(graph)));
  }, []);

  return (
    <svg
      width="100%"
      height="100%"
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {Array<ReactNode>().concat(
          ...colors.map((source) =>
            colors.map((target) => {
              const id = colorID(source) + colorID(target);
              return (
                <linearGradient key={id} id={id}>
                  <stop offset="0%" stopColor={cssColor(source)} />
                  <stop offset="100%" stopColor={cssColor(target)} />
                </linearGradient>
              );
            })
          )
        )}
      </defs>
      {simulation && (
        <SimulationContext.Provider value={simulation}>
          <g ref={handleGraph} className="graph">
            <g className="graph__links">
              {links.map(({ source, target }, i) => {
                const c1 = nodes[source].color;
                const c2 = nodes[target].color;
                return (
                  <NetworkLink
                    key={i}
                    {...{ source, target, c1, c2, watcher }}
                  />
                );
              })}
            </g>
            <g className="graph__nodes" strokeWidth="1px">
              {nodes.map(({ label, to, color, id }, index) => (
                <NetworkNode
                  key={id}
                  color={cssColor(color)}
                  {...{ label, to, index, watcher }}
                />
              ))}
            </g>
          </g>
        </SimulationContext.Provider>
      )}
    </svg>
  );
};
