'use strict';

var Modal = require('../'),
    events = require('chi-events'),
    document = window.document;

var modal = new Modal(document.querySelector('#example-modal')),
    show = document.querySelector('#show-modal'),
    status = document.querySelector('#status');

events(show).on('click', function() {
    modal.show();
});

modal.on('result', function(result) {
    status.textContent = 'Result: ' + result;
});
