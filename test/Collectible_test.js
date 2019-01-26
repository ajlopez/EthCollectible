
const Collectible = artifacts.require('./Collectible.sol');

contract('Collectible', function (accounts) {
    const creator = accounts[0];
    
    beforeEach(async function () {
        this.collectible = await Collectible.new(10000, 1000);
    });
    
    it('initial supply', async function () {
        const totalSupply = await this.collectible.totalSupply();
        
        assert.equal(totalSupply, 10000);
    });
    
    it('minimum price', async function () {
        const minimumPrice = await this.collectible.minimumPrice();
        
        assert.equal(minimumPrice, 1000);
    });
    
    it('initial owner', async function () {
        const owner = await this.collectible.ownerOf(42);
        
        assert.equal(owner, creator);
    });
});

