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

export function testUtils (config: ChainInfo): void {
  describe('My function', function () {
    let app, web3, address, fee
    before(() => {
      app = new TfiApi.TfiApi(account)
      web3 = getWeb3(config)
      address = config.apiAddress
      fee = config.fee
    })
    it(`math ${config.chainName}`, async () => {
      const r = await app.doApiTransferAndRequest(web3, {
        service: 'util/math/nerdamer',
	data: '{"expr": "2+2"}',
        address,
	fee
      })
      const result = parseFloat(JSON.parse(r))
      assert.equal(result, 4.0)
    }).timeout(200000)

    it(`url ${config.chainName}`, async () => {
      const r = await app.doApiTransferAndRequest(web3, {
        service: 'util/http',
	data: '{"url": "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/2020-11-24/currencies/eur.json"}',
	keypath: 'eur.aed',
        address,
	fee
      })
      const result = parseFloat(r)
      console.log(result)
      assert.equal(result, 4.349942)
    }).timeout(200000)
  })
}
