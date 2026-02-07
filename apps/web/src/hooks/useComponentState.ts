import { useState, useMemo, useCallback } from 'react';

// Component state types
export interface ComponentStateContext {
  loading: boolean;
  error: Error | null;
  success: boolean;
  disabled: boolean;
  focused: boolean;
  hovered: boolean;
  pressed: boolean;
  draggable: boolean;
  expanded: boolean;
  selected: boolean;
  readonly: boolean;
  required: boolean;
}

export interface ComponentStateActions {
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  setSuccess: (success: boolean) => void;
  setDisabled: (disabled: boolean) => void;
  setFocused: (focused: boolean) => void;
  setHovered: (hovered: boolean) => void;
  setPressed: (pressed: boolean) => void;
  setDraggable: (draggable: boolean) => void;
  setExpanded: (expanded: boolean) => void;
  setSelected: (selected: boolean) => void;
  setReadonly: (readonly: boolean) => void;
  setRequired: (required: boolean) => void;
  reset: () => void;
  toggle: (key: keyof Omit<ComponentStateContext, 'error'>) => void;
}

export interface UseComponentStateOptions {
  initialLoading?: boolean;
  initialError?: Error | null;
  initialSuccess?: boolean;
  initialDisabled?: boolean;
  initialFocused?: boolean;
  initialHovered?: boolean;
  initialPressed?: boolean;
  initialDraggable?: boolean;
  initialExpanded?: boolean;
  initialSelected?: boolean;
  initialReadonly?: boolean;
  initialRequired?: boolean;
  onLoadingChange?: (loading: boolean) => void;
  onErrorChange?: (error: Error | null) => void;
  onSuccessChange?: (success: boolean) => void;
  onStateChange?: (state: Partial<ComponentStateContext>) => void;
}

const defaultInitialState: ComponentStateContext = {
  loading: false,
  error: null,
  success: false,
  disabled: false,
  focused: false,
  hovered: false,
  pressed: false,
  draggable: false,
  expanded: false,
  selected: false,
  readonly: false,
  required: false,
};

export function useComponentState(options: UseComponentStateOptions = {}) {
  const {
    initialLoading = false,
    initialError = null,
    initialSuccess = false,
    initialDisabled = false,
    initialFocused = false,
    initialHovered = false,
    initialPressed = false,
    initialDraggable = false,
    initialExpanded = false,
    initialSelected = false,
    initialReadonly = false,
    initialRequired = false,
    onLoadingChange,
    onErrorChange,
    onSuccessChange,
    onStateChange,
  } = options;

  const [state, setState] = useState<ComponentStateContext>({
    ...defaultInitialState,
    loading: initialLoading,
    error: initialError,
    success: initialSuccess,
    disabled: initialDisabled,
    focused: initialFocused,
    hovered: initialHovered,
    pressed: initialPressed,
    draggable: initialDraggable,
    expanded: initialExpanded,
    selected: initialSelected,
    readonly: initialReadonly,
    required: initialRequired,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(s => ({ ...s, loading }));
    onLoadingChange?.(loading);
  }, [onLoadingChange]);

  const setError = useCallback((error: Error | null) => {
    setState(s => ({ ...s, error, loading: false, success: false }));
    onErrorChange?.(error);
  }, [onErrorChange]);

  const setSuccess = useCallback((success: boolean) => {
    setState(s => ({ ...s, success, loading: false, error: null }));
    onSuccessChange?.(success);
  }, [onSuccessChange]);

  const setDisabled = useCallback((disabled: boolean) => {
    setState(s => ({ ...s, disabled }));
    onStateChange?.({ disabled });
  }, [onStateChange]);

  const setFocused = useCallback((focused: boolean) => {
    setState(s => ({ ...s, focused }));
    onStateChange?.({ focused });
  }, [onStateChange]);

  const setHovered = useCallback((hovered: boolean) => {
    setState(s => ({ ...s, hovered }));
    onStateChange?.({ hovered });
  }, [onStateChange]);

  const setPressed = useCallback((pressed: boolean) => {
    setState(s => ({ ...s, pressed }));
    onStateChange?.({ pressed });
  }, [onStateChange]);

  const setDraggable = useCallback((draggable: boolean) => {
    setState(s => ({ ...s, draggable }));
    onStateChange?.({ draggable });
  }, [onStateChange]);

  const setExpanded = useCallback((expanded: boolean) => {
    setState(s => ({ ...s, expanded }));
    onStateChange?.({ expanded });
  }, [onStateChange]);

  const setSelected = useCallback((selected: boolean) => {
    setState(s => ({ ...s, selected }));
    onStateChange?.({ selected });
  }, [onStateChange]);

  const setReadonly = useCallback((readonly: boolean) => {
    setState(s => ({ ...s, readonly }));
    onStateChange?.({ readonly });
  }, [onStateChange]);

  const setRequired = useCallback((required: boolean) => {
    setState(s => ({ ...s, required }));
    onStateChange?.({ required });
  }, [onStateChange]);

  const reset = useCallback(() => {
    setState({
      ...defaultInitialState,
      loading: initialLoading,
      success: initialSuccess,
      disabled: initialDisabled,
      required: initialRequired,
    });
    onStateChange?.(defaultInitialState);
  }, [initialLoading, initialSuccess, initialDisabled, initialRequired, onStateChange]);

  const toggle = useCallback((key: keyof Omit<ComponentStateContext, 'error'>) => {
    setState(s => ({ ...s, [key]: !s[key] }));
    onStateChange?.({ [key]: !state[key] } as Partial<ComponentStateContext>);
  }, [state, onStateChange]);

  const actions: ComponentStateActions = useMemo(() => ({
    setLoading,
    setError,
    setSuccess,
    setDisabled,
    setFocused,
    setHovered,
    setPressed,
    setDraggable,
    setExpanded,
    setSelected,
    setReadonly,
    setRequired,
    reset,
    toggle,
  }), [
    setLoading,
    setError,
    setSuccess,
    setDisabled,
    setFocused,
    setHovered,
    setPressed,
    setDraggable,
    setExpanded,
    setSelected,
    setReadonly,
    setRequired,
    reset,
    toggle,
  ]);

  return { state, actions };
}

// Async state hook for data fetching
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  status: 'idle' | 'loading' | 'success' | 'error';
}

export function useAsyncState<T>(options: { initialData?: T | null } = {}) {
  const { initialData = null } = options;

  const [asyncState, setAsyncState] = useState<AsyncState<T>>({
    data: initialData,
    loading: false,
    error: null,
    status: 'idle',
  });

  const execute = useCallback(async (promise: Promise<T>) => {
    setAsyncState(s => ({ ...s, loading: true, error: null, status: 'loading' }));

    try {
      const data = await promise;
      setAsyncState({ data, loading: false, error: null, status: 'success' });
      return data;
    } catch (error) {
      setAsyncState(s => ({ ...s, loading: false, error: error as Error, status: 'error' }));
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setAsyncState({ data: initialData, loading: false, error: null, status: 'idle' });
  }, [initialData]);

  return { ...asyncState, execute, reset };
}

// Form state hook
export interface FormState {
  dirty: boolean;
  touched: boolean;
  submitted: boolean;
  validating: boolean;
  isValid: boolean;
  isSubmitting: boolean;
}

export function useFormState(options: { initialValid?: boolean } = {}) {
  const { initialValid = true } = options;

  const [formState, setFormState] = useState<FormState>({
    dirty: false,
    touched: false,
    submitted: false,
    validating: false,
    isValid: initialValid,
    isSubmitting: false,
  });

  const setDirty = useCallback((dirty: boolean) => {
    setFormState(s => ({ ...s, dirty }));
  }, []);

  const setTouched = useCallback((touched: boolean) => {
    setFormState(s => ({ ...s, touched }));
  }, []);

  const setSubmitted = useCallback((submitted: boolean) => {
    setFormState(s => ({ ...s, submitted }));
  }, []);

  const setValidating = useCallback((validating: boolean) => {
    setFormState(s => ({ ...s, validating }));
  }, []);

  const setIsValid = useCallback((isValid: boolean) => {
    setFormState(s => ({ ...s, isValid }));
  }, []);

  const setIsSubmitting = useCallback((isSubmitting: boolean) => {
    setFormState(s => ({ ...s, isSubmitting }));
  }, []);

  const reset = useCallback(() => {
    setFormState({
      dirty: false,
      touched: false,
      submitted: false,
      validating: false,
      isValid: initialValid,
      isSubmitting: false,
    });
  }, [initialValid]);

  return {
    formState,
    setDirty,
    setTouched,
    setSubmitted,
    setValidating,
    setIsValid,
    setIsSubmitting,
    reset,
  };
}
