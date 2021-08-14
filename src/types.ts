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
  onComplete: (shapeProps: Partial<ShapeProps>) => void
) => void;

export interface Interaction {
  handleMouseMove: InteractionEvent;
  handleMouseUp: InteractionEvent;
  handleMouseDown: InteractionEvent;
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
  vertices: Point[];
  temp: boolean;
  cursorPosition?: Point;
};

export const defaultShapeProps: ShapeProps = {
  color: 'coral',
  stroke: LineStyle.dashed,
  width: 0,
  height: 0,
  topLeft: { x: 0, y: 0 },
  vertices: [],
  temp: false,
  cursorPosition: { x: 0, y: 0 },
};
