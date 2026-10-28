import { useCallback, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { canonicalAngle, spinLanding } from './wheel-spin.js';

gsap.registerPlugin(useGSAP, Draggable, InertiaPlugin);

const noop = () => {};
const idleControls = { stop: noop, rotateTo: noop, spin: noop };

/** Own the rotor transform; the square rotor keeps its pivot centered at every size. */
export function useWheelMotion({ rotorRef, onDragStart, onTap, initialRotation = 0 }) {
  const restingAngle = canonicalAngle(initialRotation);
  const callbacksRef = useRef({ onDragStart, onTap });
  const controlsRef = useRef(idleControls);
  const [motion, setMotion] = useState({
    isMoving: false,
    isDragging: false,
    reducedMotion: false,
  });

  // Read the latest handlers without rebuilding Draggable during a gesture.
  callbacksRef.current = { onDragStart, onTap };

  useGSAP((context, contextSafe) => {
    const rotor = rotorRef.current;
    if (!rotor) return undefined;

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = preference.matches;
    let active = true;
    let draggable;
    let rotationTween;
    let gestureDragged = false;
    let suppressTap = false;

    const publish = (isMoving, isDragging = false) => {
      if (!active) return;
      setMotion((current) => (
        current.isMoving === isMoving
        && current.isDragging === isDragging
        && current.reducedMotion === reducedMotion
          ? current
          : { isMoving, isDragging, reducedMotion }
      ));
    };

    const killTweens = () => {
      const previous = rotationTween;
      rotationTween = undefined;
      previous?.kill();
      draggable?.tween?.kill();
    };

    const stop = contextSafe(() => {
      if (!active) return;
      suppressTap = true;
      killTweens();
      if (draggable?.isPressed) {
        // Forced release must not start a fresh throw or select a sector.
        const inertia = draggable.vars.inertia;
        draggable.vars.inertia = false;
        draggable.endDrag();
        draggable.vars.inertia = inertia;
      }
      draggable?.update();
      publish(false);
    });

    const finishRotation = () => {
      rotationTween = undefined;
      if (!active) return;
      draggable?.update();
      const isDragging = Boolean(draggable?.isDragging);
      publish(isDragging || Boolean(draggable?.isThrowing), isDragging);
    };

    const rotateTo = contextSafe((angleDegrees) => {
      const requestedAngle = Number(angleDegrees);
      if (!active || !Number.isFinite(requestedAngle)) return;
      stop();
      const rotation = Number(gsap.getProperty(rotor, 'rotation')) || 0;
      const currentAngle = canonicalAngle(rotation);
      const targetAngle = canonicalAngle(requestedAngle);
      const delta = canonicalAngle(targetAngle - currentAngle);
      // Discard accumulated full turns before taking the shortest route.
      gsap.set(rotor, { rotation: currentAngle });
      draggable?.update();
      if (reducedMotion || Math.abs(delta) < 0.01) {
        gsap.set(rotor, { rotation: targetAngle });
        draggable?.update();
        return;
      }
      publish(true);
      rotationTween = gsap.to(rotor, {
        rotation: currentAngle + delta,
        duration: 0.55,
        ease: 'power2.out',
        overwrite: 'auto',
        onComplete: contextSafe(() => {
          if (!active) return;
          gsap.set(rotor, { rotation: targetAngle });
          finishRotation();
        }),
        onInterrupt: finishRotation,
      });
    });

    const spin = contextSafe((angleDegrees, onComplete) => {
      const requestedAngle = Number(angleDegrees);
      if (!active || !Number.isFinite(requestedAngle)) return;
      stop();
      const rotation = Number(gsap.getProperty(rotor, 'rotation')) || 0;
      const { startAngle, targetAngle, endAngle } = spinLanding(rotation, requestedAngle);
      gsap.set(rotor, { rotation: startAngle });
      draggable?.update();
      const complete = contextSafe(() => {
        if (!active) return;
        gsap.set(rotor, { rotation: targetAngle });
        finishRotation();
        if (typeof onComplete === 'function') onComplete();
      });
      if (reducedMotion) {
        complete();
        return;
      }
      publish(true);
      rotationTween = gsap.to(rotor, {
        rotation: endAngle,
        duration: 3,
        ease: 'power3.out',
        overwrite: 'auto',
        onComplete: complete,
        onInterrupt: finishRotation,
      });
    });

    gsap.set(rotor, { transformOrigin: '50% 50%', rotation: restingAngle });
    [draggable] = Draggable.create(rotor, {
      type: 'rotation',
      inertia: !reducedMotion,
      minimumMovement: 4,
      minDuration: 0.12,
      maxDuration: 3,
      throwResistance: 350,
      cursor: 'grab',
      activeCursor: 'grabbing',
      dragClickables: true,
      suppressClickOnDrag: true,
      allowNativeTouchScrolling: false,
      zIndexBoost: false,
      onPressInit: contextSafe(() => {
        if (!active) return;
        gestureDragged = false;
        suppressTap = false;
        killTweens();
        draggable.update();
        publish(false);
      }),
      onDragStart: contextSafe((event) => {
        if (!active) return;
        gestureDragged = true;
        publish(true, true);
        callbacksRef.current.onDragStart?.(event || draggable.pointerEvent);
      }),
      onRelease: contextSafe((event) => {
        if (!active) return;
        if (event?.type?.includes('cancel')) draggable.tween?.kill();
        publish(Boolean(draggable.isThrowing));
      }),
      onThrowComplete: contextSafe(() => {
        publish(false);
      }),
      onClick: contextSafe((event) => {
        if (!active || gestureDragged || suppressTap || event?.type?.includes('cancel')) return;
        callbacksRef.current.onTap?.(event || draggable.pointerEvent);
      }),
    });

    const handlePreferenceChange = contextSafe((event) => {
      if (!active) return;
      reducedMotion = event.matches;
      draggable.vars.inertia = !reducedMotion;
      if (reducedMotion && !draggable.isDragging) stop();
      publish(Boolean(draggable.isDragging || draggable.isThrowing || rotationTween), draggable.isDragging);
    });

    preference.addEventListener('change', handlePreferenceChange);
    controlsRef.current = { stop, rotateTo, spin };
    if (reducedMotion) {
      publish(false);
    } else {
      // Share the opening turn with the gesture controls for immediate takeover.
      gsap.set(rotor, { rotation: restingAngle - 60 });
      draggable.update();
      publish(true);
      rotationTween = gsap.to(rotor, {
        rotation: restingAngle,
        duration: 1.4,
        ease: 'power3.out',
        overwrite: 'auto',
        onComplete: finishRotation,
        onInterrupt: finishRotation,
      });
    }

    return () => {
      active = false;
      controlsRef.current = idleControls;
      preference.removeEventListener('change', handlePreferenceChange);
      killTweens();
      draggable.kill();
    };
  }, { scope: rotorRef, dependencies: [rotorRef, restingAngle], revertOnUpdate: true });

  const stop = useCallback(() => controlsRef.current.stop(), []);
  const rotateTo = useCallback((angleDegrees) => controlsRef.current.rotateTo(angleDegrees), []);
  const spin = useCallback((...args) => controlsRef.current.spin(...args), []);

  return { ...motion, stop, rotateTo, spin };
}
