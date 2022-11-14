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

export function testCommodities (config: ChainInfo): void {
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
        service: 'truflation/data',
	data: '{"id":"8001010"}',
	keypath: 'value',
        address,
	fee
      })
      const result = parseFloat(JSON.parse(r))
      assert.equal(result >= 500.0 && result <= 5000.0, true)
    }).timeout(200000)
  })
}
