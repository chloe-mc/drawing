import { MouseEvent } from 'react';
import { Rectangle, Ellipse, PolyLine } from './tools';

export interface ToolEvents {
  handleMouseMove: (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shape: Shape) => void
  ) => void;
  handleMouseUp: (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shape: Shape) => void
  ) => void;
  handleMouseDown: (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shape: Shape) => void
  ) => void;
  handleDoubleClick: (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shape: Shape) => void
  ) => void;
  render: (ctx: CanvasRenderingContext2D) => void;
  // reset: () => any;
}

export type Tool = Rectangle | Ellipse | PolyLine | null;

export type Shape = Rectangle | Ellipse | PolyLine;

export type Point = { x: number; y: number };

export enum LineStyle {
  solid,
  dashed,
}
