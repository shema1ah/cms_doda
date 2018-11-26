'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"https://beta.ajimiyou.com/admin"',
  SSO: '"http://localhost:9000"'
})