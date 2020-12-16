'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://me.cofcotrading.com/hana8000"',
  BASE_API: '"http://10.19.5.20:8000"',
  HOST: '"dev"'
  // BASE_API: '"http://10.19.0.56:8793"'
})
