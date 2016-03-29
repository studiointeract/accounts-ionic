Package.describe({
  name: 'studiointeract:react-accounts-ui-basic',
  version: '1.0.0',
  summary: 'Basic – Accounts UI for React in Meteor 1.3',
  git: 'https://github.com/author/react-accounts-ui-bootstrap',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3');
  api.use('ecmascript');
  api.use('underscore');
  api.use('fourseven:scss');
  api.use('studiointeract:react-accounts-ui@1.0.2');

  api.imply('session');

  api.addFiles([
    'styles.scss'
  ], 'client');

  api.mainModule('main.jsx');
});
