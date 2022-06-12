export type Point = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx: number;
  fy: number;
};
export type ForceGenerator<Body extends Point> = (
  body: Body,
  delta: number
) => {
  fx: number;
  fy: number;
};

export class Simulation<Body extends Point> {
  readonly bodies: Body[];
  readonly forceGenerators: ForceGenerator<Body>[];

  constructor(bodies: Body[], forceGenerators: ForceGenerator<Body>[]) {
    this.bodies = bodies;
    this.forceGenerators = forceGenerators;
  }

  advance(delta: number): void {
    this.bodies.forEach((body) => {
      body.x += body.vx * delta;
      body.y += body.vy * delta;
      body.vx += body.fx * delta;
      body.vy += body.fy * delta;

      body.fx = body.fy = 0;
      this.forceGenerators.forEach((forceGenerator) => {
        const { fx, fy } = forceGenerator(body, delta);
        body.fx += fx;
        body.fy += fy;
      });
    });
  }

  activity(scale: number = 20): number {
    return (
      this.bodies
        .map(({ fx, fy }) => Math.sqrt(fx * fx + fy * fy))
        .reduce((a, b) => a + b) / this.bodies.length
    );
  }
}
