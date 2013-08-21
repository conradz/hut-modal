# hut-modal

HTML UI Toolkit modal component - Show modals in your app with JS.


## Example

<a href="http://conradz.github.io/hut-modal">View the live example</a>

With the following HTML:

```html
<div id="my-modal" class="hut-modal">
    <div class="modal-dialog">
        <header class="modal-header">
            <h3>My Modal</h3>
        </header>
        <section class="modal-content">
            <p>See my modal?</p>
        </section>
        <footer class="modal-footer">
            <button data-result="yes">Yes</button>
            <button data-result="no">No</button>
        </footer>
    </div>
</div>
```

Show the modal with the following JS:

```js
var Modal = require('hut-modal');

var myModal = new Modal(document.querySelector('#my-modal'));

// When a [data-result] element is clicked, it will hide the modal and trigger
// the result event:
myModal.on('result', function(result) {
    if (result === "yes") {
        console.log('Hey that was cool!');
    } else if (result === "no") {
        console.log('Wait, what?');
    }
});

myModal.show();

// Automatically close after 5 seconds:
setTimeout(function() {
    myModal.hide();
}, 5000);
```


## JS Reference

### `new Modal(element)`

Creates a new Modal object that manages the modal specified by `element`. The
element must have a similar structure as the example above. The element will be
removed from the parent if it is attached to another DOM node, and will be
attached to the root of the DOM.

### `#show()`

Shows the modal. See styling reference for details.

### `#hide()`

Hides the modal. See styling reference for details.

### `#destroy()`

Removes all traces of the modal from the DOM. It will hide the modal first if it
is open. Ensure that a modal is destroyed when it will not be needed again.

### Event: `show()`

Triggered immediately after the modal is shown.

### Event: `hide()`

Triggered immediately after the modal is hidden.

### Event: `result(value)`

Triggered when an element with the `data-result` attribute is clicked. The modal
will be automatically hidden and `value` will be the value of the `data-result`
attribute of the element that was clicked.


## Style Reference

The base CSS style only defines basic layout and formatting of the modal. You
should define your own style for the modal when using it. Import the base style
by using [npm-css](https://github.com/shtylman/npm-css) and add
`@import "hut-modal"` to your stylesheet. Use the elements defined below to add
your own styling.

### `.hut-modal`

The base modal container. This element can be styled to be used as a background,
etc.

### `.hut-modal.modal-shown`

The `.modal-shown` class is added to the `.hut-modal` element when the modal is
currently open.

### `.hut-modal.modal-hidden`

The `modal-hidden` class is added to the `.hut-modal` element after the modal is
hidden.

## `.modal-dialog`

The modal dialog container. This includes the header, content and footer of the
modal.

## `.modal-header`

The modal header element. This should contain the title of the modal.

## `.modal-content`

The modal content element. This should contain the main content of the modal.

## `.modal-footer`

The modal footer element. This should contain any action buttons or links for
the modal.