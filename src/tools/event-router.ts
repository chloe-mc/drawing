import { Point, Tool, ToolEvents } from '../types';
import { MouseEvent } from 'react';

class EventRouter implements ToolEvents {
  tool: Tool | null = null;

  setTool = (tool: Tool | null) => {
    this.tool = tool;
  };

  hitTest = (point: Point): boolean => {
    if (!this.tool) return false;
    return this.tool.hitTest(point);
  };

  handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (this.tool) this.tool.handleMouseMove(e);
  };

  handleMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {
    if (this.tool) this.tool.handleMouseUp(e);
  };

  handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    if (this.tool) this.tool.handleMouseDown(e);
  };

  handleDoubleClick = (e: MouseEvent<HTMLCanvasElement>) => {
    if (this.tool) this.tool.handleDoubleClick(e);
  };

  reset = () => {
    if (this.tool) this.tool.reset();
  };
}

export { EventRouter };
