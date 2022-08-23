/* global config,web3:writable,cbor,apiAbi,erc20Abi */
const abi = require('./abi')
const config = require('./config')
const apiAbi = abi.apiAbi
const erc20Abi = abi.erc20Abi

function hexStringToByteArray (hexString) {
  if (hexString.length % 2 !== 0) {
    throw new Error('Must have an even number of hex digits to convert to bytes')
  }
  let numBytes = hexString.length / 2
  let start = 0
  if (hexString.substr(0, 2) === '0x') {
    start = 1
    numBytes = numBytes - 1
  }
  const byteArray = new Uint8Array(numBytes)
  for (let i = start; i < numBytes + start; i++) {
    byteArray[i - start] = parseInt(hexString.substr(i * 2, 2), 16)
  }
  return byteArray
}

function decode (data, web3, abi, multiplier) {
  if (abi === '' || abi === undefined) {
    abi = 'json'
  }
  let retval
  if (abi === 'cbor') {
    console.log('cbor', data)
    const byteArray = hexStringToByteArray(data)
    retval = cbor.decodeFirstSync(byteArray)
  } else if (abi === 'json') {
    console.log(data)
    const byteArray = hexStringToByteArray(data)
    const string = new TextDecoder().decode(byteArray)
    console.log(string)
    retval = JSON.parse(string)
  } else {
    retval = web3.eth.abi.decodeParameter(abi, data)
  }
  if (multiplier !== '' && multiplier !== undefined) {
    if (Array.isArray(retval)) {
      retval = retval.map((x) => x / parseInt(multiplier))
    } else {
      retval = retval / parseInt(multiplier)
    }
  }
  return retval
}

async function outputResult (request, r, output) {
  if (request.abi === 'ipfs' ||
      request.abi === 'ipfs/cbor' ||
      request.abi === 'ipfs/json') {
    const b = hexStringToByteArray(r)
    const s = new TextDecoder().decode(b)
    output.output.innerHTML =
      `<a href="http://ipfs.io/ipfs/${s}">${s}</a>`
    output.status.innerHTML = ''
    return
  }
  const obj = decode(r, web3, request.abi, request.multiplier)
  output.output.innerHTML =
    JSON.stringify(obj)
  output.status.innerHTML = ''
}

class TfiApi {
  constructor (web3, account) {
    this.web3 = web3
    this.account = account
  }

  setStatus(status) {
    console.log(status)
  }

  setOutput(output) {
    console.log(output)
  }

  async doApiRequest (request) { // eslint-disable-line no-unused-vars
    const web3 = this.web3
    if (request === undefined) {
      throw Error('no request')
    }
    if (!web3.utils.isAddress(request.address)) {
      throw Error('address not valid')
    }
    this.setStatus('Running ...')
    const api = new web3.eth.Contract(
      apiAbi, request.address)
    const linkToken = await api.methods.getChainlinkToken().call()
    const tokenContract = new web3.eth.Contract(
      erc20Abi, linkToken
    )
    const requestTxn = api.methods.doRequest(
      request.service ? request.service : '',
      request.data ? request.data : '',
      request.keypath ? request.keypath : '',
      request.abi ? request.abi : '',
      request.multiplier ? request.multiplier : ''
    )
    
    const fee = await api.methods.fee().call()
    if (parseInt(fee) !== 0) {
      this.setStatus('Transferring LINK...')
      const transfer = tokenContract.methods.transfer(
        request.address, fee
      )
      await transfer.send({
        from: this.account,
        to: request.address
      })
    }
    this.setStatus('Sending request ...')
    const txn = await requestTxn.send({
      from: this.account,
      to: request.address
    })
    const id = txn.events.ChainlinkRequested.returnValues.id
    console.log(id)
    this.setStatus('Waiting for response for request id: ' + id)
    const chainid = Number(await web3.eth.getChainId())
    console.log(chainid)
    const poll = config[chainid]?.poll
    console.log(config)
    console.log(poll)
    if (poll !== undefined && poll !== 0) {
      let r
      const makeCall = async () => {
        r = await api.methods.results(id).call()
        if (r !== null) {
          console.log('found result', r)
          outputResult(request, r, output)
          return
        }
        console.log('no result - polling')
        setTimeout(makeCall, poll)
      }
      setTimeout(makeCall, poll)
    } else {
      api.events.ChainlinkFulfilled(
        {
          filter: { id }
        },
        (error, event) => { console.log('foo', error, event) })
        .on('data', async (event) => {
          const r = await api.methods.results(id).call()
          outputResult(request, r, output)
        })
    }
  }
}

module.exports.TfiApi = TfiApi
