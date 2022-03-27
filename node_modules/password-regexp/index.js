/* eslint-disable no-useless-escape */
'use strict'

module.exports = (input) => {
  let exp = '^(?=.*[a-z])'

  // If uppercase set to false, it is possible, but not necessary
  if (!(input && input.uppercase === false)) {
    exp += '(?=.*[A-Z])'
  }

  // If numeric set to false, numbers are possible, but not necessary
  if (!(input && input.numeric === false)) {
    exp += '(?=.*[0-9])'
  }

  // If defined symbols, it is necessary
  if (input && input.symbols) {
    exp += '(?=.[!@#\$%\^&])'
  }

  // Min length of password is 8 by default of defined by input
  let min = 8
  if (input && input.min) {
    min = input.min
  }

  // Max length of password is 32 by default of defined by input
  let max = 32
  if (input && input.max) {
    if (input.max >= min) { // Max should not be more than min
      max = input.max
    } else {
      max = min
    }
  }

  exp += '.{' + min + ',' + max + '}$'

  return new RegExp(exp)
}
