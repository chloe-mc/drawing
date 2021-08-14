import {
  ToolEvents,
  Shape,
  LineStyle,
  defaultShapeProps,
  ShapeProps,
  Point,
} from '../types';
import { MouseEvent } from 'react';
import { DrawLineInteraction } from '../interactions';

class Arrow implements ToolEvents {
  props: ShapeProps = defaultShapeProps;

  interaction = new DrawLineInteraction({
    lineOnly: true,
  });

  constructor(
    private canvas: HTMLCanvasElement,
    private saveShape: (shape: Shape) => void,
    private saveTempShape: (shape: Shape) => void,
    private resetTool: (tool: Arrow) => void
  ) {}

  private setProps = (props: Partial<ShapeProps>) => {
    if (props.vertices) {
      props.vertices = [...this.props.vertices, ...props.vertices];
    }
    this.props = { ...this.props, ...props };
  };

  private save = (newProps?: Partial<ShapeProps>): void => {
    newProps && this.setProps(newProps);
    this.saveShape(this);
    this.reset();
  };

  reset = () => {
    this.resetTool(
      new Arrow(this.canvas, this.saveShape, this.saveTempShape, this.resetTool)
    );
  };

  handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    this.interaction.handleMouseMove(e, (line) => {
      this.setProps(line);
      this.saveTempShape(this);
    });
  };

  handleMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {
    this.interaction.handleMouseUp(e, (line) => {
      this.setProps(line);
      line.temp ? this.saveTempShape(this) : this.save();
    });
  };

  handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    this.interaction.handleMouseDown(e, (line) => {
      this.setProps(line);
    });
  };

  handleDoubleClick = (e: MouseEvent<HTMLCanvasElement>) => {
    this.interaction.handleDoubleClick(e, (line) => {
      if (this.props.vertices.length > 1) {
        this.save(line);
      }
    });
  };

  private drawArrow(
    ctx: CanvasRenderingContext2D,
    tip: Point,
    previousPoint: Point
  ) {
    // TODO: fix me, http://dbp-consulting.com/tutorials/canvas/CanvasArrow.html
    var headlen = 10;
    const tox = tip.x;
    const toy = tip.y;
    const fromx = previousPoint.x;
    const fromy = previousPoint.y;
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    ctx.moveTo(tox, toy);
    ctx.lineTo(
      tox - headlen * Math.cos(angle - Math.PI / 6),
      toy - headlen * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(tox, toy);
    ctx.lineTo(
      tox - headlen * Math.cos(angle + Math.PI / 6),
      toy - headlen * Math.sin(angle + Math.PI / 6)
    );
  }

  render = (ctx: CanvasRenderingContext2D) => {
    const { stroke, color, vertices, cursorPosition } = this.props;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(vertices[0].x, vertices[0].y);
    vertices.map((vertex) => {
      ctx.lineTo(vertex.x, vertex.y);
    });
    if (cursorPosition) {
      ctx.lineTo(cursorPosition.x, cursorPosition.y);
      this.drawArrow(ctx, cursorPosition, vertices[vertices.length - 1]);
    } else {
      this.drawArrow(
        ctx,
        vertices[vertices.length - 1],
        vertices[vertices.length - 2]
      );
    }
    ctx.strokeStyle = color;
    if (stroke === LineStyle.dashed) {
      ctx.setLineDash([2, 5]);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  };
}

export { Arrow };
