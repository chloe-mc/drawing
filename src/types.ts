import { MouseEvent } from 'react';
import { Rectangle, Ellipse, PolyLine } from './tools';

export interface ToolEvents {
  handleMouseMove: (e: MouseEvent<HTMLCanvasElement>) => void;
  handleMouseUp: (e: MouseEvent<HTMLCanvasElement>) => void;
  handleMouseDown: (e: MouseEvent<HTMLCanvasElement>) => void;
  handleDoubleClick: (e: MouseEvent<HTMLCanvasElement>) => void;
  render: (ctx: CanvasRenderingContext2D) => void;
}

export type Tool = Rectangle | Ellipse | PolyLine | null;

export type Shape = Rectangle | Ellipse | PolyLine;

export type Point = { x: number; y: number };

export enum LineStyle {
  solid,
  dashed,
}
