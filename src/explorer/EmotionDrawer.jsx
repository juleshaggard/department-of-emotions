import { useEffect, useRef } from 'react';

function preserveStyles(element, properties) {
  const values = properties.map((property) => [property, element.style.getPropertyValue(property), element.style.getPropertyPriority(property)]);
  return () => values.forEach(([property, value, priority]) => {
    if (value) element.style.setProperty(property, value, priority);
    else element.style.removeProperty(property);
  });
}

export function EmotionDrawer({ open, onClose, returnFocusRef, children }) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return undefined;

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
      onCancel={(event) => { event.preventDefault(); onCloseRef.current(); }}
    >
      <header className="emotion-drawer-header">
        <button type="button" className="emotion-drawer-close" aria-label="Close emotion details" onClick={() => onCloseRef.current()}>
          <span>Close</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
      </header>
      <div className="emotion-drawer-content">{children}</div>
    </dialog>
  );
}
