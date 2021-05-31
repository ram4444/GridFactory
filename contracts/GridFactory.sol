// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

//import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract GridFactory {

    //uint[] arr_cell_columnId;
    //uint[] arr_cell_cellId;

    //uint[] arr_column_tableId;
    //uint[] arr_column_columnId;

    uint[] arr_table_tableId;
    address[] arr_table_ownerAddr;

    mapping(uint=>table) public poolTable;          // TableId:  Table
    //mapping(uint=>column) public poolColumn;    // ColumnId: column
    //mapping(uint=>cell) public columnCell;              

    /*
    arr_table_tableId   [table1,table2]
    arr_table_ownerAddr [owner1,owner2]

    arr_column_tableId   [table1,table1.................]
    arr_column_columnId  [col1,  col2]
    */

    /* Column Function
    where (column) 
        str:    equal
        str:    notEqual
        str:    in (valueList)
        str:    like
        int:    equal
        int:    notEqual
        int:    bigger smaller
    */
    


    // Struct ---------------------------------------------------------------------

    struct cell {
        string value;
    }

    
    struct column {
        string name;
        DataType datatype;
        Constraint constraint;
        cell[] cellList;
    }
    
    struct table {
        uint arrIndex;
        string name;
        column[] columnList;
        string[] columnNameList;
        
    }
    

    table workingTable;
    column workingColumn;
    cell workingCell;

    table[] dummyTableList;
    column[] dummyColumnList;
    cell[] dummyCellList;

    event TableCreated(uint indexed _arrIndex, string _name, uint _tableId);
    event ColumnCreated(string _colName);
    //event Deposit(address indexed _from, bytes32 indexed _id, uint _value);
    //event Deposit(address indexed _from, bytes32 indexed _id, uint _value);
    //event Deposit(address indexed _from, bytes32 indexed _id, uint _value);

    bool private initialized;
    function initialize() public {
        require(!initialized, "Contract instance has already been initialized");
        initialized = true;
    }
    
    
    // Util------------------------------------------------------------------------
    function _generateRandomId(string memory _str) private pure returns (uint) {
        uint rand = uint(keccak256(abi.encodePacked(_str)));
        return rand;
    }

    enum DataType{ STRING, DEC, INT, TIMESTAMP, BYTE, BOOL, ADDR }
    enum Constraint{ NONE, UNIQ }
    //FreshJuiceSize constant defaultChoice = FreshJuiceSize.MEDIUM;

    // Table-----------------------------------------------------------------------
    
    // Get Table Name by ID
    function _getNamebyId(uint _tabId) public view returns (string memory name){
        return poolTable[_tabId].name;
    }

    // Get Table Owner by Table ID
    function _getTableOwnerbyId(uint _tabId) public view returns (address addr){
        return arr_table_ownerAddr[poolTable[_tabId].arrIndex];
    }

    // Get Table Ids in List by Owner
    function _getTableListbyOwner(address _ownerAddr) public view returns (uint[] memory){

        uint rtnArraySize = 0;
        for (uint i = 0; i < arr_table_ownerAddr.length; i++) {
            if (arr_table_ownerAddr[i] == _ownerAddr) {
                rtnArraySize++;
            }
        }

        uint[] memory tableIdList = new uint[](rtnArraySize);
        uint j = 0;

        for (uint i = 0; i < arr_table_ownerAddr.length; i++) {
            if (arr_table_ownerAddr[i] == _ownerAddr) {
                tableIdList[j]=arr_table_tableId[i];
                j++;
            }
        }
        return tableIdList;
    }

    
    // Create Table
    function _createTable(string memory tableName, address ownerAddress) public returns (uint){
        // Check the user has not table with same table name
        bool tableNameNotExist=true;
        uint[] memory ownerTableList = _getTableListbyOwner(ownerAddress);
        for (uint i = 0; i < ownerTableList.length; i++) {
            if (keccak256(abi.encodePacked(poolTable[ownerTableList[i]].name)) == keccak256(abi.encodePacked(tableName)))
                tableNameNotExist=false;
        }
        require(tableNameNotExist,'Table exists');
        
        uint tableId = _generateRandomId(tableName);

        arr_table_tableId.push(tableId);
        uint arrIndex = arr_table_tableId.length;
        arr_table_ownerAddr.push(ownerAddress);

        //Copying of type struct GridFactory.column memory[] memory to storage not yet supported.
        //table memory _tbl;
        //_tbl.arrIndex=arrIndex;
        //_tbl.name=tableName;
        //poolTable[tableId]=_tbl;

        workingTable.arrIndex=arrIndex;
        workingTable.name=tableName;
        table storage tbl = workingTable;
        poolTable[tableId]=tbl;

        emit TableCreated(workingTable.arrIndex, workingTable.name, tableId);
        return tableId;
    }
    
    

    // Column----------------------------------------------------------------------
    
    // Get Column Name by Id
    function _getColumnNamebyId(uint _tableId, uint _colId) public view returns (string memory name){
        return poolTable[_tableId].columnList[_colId].name;
    }

    // Get Column Id by Name
    function _getColumnIdbyName(uint _tableId, string memory name) public view returns (uint id){
        for (uint i = 0; i < poolTable[_tableId].columnNameList.length; i++) {
            if (keccak256(abi.encodePacked(poolTable[_tableId].columnNameList[i])) == keccak256(abi.encodePacked(name))) {
                return i;
            } else return 0;
        }
    }

    function _createColumn(
        string memory _columnName, DataType _dataType, Constraint _constraint, uint _tableId) public returns (uint columnId){
        
        //columnId = _generateRandomId(_columnName);
        
        poolTable[_tableId].columnNameList.push(_columnName);

        /*
        workingColumn = column(
            _columnName,
            _dataType,
            _constraint,
            dummy
        );
        */
        workingColumn.name=_columnName;
        workingColumn.datatype=_dataType;
        workingColumn.constraint=_constraint;

        column storage col = workingColumn;

        // Assign Column to Table
        poolTable[_tableId].columnList.push(col);

        emit ColumnCreated(workingColumn.name);
        return poolTable[_tableId].columnNameList.length;

    }
    

    // Cell------------------------------------------------------------------------
    /*
    // Create cell and assign value
    function createCell(string memory _value, uint _columnId, uint _tableId) public returns (uint cellId){
        cellId = _generateRandomId(_value);

        cell memory cel = cell(
            _value
        );
        
        // Assign cell to Column
        poolTable[_tableId].cloumnList[_columnId].cellList.push(cel);

        return cellId;
    }

    // Update cell value by Id
    //unction updateCell(uint _cellId, uint _columnId, uint _tableId, string memory _value) public {
        //poolTable[_tableId].cloumnList[_columnId].cellList[_cellId]=_value;
    //}

    // Get Value by CellId
    //function _getValuebyId(uint _cellId, uint _columnId, uint _tableId) public view returns (string memory _value){
        //_value=poolTable[_tableId].cloumnList[_columnId].columnCells[_cellId];
        //return _value;
    //}

    */



    
}