import { configure } from '@storybook/polymer';

const req = require.context('../components', true, /\.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
