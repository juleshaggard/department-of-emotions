export function isTouchInput(event, coarsePointer = false) {
  const source = event?.nativeEvent || event;
  if (source?.pointerType) return source.pointerType === 'touch' || source.pointerType === 'pen';
  if (source?.changedTouches || source?.touches || source?.type?.startsWith('touch')) return true;
  // Older touch browsers expose family-button clicks as MouseEvents.
  return Boolean(coarsePointer && source?.detail > 0);
}

export function createWheelSelection(activeIndex) {
  return { activeIndex, transientIndex: null, committedIndex: null };
}

export function wheelSelectionReducer(state, action) {
  switch (action.type) {
    case 'preview':
      if (action.touch) return state;
      if (state.activeIndex === action.index && state.transientIndex === action.index && state.committedIndex == null) return state;
      return { activeIndex: action.index, transientIndex: action.index, committedIndex: null };
    case 'select':
      return {
        activeIndex: action.index,
        transientIndex: action.touch || action.family ? null : action.index,
        committedIndex: action.touch ? action.index : null,
      };
    case 'clear-transient':
      return state.transientIndex == null ? state : { ...state, transientIndex: null };
    default:
      return state;
  }
}

export function focusedSelectionIndex(state, { moving = false, enabled = true } = {}) {
  return !enabled || moving ? null : state.transientIndex ?? state.committedIndex;
}
