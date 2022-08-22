import TfiApi from '../index'
import Web3 from 'web3'
import assert from 'assert'

require('dotenv').config()

const provider = process.env.NODE_PROVIDER
const web3Provider = new Web3.providers.HttpProvider(provider)
const web3 = new Web3(web3Provider)
const app = new TfiApi.TfiApi(web3)

describe('My function', function () {
  it('should test', function () {
    assert.equal(1, 1)
  })
  it('hello world',  function() {
    app.doApiRequest({}, undefined)
  })
})
