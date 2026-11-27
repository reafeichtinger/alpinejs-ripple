export default function (Alpine) {
  Alpine.directive('ripple', (el, { modifiers }, { cleanup }) => {
    function parseRippleModifiers(modifiers) {
      const keys = new Set(['duration', 'radius', 'color', 'timing', 'opacity']);
      const options = {};
      let useBefore = false;

      for (let i = 0; i < modifiers.length; i++) {
        if (modifiers[i] === 'before') {
          useBefore = true;
          continue;
        }
        if (keys.has(modifiers[i]) && i + 1 < modifiers.length) {
          options[modifiers[i]] = modifiers[i + 1];
          i++;
        }
      }

      return { options, useBefore };
    }

    el.classList.add('ripple');
    const { options, useBefore } = parseRippleModifiers(modifiers);

    el.classList.add(useBefore ? 'ripple-before' : 'ripple-after');

    if (options.duration) {
      el.style.setProperty('--ripple-duration', options.duration.replace(/_/g, '.'));
    }
    if (options.radius) {
      el.style.setProperty('--ripple-radius', options.radius.replace(/_/g, '.'));
    }
    if (options.color) {
      const value = options.color.startsWith('--')
        ? `var(${options.color})`
        : options.color;
      el.style.setProperty('--ripple-color', value);
    }
    if (options.timing) {
      el.style.setProperty('--ripple-timing', options.timing);
    }
    if (options.opacity) {
      el.style.setProperty('--ripple-opacity', options.opacity.replace(/_/g, '.'));
    }

    let onPointerDown, onClick, onAnimationEnd;

    function doRipple(x, y) {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--ripple-x', `${x === null ? rect.width / 2 : x - rect.left}px`);
      el.style.setProperty('--ripple-y', `${y === null ? rect.height / 2 : y - rect.top}px`);
      el.style.setProperty('--ripple-d', `${Math.hypot(rect.width, rect.height) * 2}px`);

      el.classList.remove('ripple--active');
      void el.offsetWidth;
      el.classList.add('ripple--active');
    }

    onPointerDown = (e) => {
      if (e.button === 0) doRipple(e.clientX, e.clientY);
    };

    onClick = (e) => {
      if (e.detail === 0) doRipple(null, null);
    };

    onAnimationEnd = () => {
      el.classList.remove('ripple--active');
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('click', onClick);
    el.addEventListener('animationend', onAnimationEnd);

    cleanup(() => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('click', onClick);
      el.removeEventListener('animationend', onAnimationEnd);
      el.classList.remove('ripple--active');
      el.classList.remove('ripple');
      el.classList.remove('ripple-before');
      el.classList.remove('ripple-after');
    });
  });
}
