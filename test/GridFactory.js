const GridFactory = artifacts.require("GridFactory");

//npm install chai
//Import Library
var expect = require('chai').expect; 

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
        await utils.shouldThrow(contractInstance._createTable(tableNames[0], alice, {from: alice}));
    })
    it("should create a table, a column and assign the column to the table", async () => {
        // Create a table
        const result = await contractInstance._createTable(tableNames[0], alice, {from: alice});
        expect(result.receipt.status).to.equal(true);
        expect(result.logs[0].args._name).to.equal(tableNames[0]);
        // Create a column and assign to table
        const result2 = await contractInstance._createColumn(
            columnNames[0], 0, 0, result.logs[0].args._tableId);
        expect(result2.logs[0].args._colName).to.equal(columnNames[0]);
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
