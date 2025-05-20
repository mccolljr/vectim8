import "./style/main.scss";

import { render } from "preact";
import { useCallback, useMemo } from "preact/hooks";
import { useComputed, useSignal, useSignalEffect } from "@preact/signals";

import { ToolDefinition, ToolRack } from "./components/ToolRack";

const Main = () => {
  const rootElem = useSignal<SVGSVGElement | null>(null);
  const adoptRootElem = useCallback((elem: SVGSVGElement | null) => {
    rootElem.value = elem;
  }, []);

  const tools = useMemo<ToolDefinition[]>(
    () => [
      { name: "Eraser", icon: "eraser" },
      { name: "Free-Hand", icon: "pencil" },
      { name: "Polygon", icon: "pentagon" },
    ],
    [],
  );

  const viewZoom = useSignal(1.0);
  const viewWidth = useSignal(1.0);
  const viewHeight = useSignal(1.0);
  const viewOffsetX = useSignal(0.0);
  const viewOffsetY = useSignal(0.0);
  const viewBox = useComputed(() => {
    const width = viewWidth.value / viewZoom.value;
    const height = viewHeight.value / viewZoom.value;
    const posX = viewOffsetX.value - width / 2.0;
    const posY = viewOffsetY.value - height / 2.0;

    return `${posX} ${posY} ${width} ${height}`;
  });

  useSignalEffect(() => {
    const el = rootElem.value;
    if (!el) return;

    const observer = new ResizeObserver(([rootEntry]) => {
      viewWidth.value = rootEntry.contentRect.width;
      viewHeight.value = rootEntry.contentRect.height;
    });
    observer.observe(el);

    const onWheel = (evt: WheelEvent) => {
      const direction = Math.sign(evt.deltaY);
      if (direction < 0) {
        if (viewZoom.value > 1) {
          viewZoom.value -= 1;
        } else {
          viewZoom.value /= 2;
        }
      } else {
        if (viewZoom.value < 1) {
          viewZoom.value *= 2;
        } else {
          viewZoom.value += 1;
        }
      }
    };
    el.addEventListener("wheel", onWheel);

    let isDragging = false;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const onMouseUp = (_evt: MouseEvent) => {
      isDragging = false;
    };
    el.addEventListener("mouseup", onMouseUp);

    const onMouseDown = (evt: MouseEvent) => {
      if (evt.button != 1) return;

      isDragging = true;
      currentMouseX = evt.clientX;
      currentMouseY = evt.clientY;
    };
    el.addEventListener("mousedown", onMouseDown);

    const onMouseMove = (evt: MouseEvent) => {
      if (isDragging) {
        const deltaX = (evt.clientX - currentMouseX) / viewZoom.value;
        const deltaY = (evt.clientY - currentMouseY) / viewZoom.value;
        viewOffsetX.value -= deltaX;
        viewOffsetY.value -= deltaY;
      }

      currentMouseX = evt.clientX;
      currentMouseY = evt.clientY;
    };
    el.addEventListener("mousemove", onMouseMove);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mousemove", onMouseMove);

      observer.disconnect();
    };
  });

  return (
    <>
      <svg ref={adoptRootElem} viewBox={viewBox} width={viewWidth} height={viewHeight} class="workspace">
        <circle cx="0px" cy="0px" r="100px" fill="red" />
      </svg>
      <div style="position: absolute; left: 10; top: 10">
        {viewZoom}
        <ToolRack tools={tools} />
      </div>
    </>
  );
};

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("vectim8");

  render(<Main />, document.body);
});
