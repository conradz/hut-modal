'use strict';

var Emitter = require('emitter-component'),
    classes = require('chi-classes'),
    events = require('chi-events'),
    inheritPrototype = require('mout/lang/inheritPrototype'),
    document = window.document;

module.exports = function(element) {
    return new Modal(element);
};

function Modal(element) {
    Emitter.call(this);

    this.element = element;

    var self = this;
    events(element)
        .children('[data-result]')
        .on('click', function(e) {
            e.preventDefault();
            self._clicked(this);
        });

    this.on('result', function() {
        this.hide();
    });
}

inheritPrototype(Modal, Emitter);

Modal.prototype.show = function() {
    classes(this.element).add('modal-shown');
    classes(document.body).add('hut-modal-open');

    var focus = this.element.querySelector('[autofocus]');
    if (focus) {
        focus.focus();
    }

    this.emit('show');
};

Modal.prototype.hide = function() {
    classes(this.element).remove('modal-shown');
    classes(document.body).remove('hut-modal-open');

    this.emit('hide');
};

Modal.prototype._clicked = function(button) {
    var result = button.getAttribute('data-result');
    this.emit('result', result);
};
