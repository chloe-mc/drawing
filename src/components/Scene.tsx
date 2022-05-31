import React, { MouseEvent } from 'react';
import { Document } from '../App';
import { Rectangle, Ellipse, Arrow, PolyLine, Text } from '../tools';
import { EventRouter } from '../tools/event-router';
import { backgroundColor, ShapeProps, ShapeType } from '../types';

type Props = {
  doc: Document;
  eventRouter: EventRouter;
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
};

const createHiDPICanvas = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number
) => {
  const ratio = window.devicePixelRatio;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  const context = canvas.getContext('2d');
  context?.setTransform(ratio, 0, 0, ratio, 0, 0);
};

const shapeTypeToRenderFn = new Map<
  ShapeType,
  [
    (ctx: CanvasRenderingContext2D, shape: ShapeProps) => void,
    (ctx: CanvasRenderingContext2D, shape: ShapeProps) => void
  ]
>([
  [
    ShapeType.Rectangle,
    [Rectangle.renderProps, Rectangle.renderSelectionBoxProps],
  ],
  [ShapeType.Ellipse, [Ellipse.renderProps, Ellipse.renderSelectionBoxProps]],
  [ShapeType.Arrow, [Arrow.renderProps, Arrow.renderSelectionBoxProps]],
  [ShapeType.Text, [Text.renderProps, Text.renderSelectionBoxProps]],
  [
    ShapeType.Polyline,
    [PolyLine.renderProps, PolyLine.renderSelectionBoxProps],
  ],
]);

const Scene: React.FC<Props> = ({ doc, eventRouter, canvasRef }) => {
  const clearCanvas = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const renderShapes = (shapes?: ShapeProps[]) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (canvasRef.current && ctx) {
      clearCanvas(canvasRef.current);
      shapes?.forEach((shape) => {
        const renderers = shapeTypeToRenderFn.get(shape.type);
        if (renderers) {
          const [render, renderSelectionBox] = renderers;
          render(ctx, shape);
          if (shape.selected) {
            renderSelectionBox(ctx, shape);
          }
        }
      });
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!eventRouter.tool) return;

    eventRouter.handleMouseDown(e);
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!eventRouter.tool) return;

    eventRouter.handleMouseMove(e);
  };

  const handleMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!eventRouter.tool) return;

    eventRouter.handleMouseUp(e);
  };

  const handleDoubleClick = (e: MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!eventRouter.tool) return;

    eventRouter.handleDoubleClick(e);
  };

  const resizeCanvas = () => {
    if (canvasRef.current) {
      createHiDPICanvas(
        canvasRef.current,
        window.innerWidth,
        window.innerHeight * 0.9
      );
    }
    renderShapes(doc?.shapes);
  };

  React.useEffect(() => {
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  React.useEffect(() => {
    if (doc && doc.shapes?.length > 0) {
      renderShapes(doc?.shapes);
    }
  }, [doc?.shapes]);

  return (
    <canvas
      ref={canvasRef}
      style={{ backgroundColor }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    />
  );
};

export default Scene;
