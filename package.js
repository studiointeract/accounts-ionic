Package.describe({
  name: 'std:accounts-ionic',
  version: '1.0.3',
  summary: 'Ionic – Accounts UI for React in Meteor 1.3',
  git: 'https://github.com/studiointeract/accounts-ionic',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3');
  api.use('ecmascript');
  api.use('underscore');
  api.use('fourseven:scss@3.4.1');
  api.use('std:accounts-ui@1.2.1');
  api.use('softwarerero:accounts-t9n@1.3.3');

  api.addFiles([
    'styles.scss'
  ], 'client');

  api.mainModule('main.jsx');
});
