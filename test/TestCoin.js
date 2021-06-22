const TestCoin = artifacts.require("TestCoin");
const GridFactory = artifacts.require("GridFactory");


//npm install chai
//Import Library
const chai = require('chai');
const expect = require('chai').expect; 


const tableNames = ["table1", "table2", "table3", "table4", "table5",];
const columnNames = ["column1", "column2", "column3", "column4", "column5"];
const cellValueStr_col1 = ["col1_str1", "col1_str2", "col1_str3", "col1_str4", "col1_str5", "col1_str6"];
const cellValueStr_col2 = ["col2_str1", "col2_str2", "col2_str3", "col2_str4", "col2_str5", "col2_str6"];
const cellValueInt = [1, 2, 3, 4, 5, 6];

contract("TestCoin", (accounts) => {
    let [alice, bob] = accounts;

    let contractInstance;
    let contractInstance2;
    
    //run automatically for every test
    beforeEach(async () => {
       
        contractInstance2 = await GridFactory.new();
        contractInstance = await TestCoin.new(contractInstance2.address);
        
    });

    it("should be able to call another contract", async () => {
        console.log(contractInstance2.address);
        const result = await contractInstance._method1( {from: alice});
        expect(result.receipt.status).to.equal(true);
        expect(result.logs[0].args._test).to.equal("abc");
    })
    
})
