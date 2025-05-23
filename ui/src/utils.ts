export const createAbortContext = () => {
  const controller = new AbortController();

  const signal = controller.signal;
  const abort = controller.abort.bind(controller);

  return { signal, abort };
};
