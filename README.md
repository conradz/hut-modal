# hut-modal

[![NPM](https://nodei.co/npm/hut-modal.png?compact=true)](https://nodei.co/npm/hut-modal/)

[![Build Status](https://drone.io/github.com/conradz/hut-modal/status.png)](https://drone.io/github.com/conradz/hut-modal/latest)
[![Dependency Status](https://gemnasium.com/conradz/hut-modal.png)](https://gemnasium.com/conradz/hut-modal)

HTML UI Toolkit modal component - Show modals in your app with JS.

Check out the [example](http://conradz.github.io/hut-base/)!

## Example

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
```

## Reference

### `new Modal(element)`

Creates a new Modal object that manages the modal specified by `element`. The
element must have a similar structure as the example above.

### `#show()`

Shows the modal. Note that the element must be already attached to the document
for it to be shown.

### `#hide()`

Hides the modal.

### Event: `show()`

Triggered immediately after the modal is shown.

### Event: `hide()`

Triggered immediately after the modal is hidden.

### Event: `result(value)`

Triggered when an element with the `data-result` attribute is clicked. The modal
will be automatically hidden and `value` will be the value of the `data-result`
attribute of the element that was clicked.

## Styling

Set the variables that are defined in `variables.css` file to change the
styling. You can also override the styles in your own stylesheet.