import { useEffect, useRef } from 'react';

function preserveStyles(element, properties) {
  const values = properties.map((property) => [property, element.style.getPropertyValue(property), element.style.getPropertyPriority(property)]);
  return () => values.forEach(([property, value, priority]) => {
    if (value) element.style.setProperty(property, value, priority);
    else element.style.removeProperty(property);
  });
}

function isBackdropEvent(event) {
  if (event.target !== event.currentTarget) return false;
  const bounds = event.currentTarget.getBoundingClientRect();
  return event.clientX < bounds.left || event.clientX >= bounds.right
    || event.clientY < bounds.top || event.clientY >= bounds.bottom;
}

export function EmotionDrawer({ open, onClose, returnFocusRef, children }) {
  const dialogRef = useRef(null);
  const backdropPressRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return undefined;
    backdropPressRef.current = null;

    const root = document.documentElement;
    const body = document.body;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const previousFocus = document.activeElement;
    const restoreRootOverflow = preserveStyles(root, ['overflow-x', 'overflow-y']);
    const restoreScrollBehavior = preserveStyles(root, ['scroll-behavior']);
    const restoreBody = preserveStyles(body, ['position', 'top', 'left', 'width', 'overflow-x', 'overflow-y']);

    if (!dialog.open) dialog.showModal();
    root.style.setProperty('overflow-x', 'hidden');
    root.style.setProperty('overflow-y', 'hidden');
    root.style.setProperty('scroll-behavior', 'auto');
    body.style.setProperty('position', 'fixed');
    body.style.setProperty('top', `${-scrollY}px`);
    body.style.setProperty('left', `${-scrollX}px`);
    body.style.setProperty('width', '100%');
    body.style.setProperty('overflow-x', 'hidden');
    body.style.setProperty('overflow-y', 'hidden');

    return () => {
      backdropPressRef.current = null;
      if (dialog.open) dialog.close();
      restoreBody();
      restoreRootOverflow();
      window.scrollTo(scrollX, scrollY);
      restoreScrollBehavior();
      const focusTarget = returnFocusRef?.current || previousFocus;
      if (focusTarget?.isConnected) focusTarget.focus?.({ preventScroll: true });
    };
  }, [open, returnFocusRef]);

  return (
    <dialog
      ref={dialogRef}
      id="emotion-drawer"
      className="emotion-drawer"
      aria-labelledby="emotion-name"
      onPointerDown={(event) => {
        backdropPressRef.current = event.isPrimary && event.button === 0 && isBackdropEvent(event)
          ? { x: event.clientX, y: event.clientY }
          : null;
      }}
      onPointerMove={(event) => {
        const press = backdropPressRef.current;
        if (press && Math.hypot(event.clientX - press.x, event.clientY - press.y) > 10) {
          backdropPressRef.current = null;
        }
      }}
      onPointerCancel={() => { backdropPressRef.current = null; }}
      onClick={(event) => {
        const press = backdropPressRef.current;
        backdropPressRef.current = null;
        if (press && event.detail > 0 && isBackdropEvent(event)
          && Math.hypot(event.clientX - press.x, event.clientY - press.y) <= 10) {
          onCloseRef.current();
        }
      }}
      onCancel={(event) => { event.preventDefault(); onCloseRef.current(); }}
    >
      <header className="emotion-drawer-header">
        <div className="emotion-drawer-brand">
          <img className="emotion-drawer-logo" src={`${import.meta.env.BASE_URL}brand/department-of-emotions.svg`} alt="" width="21" height="21" />
          <span>Department of Emotions</span>
        </div>
        <button type="button" className="emotion-drawer-close" aria-label="Close emotion details" onClick={() => onCloseRef.current()}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
      </header>
      <div className="emotion-drawer-content">{children}</div>
    </dialog>
  );
}
