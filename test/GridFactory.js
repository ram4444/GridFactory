const GridFactory = artifacts.require("GridFactory");

//npm install chai
//Import Library
const chai = require('chai');
const BN = require('bn.js');
const expect = require('chai').expect; 

//Web3
/*
const web3 = require('web3');
var web3provider;

if (typeof web3 !== 'undefined') {
    web3provider = new web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3provider = new web3(new web3.providers.HttpProvider("http://localhost:8545"));
}
*/

// Enable and inject BN dependency
chai.use(require('chai-bn')(BN));

//Import js
const utils = require("./helpers/utils");
const catchRevert = require("./helpers/utils").catchRevert;
const time = require("./helpers/time");


const tableNames = ["table1", "table2"];
const columnNames = ["column1", "column2"];

//Run 
//truffle test
//to show the test result
contract("GridFactory", (accounts) => {
    let [alice, bob] = accounts;

    let contractInstance;
    
    //run automatically for every test
    beforeEach(async () => {
        contractInstance = await GridFactory.new();
    });

    //Test Functions
    /* 
    it("should be able to create a new zombie", async () => {
        //Output is stored in result
        const result = await contractInstance.functionName(para, {from: <msg.sender>});
        //result.tx
        //result.receipt
        
        const zombieId = result.logs[0].args.zombieId.toNumber();

        //Chai validation
        expect(result.logs[0].args.name).to.equal("something");
        something.should.be.a("string");
        // https://www.chaijs.com/guide/

        //By assert
        assert.typeOf(lessonTitle, "string");



        // Force Time to elapse
        await time.increase(time.duration.days(1));
    })
    //Add x to skip
    xcontext("with the single-step transfer scenario", async () => {
    
    })
        */
    it("should be able to create a table", async () => {
        const result = await contractInstance._createTable(tableNames[0], alice, {from: alice});
        expect(result.receipt.status).to.equal(true);
        expect(result.logs[0].args._name).to.equal(tableNames[0]);
    })
    it("should not allow to 2 tables with same name for a owner", async () => {
        const result = await contractInstance._createTable(tableNames[0], alice, {from: alice});
        expect(result.receipt.status).to.equal(true);
        expect(result.logs[0].args._name).to.equal(tableNames[0]);
        //const result2 = contractInstance._createTable(tableNames[0], alice, {from: alice});
        //console.log(result2.logs[0].args);
        await utils.shouldThrow(contractInstance._createTable(tableNames[0], alice, {from: alice}));
    })
    xit("should be able to create a table and get the owner", async () => {
        const result = await contractInstance._createTable(tableNames[0], alice, {from: alice});
        expect(result.receipt.status).to.equal(true);
        expect(result.logs[0].args._name).to.equal(tableNames[0]);
        const rtnTableId = result.logs[0].args._tableId.toNumber();
        const result2 = await contractInstance._getTableOwnerbyId(rtnTableId, {from: alice});
        expect(result2.logs[0].args._address).to.equal(alice);
    })
    xit("allows directly assigned a number", async () => {
        const result = await contractInstance._testEmitUint(
            79749051, {from: alice});

            expect(result.receipt.status).to.equal(true);
            expect(result.logs[0].args._testValue.toNumber()).to.equal(79749051);
    })
    /*
    it("allows assigned a String", async () => {
        const result = await contractInstance._testEmitUint(
            "79749051", {from: alice});

            expect(result.receipt.status).to.equal(true);
            expect(result.logs[0].args._testValueto.Number()).to.equal(79749051);
    })
    */
    it("allows assigned a new BN", async () => {
        const result = await contractInstance._testEmitUint(
            new BN("79749051".toString()), {from: alice});

            expect(result.receipt.status).to.equal(true);
            expect(result.logs[0].args._testValue.toNumber()).to.equal(79749051);
    })


    it("should create a table, a column and assign the column to the table", async () => {
        // Create a table
        const result = await contractInstance._createTable(tableNames[0], alice, {from: alice});
        expect(result.receipt.status).to.equal(true);
        expect(result.logs[0].args._name).to.equal(tableNames[0]);
        // Create a column and assign to table
        const rtnBNObject = result.logs[0].args._tableId;
        const rtnTableIdStr = result.logs[0].args._tableId.toString();
        const rtnTableIdNum = result.logs[0].args._tableId.toNumber();
        const rtnTableIdNumBN = new BN(rtnBNObject)

        console.log("------------------debug output------------------");
        console.log("_tableId is BN: "+web3.utils.isBN(result.logs[0].args._tableId));
        console.log("_tableId as Object: "+rtnBNObject);
        console.log("_tableId as String: "+rtnTableIdStr);
        console.log("_tableId toNumber: "+rtnTableIdNum);
        console.log("_tableId toNumber.BN: "+rtnTableIdNumBN);
        console.log("----------------//debug output------------------");

        const result2 = await contractInstance._createColumn(
            //columnNames[0], 0, 0, new BN(rtnBNObject), {from: alice});
            columnNames[0], 0, 0, rtnTableIdNum, {from: alice});
        console.log("------------------debug output2------------------");
        console.log(web3.utils.isBN(result2.logs[0].args._colId));
        console.log("-----");
        console.log(result2.logs[0].args._tableId.toString());
        console.log(result2.logs[0].args._tableName);
        console.log(result2.logs[0].args._colName);
        console.log(result2.logs[0].args._colId.toString());
        console.log("----------------//debug output2------------------");
        expect(result2.logs[0].args._tableId.toNumber()).to.equal(result.logs[0].args._tableId.toNumber()
        );
    })
    it("should create a table with 2 columns, and the first column is not altered", async () => {
        // Create a table
        const result = await contractInstance._createTable(tableNames[0], alice, {from: alice});
        expect(result.receipt.status).to.equal(true);
        expect(result.logs[0].args._name).to.equal(tableNames[0]);
        // Create a column and assign to table
        const rtnBNObject = result.logs[0].args._tableId;
        const rtnTableIdStr = result.logs[0].args._tableId.toString();
        const rtnTableIdNum = result.logs[0].args._tableId.toNumber();
        const rtnTableIdNumBN = new BN(rtnBNObject)

        // Column1
        const result1 = await contractInstance._createColumn(
            //columnNames[0], 0, 0, new BN(rtnBNObject), {from: alice});
            columnNames[0], 0, 0, rtnTableIdNum, {from: alice});
        console.log("------------------debug output1------------------");
        console.log(web3.utils.isBN(result1.logs[0].args._colId));
        console.log("-----");
        console.log(result1.logs[0].args._tableId.toString());
        console.log(result1.logs[0].args._tableName);
        console.log(result1.logs[0].args._colName);
        console.log(result1.logs[0].args._colId.toString());
        console.log("----------------//debug output1------------------");
        
        // Column2
        const result2 = await contractInstance._createColumn(
            //columnNames[0], 0, 0, new BN(rtnBNObject), {from: alice});
            columnNames[1], 0, 0, rtnTableIdNum, {from: alice});
        console.log("------------------debug output2------------------");
        console.log(web3.utils.isBN(result2.logs[0].args._colId));
        console.log("-----");
        console.log(result2.logs[0].args._tableId.toString());
        console.log(result2.logs[0].args._tableName);
        console.log(result2.logs[0].args._colName);
        console.log(result2.logs[0].args._colId.toString());
        console.log("----------------//debug output2------------------");

        console.log("-------------------------------------------------");
        //expect(result2.logs[0].args._tableId.toNumber()).to.equal(result.logs[0].args._tableId.toNumber());
        //expect(result2.logs[0].args._colName).to.equal(columnNames[0]);
        
        //Check the created columns name
        const result3 = await contractInstance._getColumnNamebyId(rtnTableIdNum,0);
        const result4 = await contractInstance._getColumnNamebyId(rtnTableIdNum,1);
        console.log("------------------debug output3------------------");
        console.log(result3.logs[0].args._colName);
        console.log(result4.logs[0].args._colName);
        console.log("----------------//debug output3------------------");
        expect(result3.receipt.status).to.equal(true);
        expect(result4.receipt.status).to.equal(true);
        expect(result3.logs[0].args._colName).to.equal(columnNames[0]);
        expect(result4.logs[0].args._colName).to.equal(columnNames[1]);

    })
    /*
    context("with the single-step transfer scenario", async () => {
        it("should transfer a zombie", async () => {
            const result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
            const zombieId = result.logs[0].args.zombieId.toNumber();
            await contractInstance.transferFrom(alice, bob, zombieId, {from: alice});
            const newOwner = await contractInstance.ownerOf(zombieId);
            expect(newOwner).to.equal(bob);
        })
    })
    context("with the two-step transfer scenario", async () => {
        it("should approve and then transfer a zombie when the approved address calls transferFrom", async () => {
            const result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
            const zombieId = result.logs[0].args.zombieId.toNumber();
            await contractInstance.approve(bob, zombieId, {from: alice});
            await contractInstance.transferFrom(alice, bob, zombieId, {from: bob});
            const newOwner = await contractInstance.ownerOf(zombieId);
            expect(newOwner).to.equal(bob);
        })
        it("should approve and then transfer a zombie when the owner calls transferFrom", async () => {
            const result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
            const zombieId = result.logs[0].args.zombieId.toNumber();
            await contractInstance.approve(bob, zombieId, {from: alice});
            await contractInstance.transferFrom(alice, bob, zombieId, {from: alice});
            const newOwner = await contractInstance.ownerOf(zombieId);
            expect(newOwner).to.equal(bob);
         })
    })
    it("zombies should be able to attack another zombie", async () => {
        let result;
        result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
        const firstZombieId = result.logs[0].args.zombieId.toNumber();
        result = await contractInstance.createRandomZombie(zombieNames[1], {from: bob});
        const secondZombieId = result.logs[0].args.zombieId.toNumber();
        await time.increase(time.duration.days(1));
        await contractInstance.attack(firstZombieId, secondZombieId, {from: alice});
        expect(result.receipt.status).to.equal(true);
    })
    */
})
