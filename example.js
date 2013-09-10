;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*global console */

var Modal = require('../'),
    events = require('chi-events'),
    document = window.document;

var modal = new Modal(document.querySelector('#example-modal')),
    show = document.querySelector('#show-modal');

events(show).on('click', function() {
    modal.show();
});

modal.on('result', function(result) {
    console.log('Result: ' + result);
});

},{"../":2,"chi-events":4}],2:[function(require,module,exports){
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
},{"chi-classes":3,"chi-events":4,"events":6}],3:[function(require,module,exports){
var CLASS_SEP = /\s+/g;

function iterate(value, action, data) {
    // Check for psuedo-array objects
    if (value && typeof value.length === 'number') {
        for (var i = 0; i < value.length; i++) {
            if (iterate(value[i], action, data) === false) {
                // Break loop on explicit false return
                return false;
            }
        }
    } else {
        return action(value, data);
    }
}

function split(input) {
    if (!input) {
        return [];
    }

    return input.split(CLASS_SEP);
}

function add(node, classes) {
    var existing = split(node.className),
        modified = false;

    for (var i = 0; i < classes.length; i++) {
        var c = classes[i];
        if (existing.indexOf(c) === -1) {
            existing.push(c);
            modified = true;
        }
    }

    if (modified) {
        node.className = existing.join(' ');
    }
}

function remove(node, classes) {
    var existing = split(node.className),
        modified = false;

    for (var i = 0; i < classes.length; i++) {
        var c = classes[i],
            index;

        while ((index = existing.indexOf(c)) !== -1) {
            existing.splice(index, 1);
            modified = true;
        }
    }

    if (modified) {
        node.className = existing.join(' ');
    }
}

function toggle(node, classes) {
    var existing = split(node.className);

    for (var i = 0; i < classes.length; i++) {
        var c = classes[i],
            index = existing.indexOf(c);

        if (index === -1) {
            existing.push(c);
        } else {
            do {
                existing.splice(i, 1);
                index = existing.indexOf(c);
            } while (index !== -1)
        }
    }

    node.className = existing.join(' ');
}

function has(node, classes) {
    var existing = split(node.className);

    for (var i = 0; i < classes.length; i++) {
        if (existing.indexOf(classes[i]) === -1) {
            return false;
        }
    }
}

function ClassList(nodes) {
    this.nodes = nodes;
}

ClassList.prototype.add = function(classes) {
    classes = split(classes);
    iterate(this.nodes, add, classes);

    return this;
};

ClassList.prototype.remove = function(classes) {
    classes = split(classes);
    iterate(this.nodes, remove, classes);

    return this;
};

ClassList.prototype.toggle = function(classes) {
    classes = split(classes);
    iterate(this.nodes, toggle, classes);

    return this;
};

ClassList.prototype.has = function(classes) {
    classes = split(classes);
    return iterate(this.nodes, has, classes) !== false;
};

var slice = Array.prototype.slice;
function classList() {
    var nodes = slice.call(arguments);
    return new ClassList(nodes);
}

module.exports = classList;
},{}],4:[function(require,module,exports){
var flatten = require('flatten-list'),
    document = window.document;

function on(nodes, event, handler) {
    nodes.forEach(function(node) {
        node.addEventListener(event, handler, false);
    });

    return {
        remove: function() { remove(nodes, event, handler); }
    };
}

function remove(nodes, event, handler) {
    nodes.forEach(function(node) {
        node.removeEventListener(event, handler, false);
    });
}

function once(nodes, event, handler) {
    var listener;

    listener = on(nodes, event, function(e) {
        listener.remove();
        handler.call(this, e);
    });

    return listener;
}

function createEvent(event) {
    var e = document.createEvent('Event');
    e.initEvent(event, true, true);
    return e;
}

function trigger(nodes, event) {
    var e = createEvent(event);
    nodes.forEach(function(node) {
        node.dispatchEvent(e);
    });
}

function Events(nodes) {
    this.nodes = nodes;
}

Events.prototype.on = function(event, handler) {
    return on(this.nodes, event, handler);
};

Events.prototype.once = function(event, handler) {
    return once(this.nodes, event, handler);
};

Events.prototype.trigger = function(event, detail) {
    return trigger(this.nodes, event, detail);
};

function events() {
    return new Events(flatten(arguments));
}

module.exports = events;

// Fix bug that occurs in at least IE 9 and 10
// Some newly-created nodes will not fire events until they are added to an
// element. After they are added to an element, they will work even after they
// are removed.
//
// The fix is to create an empty container element. Before triggering an event
// on any element that does not have a parent, add the element to the container
// and immediately remove it.
function checkTriggerBug() {
    var a = document.createElement('div'),
        called = false;

    // Check if click event works on new DOM element
    a.addEventListener('click', function() { called = true; }, false);
    trigger([a], 'click');
    if (called) {
        return false;
    }

    // Check if event works on element after it is added to another
    var b = document.createElement('div');
    b.appendChild(a);
    trigger([a], 'click');

    // If it works now, it has the bug
    return called;
}

function fixTrigger() {
    var container = document.createElement('div');

    function trigger(nodes, event) {
        var e = createEvent(event);
        nodes.forEach(function(node) {
            if (node.parentNode === null) {
                container.appendChild(node);
                container.removeChild(node);
            }

            node.dispatchEvent(e);
        });
    }

    return trigger;
}

if (checkTriggerBug()) {
    trigger = fixTrigger();
}
},{"flatten-list":5}],5:[function(require,module,exports){
function add(array, value) {
    if (typeof value.length === 'number') {
        for (var i = 0; i < value.length; i++) {
            add(array, value[i]);
        }
    } else {
        array.push(value);
    }
}

function flatten(value) {
    var items = [];
    add(items, value);
    return items;
}

module.exports = flatten;
},{}],6:[function(require,module,exports){
var process=require("__browserify_process");if (!process.EventEmitter) process.EventEmitter = function () {};

var EventEmitter = exports.EventEmitter = process.EventEmitter;
var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    }
;
function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (x === xs[i]) return i;
    }
    return -1;
}

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!this._events) this._events = {};
  this._events.maxListeners = n;
};


EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._events.maxListeners !== undefined) {
        m = this._events.maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }

    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = indexOf(list, listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (typeof emitter._events[type] === 'function')
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

},{"__browserify_process":7}],7:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}]},{},[1])
;