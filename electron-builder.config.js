module.exports = {
  appId: 'test-electron',
  productName: 'test-electron',
  files: [
    'packages/**/build/**',
  ],
  directories: {
    output: 'release',
    buildResources: 'resources',
  },
  copyright: 'Copyright © 2021-present icejs',
};
