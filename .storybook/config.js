import { configure, addDecorator } from '@storybook/polymer';
import addons, { makeDecorator } from '@storybook/addons';
import { document } from 'global';

const litDecorator = makeDecorator({
  name: 'lit',
  parameterName: 'exports',
  skipIfNoParametersOrOptions: true,
  wrapper: (getStory, context, { parameters }) => {
    const component = getStory();
    if (!(component instanceof HTMLElement)) {
      const { render } = parameters;
      const el = document.createElement('section'); // this element probably can br reused.
      render(component, el);
      return el;
    }

    return getStory(context);
  },
});
addDecorator(litDecorator);

const req = require.context('../components', true, /storybook_stories\/.*.js$/);

function loadStories() {
  const contexts = req.keys();
  contexts.forEach((filename) => req(filename));
}

configure(loadStories, module);
