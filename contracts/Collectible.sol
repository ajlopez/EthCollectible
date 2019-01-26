pragma solidity ^0.4.24;

contract Collectible {
    uint totalSupply_;
    
    function totalSupply() public view returns (uint) {
        return totalSupply_;
    }
}
