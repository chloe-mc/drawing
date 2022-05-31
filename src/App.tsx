import React, { useState, useRef, useEffect } from 'react';
import { Button, ToggleButton } from './components';
import { Arrow, Ellipse, Pointer, PolyLine, Rectangle, Text } from './tools';
import * as Automerge from 'automerge';
import { backgroundColor, Point, ShapeProps, Tool } from './types';
import { getColors } from './colors';
import { EventRouter } from './tools/event-router';
import Scene from './components/Scene';

export type Document = Automerge.Doc<{ shapes: ShapeProps[] }>;

const { alert, white } = getColors();

const App = () => {
  const [doc, setDoc] = useState<Document>();
  const [tool, setTool] = useState<Tool | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const eventRouter = useRef(new EventRouter());

  useEffect(() => {
    setDefaultTool();
    setDoc(Automerge.init());
  }, []);

  useEffect(() => {
    eventRouter.current.setTool(tool);
  }, [tool]);

  const omitEmpty = (obj: ShapeProps): Partial<ShapeProps> =>
    Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));

  const saveShape = (shape: ShapeProps, oldDoc: Document) => {
    setDoc(
      Automerge.change(oldDoc, (doc) => {
        if (!doc.shapes) {
          doc.shapes = [];
        }
        doc.shapes.push(omitEmpty(shape) as ShapeProps);
      })
    );
    setDefaultTool();
  };

  const resetCanvas = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setDoc(
      Automerge.change(doc, (doc) => {
        doc.shapes = [];
      })
    );
    setDefaultTool();
  };

  const resetTool = (newTool: Tool) => {
    tool?.cancel();
    setTool(newTool);
  };

  const hitTest = (point: Point): void => {
    // if (shapes.length > 0) {
    //   const shape = shapes.find((shape) => {
    //     return shape.hitTest(point);
    //   });
    //   deselectAllShapes();
    //   if (shape) {
    //     shape.selected = true;
    //   }
    //   renderShapes(shapes);
    // }
  };

  const setDefaultTool = () => {
    if (canvasRef.current) {
      resetTool(new Pointer(canvasRef.current, hitTest));
    }
  };

  return (
    <div id="container" style={{ backgroundColor }}>
      <Scene
        doc={doc as Document}
        eventRouter={eventRouter.current}
        canvasRef={canvasRef}
      />
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ justifyContent: 'flex-start' }}>
          <ToggleButton
            onClick={() => {
              !(tool instanceof Rectangle) && canvasRef.current
                ? resetTool(
                    new Rectangle(
                      canvasRef.current,
                      (shape) => doc && saveShape(shape, doc)
                    )
                  )
                : setDefaultTool();
            }}
            selected={tool instanceof Rectangle}
            style={{ margin: 5 }}
          >
            Rectangle
          </ToggleButton>
          <ToggleButton
            onClick={() => {
              !(tool instanceof Ellipse) && canvasRef.current
                ? resetTool(
                    new Ellipse(
                      canvasRef.current,
                      (shape) => doc && saveShape(shape, doc)
                    )
                  )
                : setDefaultTool();
            }}
            selected={tool instanceof Ellipse}
            style={{ margin: 5 }}
          >
            Ellipse
          </ToggleButton>
          <ToggleButton
            onClick={() => {
              !(tool instanceof PolyLine) && canvasRef.current
                ? resetTool(
                    new PolyLine(
                      canvasRef.current,
                      (shape) => doc && saveShape(shape, doc)
                    )
                  )
                : setDefaultTool();
            }}
            selected={tool instanceof PolyLine}
            style={{ margin: 5 }}
          >
            PolyLine
          </ToggleButton>
          <ToggleButton
            onClick={() => {
              !(tool instanceof Arrow) && canvasRef.current
                ? resetTool(
                    new Arrow(
                      canvasRef.current,
                      (shape) => doc && saveShape(shape, doc)
                    )
                  )
                : setDefaultTool();
            }}
            selected={tool instanceof Arrow}
            style={{ margin: 5 }}
          >
            Arrow
          </ToggleButton>
          <ToggleButton
            onClick={() => {
              !(tool instanceof Text) && canvasRef.current
                ? resetTool(
                    new Text(
                      canvasRef.current,
                      (shape) => doc && saveShape(shape, doc)
                    )
                  )
                : setDefaultTool();
            }}
            selected={tool instanceof Text}
            style={{ margin: 5 }}
          >
            Text
          </ToggleButton>
        </div>
        <Button
          onClick={() => {
            if (canvasRef.current) {
              resetCanvas(canvasRef.current);
            }
          }}
          style={{ margin: 5, backgroundColor: alert, color: white }}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};

export default App;
