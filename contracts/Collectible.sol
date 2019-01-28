pragma solidity ^0.4.24;

contract Collectible {
    address public owner;
    uint public defaultPrice;
    
    mapping (uint => uint) public prices;
    
    uint noCollectibles;
    
    mapping(uint => address) owners;
    
    constructor(uint _totalSupply, uint _defaultPrice) public {
        noCollectibles = _totalSupply;
        defaultPrice = _defaultPrice;
        owner = msg.sender;
    }
    
    modifier onlyOwner(uint tokenId_) {
        require(ownerOf(tokenId_) == msg.sender);
        _;
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
    
    function isFree(uint tokenId_) public view returns (bool) {
        return prices[tokenId_] == 0;
    }
    
    function sell(uint tokenId_, uint price) public onlyOwner(tokenId_) returns (bool) {
        prices[tokenId_] = price;
        
        return true;
    }
    
    function buy(uint tokenId_) public payable returns (bool) {
        require(prices[tokenId_] <= msg.value);
        
        address originalOwner = owners[tokenId_];
        
        owners[tokenId_] = msg.sender;
        prices[tokenId_] = 2 * msg.value;
        originalOwner.transfer(msg.value);
    
        return true;
    }
    
    function acquire(uint tokenId_) public returns (bool) {
        require(isFree(tokenId_));
        
        owners[tokenId_] = msg.sender;
        prices[tokenId_] = defaultPrice;
        
        return true;
    }
    
    function getPrices() public view returns (uint[] priceList) {
        priceList = new uint[](noCollectibles);
        
        for (uint k = 0; k < noCollectibles; k++)
            if (prices[k] > 0)
                priceList[k] = prices[k];

        return priceList;
    }
    
    function getOwners() public view returns (address[] ownerList) {
        ownerList = new address[](noCollectibles);
        
        for (uint k = 0; k < noCollectibles; k++)
            if (owners[k] != address(0))
                ownerList[k] = owners[k];

        return ownerList;
    }
}
