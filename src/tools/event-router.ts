import { Shape, Tool, ToolEvents } from '../types';
import { MouseEvent } from 'react';

class EventRouter implements ToolEvents {
  tool: Tool = null;

  setTool = (tool: Tool) => {
    this.tool = tool;
  };

  handleMouseMove = (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shape: Shape) => void
  ) => {
    if (this.tool) {
      this.tool.handleMouseMove(e, onComplete);
    }
  };

  handleMouseUp = (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shape: Shape) => void
  ) => {
    if (this.tool) this.tool.handleMouseUp(e, onComplete);
  };

  handleMouseDown = (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shape: Shape) => void
  ) => {
    if (this.tool) this.tool.handleMouseDown(e, onComplete);
  };

  handleDoubleClick = (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shape: Shape) => void
  ) => {
    if (this.tool) this.tool.handleDoubleClick(e, onComplete);
  };

  render = () => {};
  reset = () => null;
}

export { EventRouter };
