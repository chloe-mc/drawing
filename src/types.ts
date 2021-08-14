import { MouseEvent } from 'react';
import { Rectangle, Ellipse, PolyLine } from './tools';

export interface ToolEvents {
  handleMouseMove: (e: MouseEvent<HTMLCanvasElement>) => void;
  handleMouseUp: (e: MouseEvent<HTMLCanvasElement>) => void;
  handleMouseDown: (e: MouseEvent<HTMLCanvasElement>) => void;
  handleDoubleClick: (e: MouseEvent<HTMLCanvasElement>) => void;
  render: (ctx: CanvasRenderingContext2D) => void;
}

type InteractionEvent = (
  e: MouseEvent<HTMLCanvasElement>,
  onComplete: (shapeProps: ShapeProps) => void
) => void;

export interface Interaction {
  handleMouseMove: InteractionEvent;
  handleMouseUp: InteractionEvent;
  handleMouseDown: (e: MouseEvent<HTMLCanvasElement>) => void;
  handleDoubleClick: InteractionEvent;
}

export type Tool = Rectangle | Ellipse | PolyLine | null;

export type Shape = Rectangle | Ellipse | PolyLine;

export type Point = { x: number; y: number };

export enum LineStyle {
  solid,
  dashed,
}

export type ShapeProps = {
  topLeft: Point;
  height: number;
  width: number;
  color: string;
  stroke: LineStyle;
};
