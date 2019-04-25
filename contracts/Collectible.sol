pragma solidity >=0.4.21 <0.6.0;

contract Collectible {
    address public owner;
    uint public defaultPrice;
    
    mapping (uint => uint) public prices;
    
    uint noCollectibles;
    
    mapping(uint => address payable) owners;
    
    constructor(uint _totalSupply, uint _defaultPrice) public {
        noCollectibles = _totalSupply;
        defaultPrice = _defaultPrice;
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    modifier onlyCollectibleOwner(uint tokenId_) {
        require(ownerOf(tokenId_) == msg.sender);
        _;
    }
    
    function totalSupply() public view returns (uint) {
        return noCollectibles;
    }
    
    function setDefaultPrice(uint _price) public onlyOwner {
        defaultPrice = _price;
    }
    
    function create(uint _quantity) public onlyOwner {
        noCollectibles += _quantity;
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
    
    function sell(uint tokenId_, uint price) public onlyCollectibleOwner(tokenId_) returns (bool) {
        prices[tokenId_] = price;
        
        return true;
    }
    
    function buy(uint tokenId_) public payable returns (bool) {
        require(prices[tokenId_] <= msg.value);
        
        address payable originalOwner = owners[tokenId_];
        
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
    
    function getPrices() public view returns (uint[] memory priceList) {
        return getPricesInRange(0, noCollectibles - 1);
    }
    
    function getPricesInRange(uint from, uint to) public view returns (uint[] memory priceList) {
        require(to >= from);
        uint size = to - from + 1;
        priceList = new uint[](size);
        
        for (uint k = 0; k < size; k++)
            if (prices[k + from] > 0)
                priceList[k] = prices[k + from];

        return priceList;
    }
    
    function getOwners() public view returns (address[] memory ownerList) {
        return getOwnersInRange(0, noCollectibles - 1);
    }
    
    function getOwnersInRange(uint from, uint to) public view returns (address[] memory ownerList) {
        require(to >= from);
        uint size = to - from + 1;
        ownerList = new address[](size);
        
        for (uint k = 0; k < size; k++)
            if (owners[k + from] != address(0))
                ownerList[k] = owners[k + from];

        return ownerList;
    }
}
