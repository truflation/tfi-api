const abi = require('./abi')
const apiAbi = abi.apiAbi
const erc20Abi = abi.erc20Abi
const cbor = require('cbor-web')
const wait = function (ms = 1000) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

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
    const byteArray = hexStringToByteArray(data)
    retval = cbor.decodeFirstSync(byteArray)
  } else if (abi === 'json') {
    const byteArray = hexStringToByteArray(data)
    const string = new TextDecoder().decode(byteArray)
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

class TfiApi {
  constructor (account, poll = 1000, debug = true) {
    this.account = account
    this.poll = poll
    this.debug = debug
  }

  setStatus (status) {
    console.log(status)
  }

  setDebug (output) {
    if (this.debug) {
      console.log(output)
    }
  }

  outputResult (web3, request, r) {
    if (request.abi === 'ipfs' ||
        request.abi === 'ipfs/cbor' ||
        request.abi === 'ipfs/json') {
      const b = hexStringToByteArray(r)
      const s = new TextDecoder().decode(b)
      return `ipfs:${s}`
    }
    const obj = decode(r, web3, request.abi, request.multiplier)
    console.log(obj)
    return JSON.stringify(obj)
  }

  async doApiTransferAndRequest (web3, request) { // eslint-disable-line no-unused-vars
    if (request === undefined) {
      throw Error('no request')
    }
    if (!web3.utils.isAddress(request.address)) {
      throw Error('address not valid')
    }
    this.setStatus('Running ...')
    const api = new web3.eth.Contract(
      apiAbi, request.address)
    const linkToken = await api.methods.getToken().call()
    const tokenContract = new web3.eth.Contract(
      erc20Abi, linkToken
    )

    const requestTxn = api.methods.doTransferAndRequest(
      request.service ? request.service : '',
      request.data ? request.data : '',
      request.keypath ? request.keypath : '',
      request.abi ? request.abi : '',
      request.multiplier ? request.multiplier : '',
      request.fee ? request.fee : '0'
    )

    if (parseInt(request.fee) !== '0') {
      this.setStatus('Approve tokens...')
      const approve = tokenContract.methods.approve(
        request.address, request.fee
      )
      await approve.send({
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
    this.setStatus(`Waiting for response for request id: ${id}`)
    const poll = this.poll
    let makeCall
    if (poll !== undefined && poll !== 0) {
      this.setDebug('starting polling.....')
      makeCall = async () => {
        let r = await api.methods.results(id).call()
        while (r === null) {
          this.setDebug('polling....')
          await wait(poll)
          r = await api.methods.results(id).call()
        }
        this.setDebug(r)
        this.setStatus('')
        return r
      }
    } else {
      makeCall = async () => {
        return new Promise((resolve, reject) => {
          api.events.ChainlinkFulfilled(
            {
              filter: { id }
            },
            (error, events) => {
              console.log('fired', error, events)
            }
          ).once('data', async (event) => {
            const r = await api.methods.results(id).call()
            this.setDebug(r)
            this.setStatus('')
            resolve(r)
          })
        })
      }
    }
    return this.outputResult(web3, request, await makeCall())
  }

  async doApiRequest (web3, request) { // eslint-disable-line no-unused-vars
    if (request === undefined) {
      throw Error('no request')
    }
    if (!web3.utils.isAddress(request.address)) {
      throw Error('address not valid')
    }
    this.setStatus('Running ...')
    const api = new web3.eth.Contract(
      apiAbi, request.address)
    const linkToken = await api.methods.getToken().call()
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
    this.setStatus('Waiting for response for request id: ' + id)
    const poll = this.poll
    let makeCall
    if (poll !== undefined && poll !== 0) {
      makeCall = async () => {
        let r = await api.methods.results(id).call()
        while (r === null) {
          await wait(poll)
          r = await api.methods.results(id).call()
        }
        return r
      }
    } else {
      makeCall = async () => {
        return new Promise((resolve, reject) => {
          api.events.ChainlinkFulfilled(
            {
              filter: { id }
            },
            (error, events) => {
              console.log('fired', error, events)
            }
          ).once('data', async (event) => {
            const r = await api.methods.results(id).call()
            resolve(r)
          })
        })
      }
    }
    return this.outputResult(web3, request, await makeCall())
  }
}

module.exports.TfiApi = TfiApi
