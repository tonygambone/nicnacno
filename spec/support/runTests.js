
// test runner so we don't need `npm install -g jasmine`

const Jasmine = require('jasmine');
const jasmine = new Jasmine();

jasmine.loadConfigFile('spec/support/jasmine.json');

jasmine.onComplete(function(passed) {
    process.exit(!passed);
});

jasmine.execute();

