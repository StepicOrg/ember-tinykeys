import { assert } from '@ember/debug';
import { modifier } from 'ember-modifier';

import tinykeys from 'tinykeys';

export function onShortcutKeyDown(element, keyBinding, handler, options = null) {
  return useKeyBinding(element, keyBinding, handler, { ...options, event: 'keydown' });
}

export function onShortcutKeyUp(element, keyBinding, handler, options = null) {
  return useKeyBinding(element, keyBinding, handler, { ...options, event: 'keyup' });
}

export const onShortcutKeyDownModifier = asModifier(onShortcutKeyDown);
export const onShortcutKeyUpModifier = asModifier(onShortcutKeyUp);

function useKeyBinding(element, keyBinding, handler, options) {
  let keyBindingMap;

  assert(
    'element must be an instance of HTMLElement or Window',
    element instanceof Window || element instanceof HTMLElement
  );

  if (typeof keyBinding === 'string') {
    keyBindingMap = { [keyBinding]: handler };
    assert('handler must be a function', typeof handler === 'function');
  } else if (Array.isArray(keyBinding)) {
    keyBindingMap = keyBinding.reduce((acc, x) => ((acc[x] = handler), acc), {});
    assert('handler must be a function', typeof handler === 'function');
  } else if (typeof keyBinding === 'object' && keyBinding !== null) {
    keyBindingMap = { ...keyBinding };
    assert(
      'handler argument must be omitted when you define keyBinding as an Object<keyBinding,handler>',
      handler === undefined
    );
  } else {
    throw new Error('keyBinding is invalid');
  }

  const unsubscribe = tinykeys(element, keyBindingMap, options);
  return unsubscribe;
}

function asModifier(callee) {
  return modifier(function onShortcutModifier(
    element,
    [keyBinding, handler],
    { element: customElement, ...options }
  ) {
    if (typeof customElement === 'string') {
      const selector = customElement;
      customElement = selector === 'window' ? window : document.querySelector(selector);
      if (!customElement) {
        assert(`element "${selector}" does not exist`);
        return undefined;
      }
    }

    return callee(customElement || element, keyBinding, handler, options);
  });
}

export function isEventTargetTextualUserInput(event) {
  const target = event.target;
  const isTextual =
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName));
  return isTextual;
}
