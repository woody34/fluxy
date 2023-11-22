import { useSignal } from "@preact/signals";

export const useStore = <T>(uniqName: string, defaultState: () => T) => {
  const state = useSignal<T>(defaultState());

  const handleStateChangeEvent = (event: Event) => {
    const customEvent = event as CustomEvent<T>;
    state.value = customEvent.detail;
  };

  globalThis.window.addEventListener(uniqName, handleStateChangeEvent);

  const setState = (state: T) => {
    const event = new CustomEvent<T>(uniqName, {
      detail: state,
    });

    globalThis.window.dispatchEvent(event);
  };

  const updateState = (partial: Partial<T>) => {
    setState({
      ...state.value,
      ...partial,
    });
  };

  const resetState = () => {
    setState(defaultState());
  };

  return {
    state,
    setState,
    updateState,
    resetState,
  };
};

export default useStore;
