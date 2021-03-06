/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * trufflesuite.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

// Initialize HDWalletProvider
const HDWalletProvider = require("truffle-hdwallet-provider");
//const LoomTruffleProvider = require('loom-truffle-provider');

const { readFileSync } = require('fs')
const path = require('path')
const { join } = require('path')


// Set your own mnemonic here
const mnemonic = "YOUR_MNEMONIC";
const mnem_rinkeby = "float token canyon scan minimum first round nature bird apart drill casual";
const mnem_ganache = "bacon win coyote foot drama few reduce subway brain display tooth ketchup";


// Address
const addr_local1   = '0xfb8aeBB3bC342Ee8D9A16C9062d5E942E9B23817'
const addr_local2   = '0x9433f6A41dbb91e909688bCEE876d17a015B4a23'
const addr_rinkeby_mycrypto = '0x7104F1aDf1224611b7c3831BfeEe591e42e48858'
const addr_rinkeby_key      = '0x61e7C70e27ea354BFde680225cce111A1514E3A0'

// infura project_ID
const projId_test = '139a076676e1447094981c79ac0b6acc'

//function getLoomProviderWithPrivateKey (privateKeyPath, chainId, writeUrl, readUrl) {
//  const privateKey = readFileSync(privateKeyPath, 'utf-8');
//  return new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey);
//}

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    // development: {
    //  host: "127.0.0.1",     // Localhost (default: none)
    //  port: 8545,            // Standard Ethereum port (default: none)
    //  network_id: "*",       // Any network (default: none)
    // },
    // Another network with more advanced options...
    // advanced: {
    // port: 8777,             // Custom port
    // network_id: 1342,       // Custom network
    // gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
    // gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
    // from: <address>,        // Account to send txs from (default: accounts[0])
    // websocket: true        // Enable EventEmitter interface for web3 (default: false)
    // },
    // Useful for deploying to a public network.
    // NB: It's important to wrap the provider as a function.
    // ropsten: {
    // provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/YOUR-PROJECT-ID`),
    // network_id: 3,       // Ropsten's id
    // gas: 5500000,        // Ropsten has a lower block limit than mainnet
    // confirmations: 2,    // # of confs to wait between deployments. (default: 0)
    // timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
    // skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    // },
    // Useful for private networks
    // private: {
    // provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
    // network_id: 2111,   // This network is yours, in the cloud.
    // production: true    // Treats this network as if it was a public net. (default: false)
    // }

    // When finish Run truffle migrate --network [network_name]

    // Configuration for localhost, run Ganache first
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777",
      // ----Fixed Local Chain----
      from: addr_local1,
      // ----Quickstart Chain----
      //from: '0x4ea6a379963F9c82adcF46C0Bf6DD02ba2849B06',
      gas: 3000023
    },
    // Configuration for mainnet
    mainnet: {
      provider: function () {
        // Setting the provider with the Infura Rinkeby address and Token
        new HDWalletProvider()
        return new HDWalletProvider(mnemonic, "https://mainnet.infura.io/v3/YOUR_TOKEN")
      },
      network_id: "1"
    },
    // Configuration for rinkeby network
    rinkeby: {
      // Special function to setup the provider
      provider: function () {
        // Setting the provider with the Infura Rinkeby address and Token
        from: addr_rinkeby_mycrypto
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/139a076676e1447094981c79ac0b6acc")
      },
      // Network id is 4 for Rinkeby
      network_id: 4
    },

    // Configuration for loom network
    /*
    loom_testnet: {
      provider: function() {
        const privateKey = 'YOUR_PRIVATE_KEY'
        const chainId = 'extdev-plasma-us1';
        const writeUrl = 'http://extdev-plasma-us1.dappchains.com:80/rpc';
        const readUrl = 'http://extdev-plasma-us1.dappchains.com:80/query';
        return new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey);
      },
      network_id: '9545242630824'
    },

    loom_testnetwss: {
      provider: function() {
        const privateKey = 'YOUR_PRIVATE_KEY';
        const chainId = 'extdev-plasma-us1';
        const writeUrl = 'wss://extdev-basechain-us1.dappchains.com/websocket';
        const readUrl = 'wss://extdev-basechain-us1.dappchains.com/queryws';
        const loomTruffleProvider = new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey);
        loomTruffleProvider.createExtraAccountsFromMnemonic(mnemonic, 10);
        return loomTruffleProvider;
      },
      network_id: 'extdev'
    },

    basechain: {
      provider: function() {
        const chainId = 'default';
        const writeUrl = 'http://basechain.dappchains.com/rpc';
        const readUrl = 'http://basechain.dappchains.com/query';
        return new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey);
        const privateKeyPath = path.join(__dirname, 'mainnet_private_key');
        const loomTruffleProvider = getLoomProviderWithPrivateKey(privateKeyPath, chainId, writeUrl, readUrl);
        return loomTruffleProvider;
        },
      network_id: '*'
    }
    */
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.5"
      // version: "0.5.1",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  },

  // Truffle DB is currently disabled by default; to enable it, change enabled: false to enabled: true
  //
  // Note: if you migrated your contracts prior to enabling this field in your Truffle project and want
  // those previously migrated contracts available in the .db directory, you will need to run the following:
  // $ truffle migrate --reset --compile-all

  db: {
    enabled: false
  }
};
