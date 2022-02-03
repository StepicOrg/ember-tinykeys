ember-tinykeys
==============================================================================

[![npm version](https://badge.fury.io/js/ember-tinykeys.svg)](https://badge.fury.io/js/ember-tinykeys)
[![CI](https://github.com/StepicOrg/ember-tinykeys/actions/workflows/ci.yml/badge.svg?branch=master&event=push)](https://github.com/StepicOrg/ember-tinykeys/actions/workflows/ci.yml)

A simple, lightweight and Ember Octane-friendly keybindings for Ember applications.
Powered by [tinykeys](https://github.com/jamiebuilds/tinykeys).


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.20 or above
* Ember CLI v3.20 or above
* Node.js v12 or above
* ember-auto-import v2 or above

Dependencies
-----------------------------------------------------------------------------

* tinykeys ^1.2.0
* ember-modifier ^2.0.0 || ^3.0.0
* ember-auto-import ^2.0.0


Installation
------------------------------------------------------------------------------

```
ember install ember-tinykeys
```


Usage
------------------------------------------------------------------------------

Keys are matched against
[`KeyboardEvent.code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values)
and
[`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
(case-insensitive).

Keys can optionally be prefixed with modifiers which match against any valid value to
[`KeyboardEvent.getModifierState()`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState).

There is also a special `$mod` modifier, which is an alias for `Meta` (⌘) on Mac, and `Control` on Windows/Linux.

Keybindings can also consist of several key presses in a row.
Each press in the sequence must be pressed within `options.timeout` ms of the last (1000ms by default).

See [tinykeys README](https://github.com/jamiebuilds/tinykeys#commonly-used-keys-and-codes) for details.

``` javascript
"d" // Matches `event.key`.
"KeyD" // Matches: `event.code`.

"Control+d"
"Meta+d"
"Shift+D"
"Alt+KeyD"
"Meta+Shift+D"

"$mod+D" // Meta/Control+D
"$mod+Shift+D" // Meta/Control+Shift+D

"g g" // vim-like go to top
"ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight ArrowLeft ArrowRight B A" // fatality
"$mod+K $mod+1"
```

### Modifier

There are `on-shortcut-keydown` and `on-shortcut-keyup` modifiers available.

``` handlebars
{{on-shortcut-keydown "$mod+Enter" handler}}
{{on-shortcut-keydown (array "Control+Enter" "x") handler}}
{{on-shortcut-keydown (hash [Control+Enter]=handlerA x=handlerB)}}

{{on-shortcut-keydown "$mod+Enter" handler element=customHtmlElement}}
{{on-shortcut-keydown "$mod+Enter" handler element=".selector"}}
{{on-shortcut-keydown "$mod+Enter" handler element="window"}}
```


### Functional

``` javascript
import { onShortcutKeyDown, onShortcutKeyUp } from 'ember-tinykeys';
import { registerDestructor } from '@ember/destroyable';

const handler = (event) => { 
  this.doSomeWork();
  event.stopPropagation();
  event.preventDefault();
}

const unsubscribe = onShortcutKeyDown(element, 'Control+x', handler);
const unsubscribe = onShortcutKeyUp(element, 'Control+x', handler);

const unsubscribe = onShortcutKeyDown(window, 'Control+x', handler);
const unsubscribe = onShortcutKeyDown(element, 'Control+x m x y', handler);
const unsubscribe = onShortcutKeyDown(element, ['Alt+x', 'Control+x'], handler);
const unsubscribe = onShortcutKeyDown(element, { 'Alt+x': handlerA, 'Control+x': handlerB });

registerDestructor(this, () => unsubscribe());
```


### Additional utils

- `isEventTargetTextualUserInput`

  You can use this to skip keybindings in textual controls (input, select, textarea, contenteditable).

  ``` javascript
  import { onShortcutKeyDown, isEventTargetTextualUserInput } from 'ember-tinykeys';

  const handler = (event) => {
    if (isEventTargetTextualUserInput(event)) {
      return;
    }

    this.doSomeWork();
    event.stopPropagation();
    event.preventDefault();
  }
  ```


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).


Alternatives
------------------------------------------------------------------------------

- [ember-keyboard](https://github.com/adopted-ember-addons/ember-keyboard)
