var EventEmitter = require('events').EventEmitter,
    classes = require('chi-classes'),
    events = require('chi-events'),
    document = window.document;

function Modal(element) {
    EventEmitter.call(this);

    this.element = element;

    if (element.parentNode) {
        element.parentNode.removeChild(element);
    }

    document.body.appendChild(element);

    var self = this,
        results = element.querySelectorAll('[data-result]');
    events(results).on('click', function(e) {
        e.preventDefault();
        self._result(this.getAttribute('data-result'));
    });
}

Modal.prototype = Object.create(EventEmitter.prototype);
Modal.prototype.constructor = Modal;

Modal.prototype.show = function() {
    classes(this.element)
        .remove('modal-hidden')
        .add('modal-shown');

    var focus = this.element.querySelector('[autofocus]');
    if (focus) {
        focus.focus();
    }

    this.emit('show');
};

Modal.prototype.hide = function() {
    classes(this.element)
        .remove('modal-shown')
        .add('modal-hidden');
    this.emit('hide');
};

Modal.prototype.destroy = function() {
    this.hide();
    document.body.removeChild(this.element);
};

Modal.prototype._result = function(result) {
    this.hide();
    this.emit('result', result);
};

module.exports = Modal;