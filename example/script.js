var Modal = require('../'),
    events = require('chi-events');

var modal = new Modal(document.querySelector('#example-modal')),
    show = document.querySelector('#show-modal');

events(show).on('click', function() {
    modal.show();
});

modal.on('result', function(result) {
    console.log('Result: ' + result);
});
