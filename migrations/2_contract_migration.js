var GridFactory = artifacts.require("./GridFactory.sol");
var TestCoin = artifacts.require("./TestCoin.sol");

module.exports = function(deployer) {
  //deployer.deploy(GridFactory);
  //deployer.deploy(TestCoin);

  deployer.deploy(GridFactory).then(function() {
    return deployer.deploy(TestCoin, GridFactory.address);
  });
};
