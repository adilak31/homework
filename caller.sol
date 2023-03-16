//SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;
 

interface IExample{
    function x()external;
    function y()external;
    function str()external;
    function data(uint256 index)external returns(uint256);
    function map(address key)external returns(uint256, string calldata);
    function setXY(uint256 x_,uint256 y_) external returns(uint256);
    function init(uint256 count)external  returns(uint256[] calldata);
    function addToMap(address adr, uint256 number, string calldata str)external returns(uint256, string calldata);
}
 
contract Caller{
    
    IExample example;
    
   constructor(address adr){
       example = IExample(adr);
   }
    

    function getx()public view returns(uint256){
        bytes memory payload = abi.encodeWithSignature("x()");
        (bool succes, bytes memory returnData) = 
        address(example).staticcall(payload);
        require(succes);
        return abi.decode(returnData,(uint256));
        
    }

    function gety()public view returns(uint256){
        bytes memory payload = abi.encodeWithSignature("y()");
        (bool succes, bytes memory returnData) = 
        address(example).staticcall(payload);
        require(succes);
        return abi.decode(returnData,(uint256));
    }
    function getstr()public view returns(string memory){
        bytes memory payload = abi.encodeWithSignature("str()");
        (bool succes, bytes memory returnData) = 
        address(example).staticcall(payload);
        require(succes);
        return abi.decode(returnData,(string));
    }
    function getData(uint256 index)public view returns(uint256){
       string memory  signature = "data(uint256)";
       bytes memory payloadSignature = abi.encodeWithSignature(signature, index);
       (bool success, bytes memory returnData) = address(example).staticcall(payloadSignature);
       require(success);
       return abi.decode(returnData,(uint256));
    }
    function getMap(address _key) public view returns(uint256, string memory){
        bytes memory payload = abi.encodeWithSignature("map(address)", _key);
        (bool succes, bytes memory returnData) = 
        address(example).staticcall(payload);
        require(succes);
        return abi.decode(returnData,(uint256,string));
    }
    
    
    function setXY(uint256 x, uint256 y) public  returns(uint256){
        bytes memory payload = abi.encodeWithSignature("setXY(uint256,uint256)",x,y);
        (bool succes, bytes memory returnData) = 
        address(example).call(payload);
        require(succes);
        return abi.decode(returnData,(uint256));
    }
    function setStr(string calldata str)public {
       
    }
    function init(uint256 count) public  returns(uint256[]memory){
        bytes memory payload = abi.encodeWithSignature("init(uint256)",count);
        (bool succes, bytes memory returnData) = 
        address(example).call(payload);
        require(succes);
        return abi.decode(returnData,(uint256[]));
    }
    
    
    function addToMap(address adr, uint256 number, string calldata str)public returns(uint256, string memory){
        bytes memory payload = abi.encodeWithSignature("addToMap(address,uint256,string)", adr, number,str);
        (bool succes, bytes memory returnData) = address(example).call(payload);
        require(succes);
        return abi.decode(returnData,(uint256, string));
    }     
}
