function getAngle(x: number, y: number) {
  if (x !== 0) return Math.tan(x / y);
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

export type ForceGenerator<Body extends Point> = (
  body: Body,
  bodies: Body[],
  delta: number
) => {
  fx: number;
  fy: number;
};

export class Simulation<Body extends Point> {
  readonly bodies: Body[];
  readonly forceGenerators: ForceGenerator<Body>[];

  constructor(bodies: Body[], forceGenerators: ForceGenerator<Body>[]) {
    this.bodies = bodies.map(
      (body, i) =>
        ({
          ...body,
          x: body.x ?? 0,
          y: body.y ?? 0,
          vx: body.vx ?? 0,
          vy: body.vy ?? 0,
          fx: body.fx ?? 0,
          fy: body.fy ?? 0,
          index: body.index ?? i,
        } as Body)
    );
    this.forceGenerators = forceGenerators;
  }

  advance(delta: number): void {
    this.bodies.forEach((body) => {
      body.x! += body.vx! * delta;
      body.y! += body.vy! * delta;
      body.vx! += body.fx! * delta;
      body.vy! += body.fy! * delta;

      body.fx = body.fy = 0;
      this.forceGenerators.forEach((forceGenerator) => {
        const { fx, fy } = forceGenerator(body, this.bodies, delta);
        console.log({ forceGenerator, fx, fy });
        body.fx! += fx;
        body.fy! += fy;
      });
    });
  }

  activity(scale: number = 1): number {
    if (this.bodies.length < 1) return 0;

    return (
      this.bodies
        .map(({ fx, fy }) =>
          Math.sqrt((fx! * fx! + fy! * fy!) * (scale * scale))
        )
        .reduce((a, b) => a + b) / this.bodies.length
    );
  }
}

export const forceCenter = function (
  origin: {
    x: number;
    y: number;
  } = { x: 0, y: 0 }
): ForceGenerator<Point> {
  return function ({ x, y }: Point) {
    const deltaX = x! - origin.x;
    const deltaY = y! - origin.y;
    return { fx: deltaX * deltaX, fy: deltaY * deltaY };
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

  return (body, bodies) => {
    const sources = links
      .filter(({ target }) => target === id(body))
      .map(({ source }) => source);

    if (mem.get(body) === undefined) {
      mem.set(
        body,
        bodies.filter(
          (body) => sources.find((source) => source === id(body)) !== undefined
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
  minDistance: number = 0.5,
  coulombConstant: number = 1
): ForceGenerator<Point> {
  return function ({ x: x0, y: y0 }, bodies) {
    const forces = bodies
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

    return forces.reduce((prev, curr) => ({
      fx: prev.fx + curr.fx,
      fy: prev.fy + curr.fy,
    }));
  };
};
