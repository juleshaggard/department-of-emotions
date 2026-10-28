import test from 'node:test';
import assert from 'node:assert/strict';
import { createWheelSelection, focusedSelectionIndex, isTouchInput, wheelSelectionReducer } from '../src/explorer/wheel-selection.js';

const initial = () => createWheelSelection(0);
const selectTouch = (state, index) => wheelSelectionReducer(state, { type: 'select', index, touch: true });
const clear = (state) => wheelSelectionReducer(state, { type: 'clear-transient' });

test('recognizes pointer and native touch release events without pinning mouse or keyboard clicks', () => {
  assert.equal(isTouchInput({ pointerType: 'touch', type: 'pointerup' }), true);
  assert.equal(isTouchInput({ nativeEvent: { type: 'touchend', changedTouches: [{}] } }), true);
  assert.equal(isTouchInput({ type: 'touchend' }), true);
  assert.equal(isTouchInput({ pointerType: 'pen' }), true);
  assert.equal(isTouchInput({ pointerType: 'mouse', detail: 1 }, true), false);
  assert.equal(isTouchInput({ type: 'click', detail: 1 }, true), true);
  assert.equal(isTouchInput({ type: 'click', detail: 0 }, true), false);
});

test('a touch release remains highlighted through pointer leave, blur, and movement', () => {
  let state = selectTouch(initial(), 12);
  state = clear(state); // Pointer leave after the finger lifts.
  state = clear(state); // Focus moves outside the wheel.
  assert.equal(state.activeIndex, 12);
  assert.equal(focusedSelectionIndex(state), 12);
  state = clear(state); // Dragging clears only the transient preview.
  assert.equal(focusedSelectionIndex(state, { moving: true }), null);
  assert.equal(focusedSelectionIndex(state), 12, 'The selection returns when rotation stops');
  assert.equal(focusedSelectionIndex(state, { enabled: false }), null);
});

test('a new touch selection replaces the previous committed branch', () => {
  const state = clear(selectTouch(selectTouch(initial(), 12), 25));
  assert.equal(state.activeIndex, 25);
  assert.equal(focusedSelectionIndex(state), 25);
});

test('touch hover previews do not change an existing selection or select during a drag', () => {
  const state = selectTouch(initial(), 12);
  const previewed = wheelSelectionReducer(state, { type: 'preview', index: 25, touch: true });
  assert.equal(previewed, state);
});

test('mouse hover replaces the touch branch and restores full opacity on exit', () => {
  let state = wheelSelectionReducer(selectTouch(initial(), 12), { type: 'preview', index: 25 });
  assert.equal(state.activeIndex, 25);
  assert.equal(focusedSelectionIndex(state), 25);
  assert.equal(wheelSelectionReducer(state, { type: 'preview', index: 25 }), state, 'Repeated pointer moves should not rerender the wheel');
  state = clear(state);
  assert.equal(state.activeIndex, 25, 'The readable details remain selected');
  assert.equal(focusedSelectionIndex(state), null);
});

test('keyboard and family choices replace touch selection without retaining a stale branch', () => {
  let state = wheelSelectionReducer(selectTouch(initial(), 12), { type: 'select', index: 25 });
  assert.equal(focusedSelectionIndex(state), 25);
  assert.equal(focusedSelectionIndex(clear(state)), null);
  state = wheelSelectionReducer(selectTouch(initial(), 12), { type: 'select', index: 40, family: true, touch: true });
  assert.equal(state.activeIndex, 40);
  assert.equal(focusedSelectionIndex(clear(state)), 40);
  state = wheelSelectionReducer(state, { type: 'select', index: 0, family: true });
  assert.equal(state.activeIndex, 0);
  assert.equal(focusedSelectionIndex(state), null);
});
