// SPDX-License-Identifier: MIT
pragma solidity >=0.8.5 <0.9.0;
pragma experimental ABIEncoderV2;

//import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract GridFactory {

    uint[] arr_table_tableId;
    address[] arr_table_ownerAddr;

    mapping(uint=>table) public poolTable;          // TableId:  Table
    //mapping(uint=>column) public poolColumn;    // ColumnId: column
    //mapping(uint=>cell) public columnCell;              

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
        uint lastCellIndex;
    }
    
    struct table {
        uint arrIndex;
        string name;
        column[] columnList;
        string[] columnNameList;
        uint lastColumnIndex;
    }
    

    table workingTable;
    column workingColumn;
    cell workingCell;

    table[] dummyTableList;
    column[] dummyColumnList;
    cell[] dummyCellList;

    event TableCreated(uint indexed _arrIndex, string _name, uint indexed _tableId);
    event TableOwner(address _address);
    event ColumnCreated(uint _tableId, string _tableName, string _colNameListValue, string _colNameInColumn, uint _colId);
    event CellInserted(
        uint _tableId, 
        string _tableName, 
        string _colName,
        uint _index, 
        uint _colId, 
        string _cellValue);
    event CellList(cell[] _cellList);
    event ColumnList(column[] _columnList);
    event Column(column _column);
    //event TableColumnCellList(column[] _columnList);

    bool private initialized;
    function initialize() public {
        require(!initialized, "Contract instance has already been initialized");
        initialized = true;
    }
    
    
    // Util------------------------------------------------------------------------
    function _generateRandomId(string memory _str, uint digit) private pure returns (uint) {
        uint rand = uint(keccak256(abi.encodePacked(_str)));
        return rand % (10 ** digit);
    }

    enum DataType{ STRING, DEC, INT, TIMESTAMP, BYTE, BOOL, ADDR }
    enum Constraint{ NONE, UNIQ }


    // Table-----------------------------------------------------------------------
    
    // Get Table Name by ID
    function _getNamebyId(uint _tabId) public view returns (string memory name){
        return poolTable[_tabId].name;
    }

    // Get Table Owner by Table ID
    function _getTableOwnerbyId(uint _tabId) public returns (address addr){
        emit TableOwner(arr_table_ownerAddr[poolTable[_tabId].arrIndex]);
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
        
        uint tableId = _generateRandomId(tableName, 8);

        arr_table_tableId.push(tableId);
        uint arrIndex = arr_table_tableId.length;
        arr_table_ownerAddr.push(ownerAddress);

        poolTable[tableId].lastColumnIndex=0;
        poolTable[tableId].arrIndex=arrIndex;
        poolTable[tableId].name=tableName;

        emit TableCreated(poolTable[tableId].arrIndex, poolTable[tableId].name, arr_table_tableId[arr_table_tableId.length-1]);
        return arr_table_tableId[arr_table_tableId.length-1];
    }
    

    // Column----------------------------------------------------------------------
    
    // Get Column Name by Id
    function _getColumnNamebyId(uint _tableId, uint _colId) public returns (string memory name){
        emit ColumnCreated(
            _tableId,
            poolTable[_tableId].name,
            poolTable[_tableId].columnNameList[_colId],
            poolTable[_tableId].columnList[_colId].name,
            _colId);
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
        
        
        poolTable[_tableId].columnNameList.push(_columnName);
        
        workingColumn.lastCellIndex=0;
        workingColumn.name=_columnName;
        workingColumn.datatype=_dataType;
        workingColumn.constraint=_constraint;
        column storage col = workingColumn;

        // Assign Column to Table
        poolTable[_tableId].columnList.push(col);
        // Assign Value has no effect for the 2nd call
        //poolTable[_tableId].columnList[poolTable[_tableId].lastColumnIndex].lastCellIndex=0;
        //poolTable[_tableId].columnList[poolTable[_tableId].lastColumnIndex].name=_columnName;
        //poolTable[_tableId].columnList[poolTable[_tableId].lastColumnIndex].datatype=_dataType;
        //poolTable[_tableId].columnList[poolTable[_tableId].lastColumnIndex].constraint=_constraint;
        
        // ALL correct for method 1
        emit ColumnCreated(
            _tableId,
            poolTable[_tableId].name,
            poolTable[_tableId].columnNameList[poolTable[_tableId].lastColumnIndex],
            poolTable[_tableId].columnList[poolTable[_tableId].lastColumnIndex].name,
            poolTable[_tableId].lastColumnIndex
        );

        emit Column(poolTable[_tableId].columnList[poolTable[_tableId].lastColumnIndex]);

        emit ColumnList(poolTable[_tableId].columnList);

        poolTable[_tableId].lastColumnIndex=poolTable[_tableId].lastColumnIndex+1;
        return poolTable[_tableId].lastColumnIndex-1;

    }

    function _listTableColumns(uint _tableId) public returns (column[] memory colList){
        emit ColumnList(poolTable[_tableId].columnList);
        return poolTable[_tableId].columnList;
    }
    
    

    // Cell------------------------------------------------------------------------
    
    // Create cell and assign value
    function _createCell(string memory _value, uint _columnId, uint _tableId) public returns (uint cellId){

        cell memory cel = cell(
            _value
        );
        
        // Assign cell to Column
        uint last = poolTable[_tableId].columnList[_columnId].lastCellIndex;
        poolTable[_tableId].columnList[_columnId].cellList.push(cel);
        
        emit CellInserted(
            _tableId,
            poolTable[_tableId].name,
            poolTable[_tableId].columnList[_columnId].name,
            poolTable[_tableId].columnList[_columnId].lastCellIndex,
            _columnId, 
            poolTable[_tableId].columnList[_columnId].cellList[last].value);
        
        poolTable[_tableId].columnList[_columnId].lastCellIndex=last+1;

        return poolTable[_tableId].columnList[_columnId].lastCellIndex-1;
    }

    // Get Every cells of a column
    function _listColumnCells(uint _columnId, uint _tableId) public returns (cell[] memory cellList){
        emit CellList(poolTable[_tableId].columnList[_columnId].cellList);
        return poolTable[_tableId].columnList[_columnId].cellList;
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

    



    
}