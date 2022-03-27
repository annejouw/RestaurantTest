const passwordRegexp = require('../index.js')
const expect = require('chai').expect

describe('passwordRegexp', function () {
  it('Should be a regExp', function () {
    return expect(passwordRegexp() instanceof RegExp).to.be.true
  })

  it(`Should return a default expression: \n
    \t- from 8 to 32 signs,\n
    \t- at least 1 uppercase letter, \n
    \t- 1 lowercase letter and 1 number`, function () {
    const passwords = [
      'gg',
      '11',
      '222222222',
      'fgjhgjkkjhg87698',
      'GHHGHGFDJDDJHGFJHG6',
      'FGgh677',
      'FGgh677uiytrewsdfghjklmnbvcxzsdff',
      '!@#$%^&t',
      'ПрыведП%56',
      'Space symbol is not restricted'
    ]
    for (let i = 0; i <= passwords.length; i++) {
      return expect(passwordRegexp().test(passwords[i])).to.be.false
    }
  })

  it('Max and min password length should depend on function arguments', function () {
    const testMinMax = (min, max, passwords, check) => {
      for (let i = 0; i < passwords.length; i++) {
        expect(passwordRegexp({
          min,
          max
        }).test(passwords[i])).to.equal(check)
      }
    }

    // Testing right passwords to be true
    const rightPasswords = [
      'Fb6',
      '6ghGh'
    ]
    testMinMax(3, 5, rightPasswords, true)

    // Now testing wrong passwords to be false
    const wrongPasswords = [
      'Fb',
      '6ghGhc44'
    ]
    testMinMax(3, 5, wrongPasswords, false)
  })

  it('Test possibility to disable numeric settings', function () {
    const passwords = [
      'FghhjhhgG',
      '012345Gy', // numbers are not necessary now, but also not restricted
      'GhTyghghgGHG'
    ]

    for (let i = 0; i < passwords.length; i++) {
      return expect(passwordRegexp({
        numeric: false
      }).test(passwords[i])).to.be.true
    }
  })

  it('Test possibility to disable uppercase settings', function () {
    const passwords = [
      'ghhghg67',
      'gygh5GHG',
      'GFEC5Hhh'
    ]

    for (let i = 0; i < passwords.length; i++) {
      return expect(passwordRegexp({
        uppercase: false
      }).test(passwords[i])).to.be.true
    }
  })

  it('Test adding special symbols: ! @ # $ % ^ &', function () {
    const testSymbols = function (passwords, symbols, check) {
      for (let i = 0; i < passwords.length; i++) {
        expect(passwordRegexp({
          symbols
        }).test(passwords[i])).to.equal(check)
      }
    }

    const rightPasswords = [
      'f%45Hghk',
      'f%45Hghk56DDD',
      'f@#45Hghk',
      'f%#!$%^&45Hghk',
      '$#2%^fgFFFG'
    ]

    testSymbols(rightPasswords, true, true)

    const wrongPasswords = [
      'ghTY56fff',
      'HyujgFGfg6712129'
    ]

    testSymbols(wrongPasswords, true, false)

    // Symbols are not restricted by default

    testSymbols(rightPasswords, false, true)
  })
})
