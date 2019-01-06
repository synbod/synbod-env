import { configure, addDecorator } from '@storybook/polymer';
import { document } from 'global';
import { render } from 'lit-html';

const litDecorator = (story, context, param) => {
  const component = story();
  if (!(component instanceof HTMLElement)) {
    const el = document.createElement('section'); // this element probably can br reused.
    render(component, el);
    return el;
  }

  return story();
};
addDecorator(litDecorator);

const req = require.context('../components', true, /\.stories.js$/);

function loadStories() {
  const contexts = req.keys();
  console.log('context', contexts);
  contexts.forEach((filename) => req(filename));
}

configure(loadStories, module);
