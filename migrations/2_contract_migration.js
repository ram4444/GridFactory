var GridFactory = artifacts.require("./GridFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(GridFactory);
  //deployer.deploy(TestCrossCall);

};
