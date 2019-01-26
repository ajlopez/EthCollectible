pragma solidity ^0.4.24;

contract Collectible {
    uint totalSupply_;
    
    mapping(uint => address) owners;
    
    constructor(uint _totalSupply) public {
        totalSupply_ = _totalSupply;
    }
    
    function totalSupply() public view returns (uint) {
        return totalSupply_;
    }
    
    function ownerOf(uint tokenId_) public view returns (address) {
        address owner = owners[tokenId_];
        
        if (owner == address(0))
            return this;
        
        return owner;
    }
}
