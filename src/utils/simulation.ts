import { mulberry32 } from "./random";

const RAND_SEED = 19;
const random = mulberry32(RAND_SEED);

function getAngle(x: number, y: number) {
  if (x !== 0) return Math.tan(x / y);
  if (y == 0) return random() * Math.PI * 2;
  if (y < 0) return -Math.PI / 2;
  return Math.PI / 2;
}

export type Point = {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number;
  fy?: number;
  index?: number;
};

class Rectangle {
  x: number;
  y: number;
  w: number;
  h: number;

  constructor(center: Point, dimensions: { w: number; h: number }) {
    this.x = center.x ?? 0;
    this.y = center.y ?? 0;
    this.w = dimensions.w;
    this.h = dimensions.h;
  }

  contains({ x, y }: Point): boolean {
    const { x: x0, y: y0, w, h } = this;
    if (x === undefined || y === undefined) return false;
    return (
      x >= x0 - w / 2 && x < x0 + w / 2 && y >= y0 - h / 2 && y < y0 + h / 2
    );
  }

  intersects({ x: x0, y: y0, w: w0, h: h0 }: Rectangle): boolean {
    const { x: x1, y: y1, w: w1, h: h1 } = this;
    return (
      x0 + w0 / 2 >= x1 - w1 / 2 &&
      x1 + w1 / 2 >= x0 - w0 / 2 &&
      y0 + h0 / 2 >= y1 - h1 / 2 &&
      y1 + h1 / 2 >= y0 - h0 / 2
    );
  }
}

class QuadTree<Body extends Point> {
  nodes: QuadTree<Body>[] | null;
  agents: Body[] | null;
  bounds: Rectangle;
  length: number;
  capacity: number;
  maxDepth: number;

  constructor(
    agents: Body[],
    bounds: Rectangle,
    options?: { capacity?: number; maxDepth?: number }
  ) {
    this.nodes = null;
    this.agents = new Array();
    this.bounds = bounds;
    this.length = 0;
    this.capacity = options?.capacity ?? 4;
    this.maxDepth = options?.maxDepth ?? 10;

    agents.forEach((agent) => {
      this.insert(agent);
    });
  }

  merge(): boolean {
    if (this.nodes === null) return false;

    this.nodes.forEach((node) => {
      node.merge();
    });

    this.agents = this.nodes.reduce(
      (prev, curr) => prev.concat(curr.agents!),
      new Array<Body>()
    );
    this.nodes = null;
    return true;
  }

  private split(): boolean {
    if (this.maxDepth <= 1) return false;
    if (this.nodes !== null) return true;

    const { x, y, w, h } = this.bounds;
    this.nodes = new Array(4);

    const dimensions = { w: w / 2, h: h / 2 };
    const options = { capacity: this.capacity, maxDepth: this.maxDepth - 1 };
    const nw = { x: x - w / 4, y: y - h / 4 };
    const ne = { x: x + w / 4, y: y - h / 4 };
    const sw = { x: x - w / 4, y: y + h / 4 };
    const se = { x: x + w / 4, y: y + h / 4 };

    this.nodes[0] = new QuadTree(
      this.agents!,
      new Rectangle(nw, dimensions),
      options
    );
    this.nodes[1] = new QuadTree(
      this.agents!,
      new Rectangle(ne, dimensions),
      options
    );
    this.nodes[2] = new QuadTree(
      this.agents!,
      new Rectangle(sw, dimensions),
      options
    );
    this.nodes[3] = new QuadTree(
      this.agents!,
      new Rectangle(se, dimensions),
      options
    );

    this.agents = null;

    return true;
  }

  insert(agent: Body): boolean {
    if (!this.bounds.contains(agent)) return false;

    this.length = this.length + 1;
    if (this.length > this.capacity && this.split())
      return this.nodes!.map((n) => n.insert(agent)).reduce((a, b) => a || b);

    this.agents!.push(agent);
    return true;
  }

  select(bound: Rectangle = this.bounds): Body[] {
    if (!bound.intersects(this.bounds)) return [];
    if (this.nodes === null) return this.agents!;

    return this.nodes.reduce(
      (prev, curr) => prev.concat(curr.select(bound)),
      new Array<Body>()
    );
  }

  private seperate(agents: Body[]): { out: Body[]; inside: Body[] } {
    const out = new Array<Body>();
    const inside = new Array<Body>();

    agents.forEach((agent) => {
      if (this.bounds.contains(agent)) {
        inside.push(agent);
      } else {
        out.push(agent);
      }
    });
    return { out, inside };
  }

  update(t: number): Body[] {
    if (this.agents !== null) {
      this.agents.forEach((agent) => {
        agent.x! += agent.vx! * t + 0.5 * agent.fx! * t * t;
        agent.y! += agent.vy! * t + 0.5 * agent.fy! * t * t;
        agent.vx! += agent.fx! * t;
        agent.vy! += agent.fy! * t;
      });

      const { inside, out } = this.seperate(this.agents);
      this.agents = inside;
      this.length = this.agents.length;

      return out;
    }

    const moved = this.nodes!.reduce(
      (acc, node) => acc.concat(node.update(t)),
      new Array<Body>()
    );

    const { inside, out } = this.seperate(moved);
    this.length -= out.length;

    if (this.length <= this.capacity) {
      this.merge();
    } else {
      inside.forEach((agent) => {
        this.nodes!.forEach((node) => node.insert(agent));
      });
    }

    return out;
  }

  forEach(callbackfn: (agent: Body, index: number) => void): void {
    if (this.nodes === null) {
      this.agents!.forEach((agent) => {
        callbackfn(agent, agent.index ?? -1);
      });
      return;
    }

    this.nodes!.forEach((node) => {
      node.forEach(callbackfn);
    });
  }
}

export type ForceGenerator<Body extends Point> = (
  body: Body,
  index: number,
  bodies: QuadTree<Body>
) => {
  fx: number;
  fy: number;
};

export class Simulation<Body extends Point> {
  readonly bodies: QuadTree<Body>;
  readonly forceGenerators: ForceGenerator<Body>[];

  constructor(bodies: Body[], forceGenerators: ForceGenerator<Body>[]) {
    this.bodies = new QuadTree(
      bodies.map(
        (body, i) =>
          ({
            ...body,
            x: body.x ?? 0,
            y: body.y ?? 0,
            vx: body.vx ?? 0,
            vy: body.vy ?? 0,
            fx: body.fx ?? 0,
            fy: body.fy ?? 0,
            index: i,
          } as Body)
      ),
      new Rectangle({ x: 0, y: 0 }, { w: 8000, h: 8000 })
    );
    this.forceGenerators = forceGenerators;
  }

  advance(delta: number): Body[] {
    this.bodies.forEach((body, i) => {
      body.fx = body.fy = 0;
      this.forceGenerators.forEach((forceGenerator) => {
        const { fx, fy } = forceGenerator(body, i, this.bodies);
        body.fx! += fx;
        body.fy! += fy;
      });
    });
    return this.bodies.update(delta);
  }

  activity(scale: number = 1): number {
    if (this.bodies.length < 1) return 0;

    return (
      (this.bodies
        .select()
        .map(({ fx, fy }) => Math.sqrt(fx! * fx! + fy! * fy!))
        .reduce((a, b) => a + b) /
        this.bodies.length) *
      scale
    );
  }
}

export const forceCenter = function (
  origin: {
    x: number;
    y: number;
  } = { x: 0, y: 0 },
  gravitaitonalConstant: number = 0.5
): ForceGenerator<Point> {
  return function ({ x, y }: Point) {
    const deltaX = origin.x - x!;
    const deltaY = origin.y - y!;
    return {
      fx: gravitaitonalConstant * deltaX,
      fy: gravitaitonalConstant * deltaY,
    };
  };
};

export const forceLink = function <Body extends Point>(
  links: { source: string | number; target: string | number }[],
  length: number,
  minDeltaSq?: number,
  hookeanSprintConstant: number = 1,
  id: (body: Body) => string | number | null = (body) => body.index ?? null
): ForceGenerator<Body> {
  const mem = new Map<Body, Body[]>();
  if (minDeltaSq === undefined) minDeltaSq = (length / 20) * (length / 20);

  return (body, _i, bodies) => {
    const sources = links
      .filter(({ target }) => target === id(body))
      .map(({ source }) => source);

    if (mem.get(body) === undefined) {
      mem.set(
        body,
        bodies
          .select()
          .filter(
            (body) =>
              sources.find((source) => source === id(body)) !== undefined
          )
      );
    }

    const { x: x0, y: y0 } = body;
    const springForces = mem
      .get(body)!
      .map(({ x: x1, y: y1 }) => ({ x: x1! - x0!, y: y1! - y0! }))
      .map(({ x, y }) => ({
        delta: Math.sqrt(x * x + y * y) - length,
        angle: getAngle(x, y),
      }))
      .filter(({ delta }) => delta * delta > minDeltaSq!)
      .map(({ delta, angle }) => ({
        fx: delta * hookeanSprintConstant * Math.cos(angle),
        fy: delta * hookeanSprintConstant * Math.sin(angle),
      }));

    return springForces.reduce((prev, curr) => ({
      fx: prev.fx + curr.fx,
      fy: prev.fy + curr.fy,
    }));
  };
};

export const forceCharges = function (
  charge: number,
  minDistance: number = 5,
  maxDistance: number = 10000,
  coulombConstant: number = 0.5
): ForceGenerator<Point> {
  return function ({ x: x0, y: y0 }, i, bodies) {
    const forces = bodies
      .select(
        new Rectangle({ x: x0, y: y0 }, { w: maxDistance, h: maxDistance })
      )
      .filter((_, idx) => idx !== i)
      .map(({ x, y }) => ({ x: x! - x0!, y: y! - y0! }))
      .map(({ x, y }) => ({
        r: Math.sqrt(x * x + y * y),
        angle: getAngle(x, y),
      }))
      .map(({ r, angle }) => ({
        r: r < minDistance ? minDistance : r,
        angle,
      }))
      .map(({ r, angle }) => ({
        f: (coulombConstant * charge * charge) / (r * r),
        angle,
      }))
      .map(({ f, angle }) => ({
        fx: f * Math.cos(angle),
        fy: f * Math.sin(angle),
      }));

    return forces.reduce(
      (prev, curr) => ({
        fx: prev.fx + curr.fx,
        fy: prev.fy + curr.fy,
      }),
      { fx: 0, fy: 0 }
    );
  };
};
