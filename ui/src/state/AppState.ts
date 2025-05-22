import { createContext, h, RenderableProps } from "preact";
import { useMemo, useContext } from "preact/hooks";
import { computed, ReadonlySignal, Signal, signal } from "@preact/signals";

export const createAppState = () => {
  const viewZoom = signal(1.0);
  const viewCenterX = signal(0.0);
  const viewCenterY = signal(0.0);
  const viewWidth = computed(() => canvasGlobalWidth.value / viewZoom.value);
  const viewHeight = computed(() => canvasGlobalHeight.value / viewZoom.value);
  const viewLeftEdge = computed(() => viewCenterX.value - viewWidth.value / 2.0);
  const viewTopEdge = computed(() => viewCenterY.value - viewHeight.value / 2.0);

  const canvasGlobalX = signal(0.0);
  const canvasGlobalY = signal(0.0);
  const canvasGlobalWidth = signal(1.0);
  const canvasGlobalHeight = signal(1.0);

  const pagePosToCanvasPos = (pageX: number, pageY: number) => {
    const offsX = (pageX - canvasGlobalX.value) / viewZoom.value;
    const offsY = (pageY - canvasGlobalY.value) / viewZoom.value;
    const docX = viewLeftEdge.value + offsX;
    const docY = viewTopEdge.value + offsY;
    return [docX, docY] as const;
  };

  return {
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

    pagePosToCanvasPos,
  } as const;
};

export type AppState = ReturnType<typeof createAppState>;

export type ReadonlyAppState = {
  [K in keyof AppState]: AppState[K] extends Signal<infer T> ? ReadonlySignal<T> : AppState[K];
};

const appStateContext = createContext<AppState | null>(null);

export const AppStateProvider = (props: RenderableProps<{ value?: AppState }>) => {
  const value = useMemo(() => props.value ?? createAppState(), [props.value]);
  return h(appStateContext.Provider, { value }, props.children);
};

const assertNotNull = <T>(val?: T | null | undefined): T => {
  if (val == null) {
    throw new Error("unexpected null value");
  }
  return val;
};

export const useAppState = (): AppState => {
  return assertNotNull(useContext(appStateContext));
};

export const useReadonlyAppState = (): ReadonlyAppState => {
  return useAppState();
};
