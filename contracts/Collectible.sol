pragma solidity ^0.4.24;

contract Collectible {
    uint totalSupply_;
    
    constructor(uint _totalSupply) public {
        totalSupply_ = _totalSupply;
    }
    
    function totalSupply() public view returns (uint) {
        return totalSupply_;
    }
}
