const erc20Abi = [
  {
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address'
      },
      {
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'transfer',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_spender',
        type: 'address'
      },
      {
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'approve',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  }
]

const inflationAbi = [{ inputs: [{ internalType: 'address', name: 'oracleId_', type: 'address' }, { internalType: 'string', name: 'jobId_', type: 'string' }, { internalType: 'uint256', name: 'fee_', type: 'uint256' }], stateMutability: 'nonpayable', type: 'constructor' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'bytes32', name: 'id', type: 'bytes32' }], name: 'ChainlinkCancelled', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'bytes32', name: 'id', type: 'bytes32' }], name: 'ChainlinkFulfilled', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'bytes32', name: 'id', type: 'bytes32' }], name: 'ChainlinkRequested', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'from', type: 'address' }, { indexed: true, internalType: 'address', name: 'to', type: 'address' }], name: 'OwnershipTransferRequested', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'from', type: 'address' }, { indexed: true, internalType: 'address', name: 'to', type: 'address' }], name: 'OwnershipTransferred', type: 'event' }, { inputs: [], name: 'acceptOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'string', name: '_jobId', type: 'string' }], name: 'changeJobId', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: '_oracle', type: 'address' }], name: 'changeOracle', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [], name: 'fee', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'bytes32', name: '_requestId', type: 'bytes32' }, { internalType: 'bytes', name: '_inflation', type: 'bytes' }], name: 'fulfillYoyInflation', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [], name: 'getChainlinkToken', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'jobId', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'oracleId', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'owner', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'requestYoyInflation', outputs: [{ internalType: 'bytes32', name: 'requestId', type: 'bytes32' }], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'to', type: 'address' }], name: 'transferOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [], name: 'withdrawLink', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [], name: 'yoyInflation', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function' }]

const apiAbi = [{ anonymous: false, inputs: [{ indexed: true, internalType: 'bytes32', name: 'id', type: 'bytes32' }], name: 'ChainlinkCancelled', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'bytes32', name: 'id', type: 'bytes32' }], name: 'ChainlinkFulfilled', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'bytes32', name: 'id', type: 'bytes32' }], name: 'ChainlinkRequested', type: 'event' }, { anonymous: false, inputs: [{ indexed: false, internalType: 'uint8', name: 'version', type: 'uint8' }], name: 'Initialized', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' }, { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' }], name: 'OwnershipTransferred', type: 'event' }, { inputs: [], name: '__TfiClient_init', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'uint256', name: '_fee', type: 'uint256' }], name: 'changeFee', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'string', name: '_jobId', type: 'string' }], name: 'changeJobId', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: '_oracle', type: 'address' }], name: 'changeOracle', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: '_address', type: 'address' }], name: 'changeToken', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'string', name: 'service_', type: 'string' }, { internalType: 'string', name: 'data_', type: 'string' }, { internalType: 'string', name: 'keypath_', type: 'string' }, { internalType: 'string', name: 'abi_', type: 'string' }, { internalType: 'string', name: 'multiplier_', type: 'string' }], name: 'doRequest', outputs: [{ internalType: 'bytes32', name: 'requestId', type: 'bytes32' }], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'string', name: 'service_', type: 'string' }, { internalType: 'string', name: 'data_', type: 'string' }, { internalType: 'string', name: 'keypath_', type: 'string' }, { internalType: 'string', name: 'abi_', type: 'string' }, { internalType: 'string', name: 'multiplier_', type: 'string' }, { internalType: 'uint256', name: 'fee_', type: 'uint256' }], name: 'doTransferAndRequest', outputs: [{ internalType: 'bytes32', name: 'requestId', type: 'bytes32' }], stateMutability: 'nonpayable', type: 'function' }, { inputs: [], name: 'fee', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'bytes32', name: '_requestId', type: 'bytes32' }, { internalType: 'bytes', name: 'bytesData', type: 'bytes' }], name: 'fulfillBytes', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [], name: 'getChainlinkToken', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'getToken', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'address', name: 'oracleId_', type: 'address' }, { internalType: 'string', name: 'jobId_', type: 'string' }, { internalType: 'uint256', name: 'fee_', type: 'uint256' }, { internalType: 'address', name: 'token_', type: 'address' }], name: 'initialize', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [], name: 'jobId', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'oracleId', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'owner', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'result', outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }], name: 'results', outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }], name: 'transferOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [], name: 'typeAndVersion', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'pure', type: 'function' }, { inputs: [], name: 'withdrawLink', outputs: [], stateMutability: 'nonpayable', type: 'function' }]

exports.apiAbi = apiAbi
exports.erc20Abi = erc20Abi
exports.inflationAbi = inflationAbi
