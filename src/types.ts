import { MouseEvent } from 'react';
import { Rectangle, Ellipse, PolyLine, Arrow, Text, Pointer } from './tools';

export const backgroundColor = 'black';
const fontColor = 'white';
export const selectionBoxColor = '#3269a8';
export const selectionBoxPadding = 10;

export interface ToolEvents {
  hitTest: (point: Point) => boolean;
  handleMouseMove: (e: MouseEvent<HTMLCanvasElement>) => void;
  handleMouseUp: (e: MouseEvent<HTMLCanvasElement>) => void;
  handleMouseDown: (e: MouseEvent<HTMLCanvasElement>) => void;
  handleDoubleClick: (e: MouseEvent<HTMLCanvasElement>) => void;
}

export type IShapeTool = ToolEvents & {
  render: (ctx: CanvasRenderingContext2D) => void;
  selected: boolean;
  renderSelectionBox: (ctx: CanvasRenderingContext2D) => void | undefined;
};

type InteractionFn = (
  e: MouseEvent<HTMLCanvasElement>,
  onComplete: (shapeProps: Partial<ShapeProps>) => void
) => void;

export interface Interaction {
  handleMouseMove: InteractionFn;
  handleMouseUp: InteractionFn;
  handleMouseDown: InteractionFn;
  handleDoubleClick: InteractionFn;
}

export type Tool = Rectangle | Ellipse | PolyLine | Arrow | Text | Pointer;

export type Shape = Rectangle | Ellipse | PolyLine | Arrow | Text;

export type Point = { x: number; y: number };

export type BoundingBox = {
  origin: Point;
  width: number;
  height: number;
};

export enum LineStyle {
  solid,
  dashed,
}

type Font = {
  family: string;
  size: number;
  style: string;
  color: string;
};

export type ShapeProps = {
  originPoint: Point;
  height: number;
  width: number;
  color: string;
  stroke: LineStyle;
  vertices: Point[];
  temp: boolean;
  cursorPosition?: Point;
  text: string;
  font: Font;
};

const defaultFont: Font = {
  family: 'Helvetica',
  size: 16,
  style: 'normal',
  color: fontColor,
};

export const defaultShapeProps: ShapeProps = {
  color: 'coral',
  stroke: LineStyle.dashed,
  width: 0,
  height: 0,
  originPoint: { x: 0, y: 0 },
  vertices: [],
  temp: false,
  cursorPosition: { x: 0, y: 0 },
  text: '',
  font: defaultFont,
};
