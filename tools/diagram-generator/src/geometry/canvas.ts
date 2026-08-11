export const CANONICAL_CANVAS = Object.freeze({ width: 1200, height: 800 });

export interface Point {
  x: number;
  y: number;
}

export interface Bounds extends Point {
  width: number;
  height: number;
}

export interface CanvasSize {
  width: number;
  height: number;
}

export function assertFiniteNumber(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${label} must be a finite number`);
  }
}

export function assertPointWithinCanvas(
  point: Point,
  label: string,
  canvas: CanvasSize = CANONICAL_CANVAS,
): void {
  assertFiniteNumber(point.x, `${label}.x`);
  assertFiniteNumber(point.y, `${label}.y`);

  if (point.x < 0 || point.x > canvas.width) {
    throw new RangeError(`${label}.x must be within the canvas`);
  }
  if (point.y < 0 || point.y > canvas.height) {
    throw new RangeError(`${label}.y must be within the canvas`);
  }
}

export function assertPointWithMarginWithinCanvas(
  point: Point,
  margin: number,
  label: string,
  canvas: CanvasSize = CANONICAL_CANVAS,
): void {
  assertPointWithinCanvas(point, label, canvas);
  assertFiniteNumber(margin, `${label}.margin`);
  if (margin < 0) throw new RangeError(`${label}.margin cannot be negative`);

  if (
    point.x - margin < 0 ||
    point.x + margin > canvas.width ||
    point.y - margin < 0 ||
    point.y + margin > canvas.height
  ) {
    throw new RangeError(`${label} plus its stroke must fit within the canvas`);
  }
}

export function assertBoundsWithinCanvas(
  bounds: Bounds,
  label: string,
  canvas: CanvasSize = CANONICAL_CANVAS,
): void {
  assertPointWithinCanvas(bounds, label, canvas);
  assertFiniteNumber(bounds.width, `${label}.width`);
  assertFiniteNumber(bounds.height, `${label}.height`);

  if (bounds.width <= 0 || bounds.height <= 0) {
    throw new RangeError(`${label} width and height must be positive`);
  }
  if (
    bounds.x + bounds.width > canvas.width ||
    bounds.y + bounds.height > canvas.height
  ) {
    throw new RangeError(`${label} must fit within the canvas`);
  }
}

export function formatSvgNumber(value: number): string {
  assertFiniteNumber(value, "SVG number");
  const rounded = Math.round(value * 1000) / 1000;
  return Object.is(rounded, -0) ? "0" : String(rounded);
}
