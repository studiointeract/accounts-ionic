Package.describe({
  name: 'std:accounts-semantic',
  version: '1.1.0',
  summary: 'Semantic UI – Accounts UI for React in Meteor 1.3',
  git: 'https://github.com/studiointeract/react-accounts-ui-semantic-ui',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3');
  api.use('ecmascript');
  api.use('underscore');
  api.use('std:accounts-ui@1.1.0');

  api.mainModule('main.jsx');
});
