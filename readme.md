Run this commnad to test/deploy
Step
truffle init
truffle compile
truffle test
truffle test --show-events
npm run test:coverage
truffle migrate --network [network_name]

/*
"devDependencies": {
    "@openzeppelin/test-environment": "0.1.0-rc.1",
    "@openzeppelin/test-helpers": "^0.5.5",
    "chai": "^4.2.0",
    "dotenv": "^8.2.0",
    "eslint": "^5.16.0",
    "eslint-config-standard": "^12.0.0",
    "eslint-plugin-import": "^2.20.2",
    "eslint-plugin-mocha-no-only": "^1.1.0",
    "eslint-plugin-node": "^9.2.0",
    "eslint-plugin-promise": "^4.2.1",
    "eslint-plugin-standard": "^4.0.1",
    "ganache-cli": "^6.9.1",
    "mocha": "^6.2.3",
    "solhint": "^2.3.1",
    "truffle": "^5.1.24",
    "truffle-hdwallet-provider": "^1.0.17"
  },
  "dependencies": {
    "@openzeppelin/contracts": "^3.0.1"
  }
  */