import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, typeIn, triggerKeyEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Modifier | on-shortcut-keydown', function (hooks) {
  setupRenderingTest(hooks);

  test('on input', async function (assert) {
    this.set('handler', () => assert.step('1'));
    await render(hbs`
      {{!-- template-lint-disable require-input-label --}}
      <input {{on-shortcut-keydown "Control+Enter" this.handler}}>
    `);

    await typeIn('input', 'hello world');
    await triggerKeyEvent('input', 'keydown', 'X');
    await triggerKeyEvent('input', 'keydown', 'Enter');
    await triggerKeyEvent('input', 'keydown', 'Enter', { ctrlKey: true });
    await typeIn('input', 'hello world');

    assert.verifySteps(['1']);
  });

  test('on parent of input', async function (assert) {
    this.set('handler', () => assert.step('1'));
    await render(hbs`
      {{!-- template-lint-disable require-input-label --}}
      <div {{on-shortcut-keydown "Control+Enter" this.handler}}><input></div>
    `);
    await triggerKeyEvent('input', 'keydown', 'Enter', { ctrlKey: true });
    assert.verifySteps(['1']);
  });

  test('does not handle on adjacent element', async function (assert) {
    this.set('handler', () => assert.step('1'));
    await render(hbs`
      {{!-- template-lint-disable require-input-label --}}
      <foo /><input {{on-shortcut-keydown "Control+Enter" this.handler}}>
    `);
    await triggerKeyEvent('foo', 'keydown', 'Enter', { ctrlKey: true });
    assert.verifySteps([]);
  });

  test('on window', async function (assert) {
    this.set('handler', () => assert.step('1'));
    await render(hbs`
      {{!-- template-lint-disable require-input-label --}}
      <foo /><input {{on-shortcut-keydown "Control+Enter" this.handler element="window"}}>
    `);
    await triggerKeyEvent('foo', 'keydown', 'Enter', { ctrlKey: true });
    await triggerKeyEvent('input', 'keydown', 'Enter', { ctrlKey: true });
    assert.verifySteps(['1', '1']);
  });

  test('on custom element (selector)', async function (assert) {
    this.set('handler', () => assert.step('1'));
    await render(hbs`
      {{!-- template-lint-disable require-input-label --}}
      <foo /><input {{on-shortcut-keydown "Control+Enter" this.handler element="foo"}}>
    `);

    await triggerKeyEvent('input', 'keydown', 'Enter', { ctrlKey: true });
    assert.verifySteps([]);

    await triggerKeyEvent('foo', 'keydown', 'Enter', { ctrlKey: true });
    assert.verifySteps(['1']);
  });

  test('passing array of shortcuts', async function (assert) {
    this.set('handler', () => assert.step('1'));
    await render(hbs`
      {{!-- template-lint-disable require-input-label --}}
      <input {{on-shortcut-keydown (array "Control+Enter" "x") this.handler}}>
    `);

    await typeIn('input', 'hello world');
    await triggerKeyEvent('input', 'keydown', 'X');
    await triggerKeyEvent('input', 'keydown', 'Enter');
    await triggerKeyEvent('input', 'keydown', 'Enter', { ctrlKey: true });
    await typeIn('input', 'hello world');

    assert.verifySteps(['1', '1']);
  });

  test('passing hash of shortcuts', async function (assert) {
    this.set('handler', () => assert.step('1'));
    await render(hbs`
      {{!-- template-lint-disable require-input-label --}}
      <input {{on-shortcut-keydown (hash [Control+Enter]=this.handler x=this.handler)}}>
    `);

    await typeIn('input', 'hello world');
    await triggerKeyEvent('input', 'keydown', 'X');
    await triggerKeyEvent('input', 'keydown', 'Enter');
    await triggerKeyEvent('input', 'keydown', 'Enter', { ctrlKey: true });
    await typeIn('input', 'hello world');

    assert.verifySteps(['1', '1']);
  });
});
