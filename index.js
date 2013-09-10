var EventEmitter = require('events').EventEmitter,
    classes = require('chi-classes'),
    events = require('chi-events'),
    document = window.document;

function Modal(element) {
    EventEmitter.call(this);

    this.element = element;

    var self = this,
        results = element.querySelectorAll('[data-result]');
    events(results).on('click', function(e) {
        e.preventDefault();
        self._clicked(this);
    });

    this.on('result', function() {
        this.hide();
    });
}

Modal.prototype = Object.create(EventEmitter.prototype);
Modal.prototype.constructor = Modal;

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

module.exports = Modal;