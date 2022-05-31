import { Point, ToolEvents } from '../types';
import { MouseEvent } from 'react';

export class Pointer implements ToolEvents {
  constructor(
    private canvas: HTMLCanvasElement,
    private hitTestAllShapes: (point: Point) => void
  ) {}

  cancel = () => {};

  hitTest = (point: Point): boolean => {
    this.hitTestAllShapes(point);
    return true;
  };

  handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    this.hitTest({ x: e.clientX, y: e.clientY });
  };

  handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {};

  handleMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {};

  handleDoubleClick = (e: MouseEvent<HTMLCanvasElement>) => {};
}
