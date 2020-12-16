'use strict'
let HOST = process.argv[2] || 'prod'
module.exports = {
  NODE_ENV: '"production"',
  BASE_API: HOST === 'prod' ? "'http://me.cofcotrading.com/hana8000'" : "'http://10.19.5.20:8000'",
  HOST: '"' + HOST + '"'
}
