import TfiApi from 'tfi-api'
import Web3 from 'web3'
import assert from 'assert'
import HDWalletProvider from '@truffle/hdwallet-provider'
import * as dotenv from 'dotenv'
dotenv.config()

function getWeb3 (config): Web3 {
  const provider = new HDWalletProvider({
    privateKeys: [process.env.PRIVATE_KEY],
    providerOrUrl: config.provider
  })
  return new Web3(provider)
}

const account = process.env.WALLET_ADDRESS

interface ChainInfo {
  apiAddress: string
  chainName: string
  fee: string
}

export function testChain (config: ChainInfo): void {
  describe('My function', function () {
    let app, web3, address
    before(() => {
      app = new TfiApi.TfiApi(account)
      web3 = getWeb3(config)
      address = config.apiAddress
    })

    it('test assert', function () {
      assert.equal(1, 1)
    })

    /*    it(`hello world ${config.chainName}`, async () => {
      app.doApiRequest(web3, {
        address
      })
    }).timeout(200000) */

    it(`echo ${config.chainName}`, async () => {
      const r = await app.doApiRequest(web3, {
        service: 'echo',
        data: '1024',
        address
      })
      assert.equal(r, 1024)
    }).timeout(200000)
  })
}

export function testInflation (config: ChainInfo): void {
  describe('My function', function () {
    let app, web3, address
    before(() => {
      app = new TfiApi.TfiApi(account)
      web3 = getWeb3(config)
      address = config.apiAddress
    })
    it(`echo ${config.chainName}`, async () => {
      const r = await app.doApiRequest(web3, {
        service: 'truflation/current',
        keypath: 'yearOverYearInflation',
        address
      })
      const inflation = parseFloat(r)
      assert.equal(
        inflation >= -10.0 &&
        inflation < 50.0, true)
    }).timeout(200000)
  })
}

export function testTransferAndRequest (config: ChainInfo): void {
  describe('Echo transfer call', function () {
    let app, web3, address, fee
    before(() => {
      app = new TfiApi.TfiApi(account)
      web3 = getWeb3(config)
      address = config.apiAddress
      fee = config.fee
    })

    it(`echo ${config.chainName}`, async () => {
      const r = await app.doApiTransferAndRequest(web3, {
        service: 'echo',
        data: '1024',
        address,
        fee
      })
      assert.equal(r, 1024)
    }).timeout(200000)

    it(`echo/python ${config.chainName}`, async () => {
      const r = await app.doApiTransferAndRequest(web3, {
        service: 'echo/python',
        data: '1024',
        address,
        fee
      })
      assert.equal(r, 1024)
    }).timeout(200000)

    it(`ipfs ${config.chainName}`, async () => {
      const r = await app.doApiTransferAndRequest(web3, {
        service: 'echo',
        data: '1024',
        abi: 'ipfs',
        address,
        fee
      })
      assert.equal(r, 'ipfs:Qmbu2cd3sEGFxSmRXT8wmhsAc1mrAsX4xy9arnkQcQYkso')
    }).timeout(200000)

    it(`inflation ${config.chainName}`, async () => {
      const r = await app.doApiTransferAndRequest(web3, {
        service: 'truflation/current',
        keypath: 'yearOverYearInflation',
        address,
        fee
      })
      const inflation = parseFloat(r)
      assert.equal(
        inflation >= -10.0 &&
        inflation < 50.0, true)
    }).timeout(200000)

    it(`uint ${config.chainName}`, async () => {
      const r = await app.doApiTransferAndRequest(web3, {
        service: 'truflation/at-date',
        keypath: 'yearOverYearInflation',
        data: '{"location": "us", "date": "2022-10-01"}',
        abi: 'int256',
        multiplier: '1000000000000000000',
        address,
        fee
      })
      const inflation = parseFloat(r)
      assert.equal(
        inflation >= -10.0 &&
        inflation < 50.0, true)
    }).timeout(200000)

    it(`no string ${config.chainName}`, async () => {
      const r = await app.doApiTransferAndRequest(web3, {
        service: 'truflation/at-date',
        keypath: 'yearOverYearInflation',
        data: { location: 'us', date: '2022-10-01' },
        abi: 'int256',
        multiplier: '1000000000000000000',
        address,
        fee
      })
      const inflation = parseFloat(r)
      assert.equal(
        inflation >= -10.0 &&
        inflation < 50.0, true)
    }).timeout(200000)
  })
}

export function testCategories (config: ChainInfo): void {
  describe('Echo transfer call', function () {
    let app, web3, address, fee
    before(() => {
      app = new TfiApi.TfiApi(account)
      web3 = getWeb3(config)
      address = config.apiAddress
      fee = config.fee
    })

    it(`categories ${config.chainName}`, async () => {
      const r = await app.doApiTransferAndRequest(web3, {
        service: 'truflation/at-date',
        data: '{"location": "us", "date": "2022-10-01", "categories": "true"}',
        abi: 'ipfs',
        address,
        fee
      })
      console.log(r)
    }).timeout(200000)
    it(`categories/keypath ${config.chainName}`, async () => {
      const r = await app.doApiTransferAndRequest(web3, {
        service: 'truflation/at-date',
        data: { date: '2022-01-01', categories: 'true' },
        keypath: 'categories.Personal Care products and services.yearOverYearInflation',
        abi: 'int256',
        multiplier: '1000000000000000000',
        address,
        fee
      })
      console.log(r)
    }).timeout(200000)
  })
}
