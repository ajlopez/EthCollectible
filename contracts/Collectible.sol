pragma solidity ^0.4.24;

contract Collectible {
    address public owner;
    uint public minimumPrice;
    
    mapping (uint => uint) public prices;
    
    uint noCollectibles;
    
    mapping(uint => address) owners;
    
    constructor(uint _totalSupply, uint _minimumPrice) public {
        noCollectibles = _totalSupply;
        minimumPrice = _minimumPrice;
        owner = msg.sender;
    }
    
    function totalSupply() public view returns (uint) {
        return noCollectibles;
    }
    
    function ownerOf(uint tokenId_) public view returns (address) {
        address ownerAddress = owners[tokenId_];
        
        if (ownerAddress == address(0))
            return owner;
        
        return ownerAddress;
    }
    
    function sell(uint tokenId_, uint price) public returns (bool) {
        prices[tokenId_] = price;
        
        return true;
    }
    
    function acquire(uint tokenId_) public returns (bool) {
        owners[tokenId_] = msg.sender;
        
        return true;
    }
}
