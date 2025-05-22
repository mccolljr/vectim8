import { batch, useComputed, useSignal, useSignalEffect } from "@preact/signals";
import { useCallback } from "preact/hooks";

import { useAppState } from "../state/AppState";

export const App = () => {
  const {
    viewZoom,
    viewCenterX,
    viewCenterY,
    viewWidth,
    viewHeight,
    viewLeftEdge,
    viewTopEdge,
    canvasGlobalX,
    canvasGlobalY,
    canvasGlobalWidth,
    canvasGlobalHeight,
  } = useAppState();

  const viewBox = useComputed(() => {
    return `${viewLeftEdge.value} ${viewTopEdge.value} ${viewWidth.value} ${viewHeight.value}`;
  });

  const workspaceElem = useSignal<HTMLElement | null>(null);
  const setWorkspaceElem = (el: HTMLElement | null) => (workspaceElem.value = el);

  const selection = useSignal<SVGElement | null>(null);
  useSignalEffect(() => {
    const value = selection.value;
    value?.classList.add("selected");
    return () => value?.classList.remove("selected");
  });

  useSignalEffect(() => {
    if (!workspaceElem.value) return;
    const el = workspaceElem.value;

    const controller = new AbortController();

    const observer = new ResizeObserver(([{ target }]) =>
      batch(() => {
        const rect = target.getBoundingClientRect();
        canvasGlobalX.value = rect.x + window.scrollX;
        canvasGlobalY.value = rect.y + window.scrollY;
        canvasGlobalWidth.value = rect.width;
        canvasGlobalHeight.value = rect.height;

        console.log(canvasGlobalX.value, canvasGlobalY.value, canvasGlobalWidth.value, canvasGlobalHeight.value);
      }),
    );
    observer.observe(el);
    controller.signal.addEventListener("abort", () => observer.disconnect());

    el.addEventListener(
      "wheel",
      (evt: WheelEvent) => {
        if (Math.sign(evt.deltaY) > 0) {
          // zoom in
          if (viewZoom.value < 1) {
            viewZoom.value *= 2;
          } else {
            viewZoom.value = Math.min(viewZoom.value + 1, 8);
          }
        } else {
          // zoom out
          if (viewZoom.value > 1) {
            viewZoom.value -= 1;
          } else {
            viewZoom.value = Math.max(viewZoom.value / 2, 0.125 / 2);
          }
        }
      },
      { signal: controller.signal, capture: false },
    );

    let isDragging = false;
    let dragX = 0;
    let dragY = 0;

    el.addEventListener("contextmenu", (evt) => {
      evt.preventDefault();
      const d = document.createElement("div");
      d.innerText = "TEST!";
      d.style.padding = "10px";
      d.style.backgroundColor = "white";
      document.body.appendChild(d);
    });

    el.addEventListener(
      "mousedown",
      (evt) => {
        console.log("mousedown:", evt.eventPhase);
        if (evt.button == 1) {
          isDragging = true;
          dragX = evt.pageX;
          dragY = evt.pageY;
        }
      },
      { signal: controller.signal, capture: false },
    );

    window.addEventListener(
      "mouseup",
      (evt) => {
        console.log("mouseup:", evt.eventPhase);

        if (evt.defaultPrevented) {
          console.log("mouseup was default-prevented");
        }
        if (evt.button == 1) {
          isDragging = false;
        }
        selection.value = null;
      },
      { signal: controller.signal, capture: false },
    );

    window.addEventListener(
      "mousemove",
      (evt) => {
        if (isDragging) {
          var deltaX = evt.pageX - dragX;
          var deltaY = evt.pageY - dragY;
          batch(() => {
            viewCenterX.value -= deltaX / viewZoom.value;
            viewCenterY.value -= deltaY / viewZoom.value;
          });
          dragX = evt.pageX;
          dragY = evt.pageY;
        }
      },
      { signal: controller.signal, capture: true, passive: true },
    );
    controller.signal.addEventListener("abort", () => (isDragging = false));

    return () => controller.abort();
  });

  const handleClick = useCallback((evt: MouseEvent) => {
    evt.preventDefault();
    evt.stopImmediatePropagation();
    console.log("handleClick:", evt.eventPhase);
    selection.value = evt.target as SVGElement;
  }, []);

  return (
    <div class="app-root">
      <div class="app-header">
        <button class="btn btn-light">Tst</button>
      </div>
      <div class="app-workspace" ref={setWorkspaceElem}>
        <div class="debuginfo">
          <div>
            z={viewZoom} @ ({viewCenterX}, {viewCenterY})
          </div>
          <div>
            top left = ({canvasGlobalX}, {canvasGlobalY})<br />
            size = ({canvasGlobalWidth},{canvasGlobalHeight})
          </div>
        </div>
        <svg width={canvasGlobalWidth} height={canvasGlobalHeight} viewBox={viewBox}>
          <circle cx="0" cy="0" r="100" fill="red" onMouseUp={handleClick} />
        </svg>
      </div>
      <div class="app-footer"></div>
    </div>
  );
};
