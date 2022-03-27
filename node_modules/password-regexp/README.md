# Password-RegExp

A simple function that generates the RegExp expression for passwords validation.

### Installation

```
npm install password-regexp
```

### Usage

```js
const passwordRegexp = require("password-regexp")();

passwordRegexp.test("abc123"); // returns false

passwordRegexp.test("Strong12"); // returns true
```

:warning:
Please, don't forget to use parentheses after the "require" statement!

### Options

By default, it generates a RegExp, that check a string value that match:

- at least, 1 numeric character
- at least, 1 uppercase letter
- at least, 1 lowercase letter
- min 8, max 32 symbols.

These conditions are customizable by function atrributes:

```js
const passwordRegexp = require("password-regexp");

const customRegexp = passwordRegexp({
  min: 12,
  max: 18,
  numeric: false,
  uppercase: false,
  symbols: true, // an option for symbols: ! @ # $ % ^ &
});
```
