var test = require('tape'),
    create = require('chi-create'),
    classes = require('chi-classes'),
    events = require('chi-events'),
    Modal = require('./');

function createStructure() {
    return create('div', { 'class': 'hut-modal' },
        create('div', { 'class': 'modal-dialog' },
            create('header', { 'class': 'modal-header' },
                create('h3', 'Test Modal')
            ),
            create('section', { 'class': 'modal-content' },
                create('p', 'This is a test modal')
            ),
            create('footer', { 'class': 'modal-footer' },
                create('button', { 'data-result': 'test' }, 'Test'),
                create('button', { 'data-result': 'cancel' }, 'Cancel')
            )
        )
    );
}

test('create and destroy a modal', function(t) {
    var el = createStructure(),
        modal = new Modal(el);
    t.equal(el.parentNode, document.body);

    modal.destroy();
    t.equal(el.parentNode, null);

    t.end();
});

test('detach from existing parent when creating', function(t) {
    var parent = document.createElement('div'),
        el = createStructure();
    parent.appendChild(el);

    var modal = new Modal(el);
    t.equal(el.parentNode, document.body);

    modal.destroy();
    t.end();
});

test('show a modal', function(t) {
    var el = createStructure(),
        modal = new Modal(el),
        fired = false;
    modal.on('show', function() { fired = true; });
    modal.show();

    t.ok(fired, 'Fired the show event');
    t.ok(classes(el).has('modal-shown'),
        'Has the modal-shown class');
    t.notOk(classes(el).has('modal-hidden'),
        'Does not have the modal-hidden class');

    modal.destroy();
    t.end();
});

test('hide a modal', function(t) {
    var el = createStructure(),
        modal = new Modal(el),
        fired = false;
    modal.on('hide', function() { fired = true; });
    modal.show();
    modal.hide();

    t.ok(fired, 'Fired the hide event');
    t.ok(classes(el).has('modal-hidden'),
        'Has the modal-hidden class');
    t.notOk(classes(el).has('modal-shown'),
        'Does not have the modal-shown class');

    modal.destroy();
    t.end();
});

test('trigger result when data-result is clicked', function(t) {
    var el = createStructure(),
        modal = new Modal(el),
        result = null;
    modal.on('result', function(r) { result = r; });
    modal.show();

    var cancel = el.querySelector('[data-result="cancel"]');
    events(cancel).trigger('click');

    t.equal(result, 'cancel');

    modal.destroy();
    t.end();
});

test('hide modal when result is clicked', function(t) {
    var el = createStructure(),
        modal = new Modal(el),
        hidden = false;
    modal.on('hide', function() { hidden = true; });
    modal.show();

    var test = el.querySelector('[data-result="test"]');
    events(test).trigger('click');

    t.ok(hidden, 'modal should be hidden');

    modal.destroy();
    t.end();
});