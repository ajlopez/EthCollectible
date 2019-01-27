
const Collectible = artifacts.require('./Collectible.sol');

const expectThrow = require('./utils').expectThrow;

contract('Collectible', function (accounts) {
    const creator = accounts[0];
    const alice = accounts[1];
    
    beforeEach(async function () {
        this.collectible = await Collectible.new(1000, 100);
    });
    
    it('initial supply', async function () {
        const totalSupply = await this.collectible.totalSupply();
        
        assert.equal(totalSupply, 1000);
    });
    
    it('minimum price', async function () {
        const minimumPrice = await this.collectible.minimumPrice();
        
        assert.equal(minimumPrice, 100);
    });
    
    it('initial owner', async function () {
        const owner = await this.collectible.ownerOf(42);
        
        assert.equal(owner, creator);
    });
    
    it('free collectible', async function () {
        const price = await this.collectible.prices(42);
        
        assert.equal(price, 0);
    });
    
    it('acquire free collectible', async function () {
        await this.collectible.acquire(42, { from: alice });
        
        const owner = await this.collectible.ownerOf(42);
        
        assert.equal(owner, alice);
    });
    
    it('cannot acquire non-free collectible', async function () {
        await this.collectible.sell(42, 1000);
        
        expectThrow(this.collectible.acquire(42, { from: alice }));
        
        const owner = await this.collectible.ownerOf(42);
        
        assert.equal(owner, creator);
    });
    
    it('sell collectible', async function () {
        await this.collectible.sell(42, 2000);
        
        const price = await this.collectible.prices(42);
        
        assert.equal(price, 2000);
    });
    
    it('only collectible owner can sell it', async function () {
        expectThrow(this.collectible.sell(42, 2000, { from: alice }));
        
        const price = await this.collectible.prices(42);
        
        assert.equal(price, 0);
    });
    
    it('buy collectible', async function () {
        await this.collectible.sell(42, 2000);
        await this.collectible.buy(42, { from: alice, value: 3000 });
        
        const price = await this.collectible.prices(42);
        
        assert.equal(price, 3000 * 2);

        const owner = await this.collectible.ownerOf(42);
        
        assert.equal(owner, alice);
    });
    
    it('cannot buy collectible using low value', async function () {
        await this.collectible.sell(42, 2000);
        expectThrow(this.collectible.buy(42, { from: alice, value: 1000 }));
        
        const price = await this.collectible.prices(42);
        
        assert.equal(price, 2000);

        const owner = await this.collectible.ownerOf(42);
        
        assert.equal(owner, creator);
    });
    
    it('get prices', async function () {
        await this.collectible.sell(42, 2000);
        await this.collectible.sell(1, 3000);
        await this.collectible.sell(4, 4000);
        await this.collectible.sell(9, 5000);
        
        const result = await this.collectible.getPrices({ gas: 6500000 });
        
        assert.ok(result);
        assert.ok(Array.isArray(result));
        assert.equal(result.length, 1000);
        
        assert.equal(result[1], 3000);
        assert.equal(result[4], 4000);
        assert.equal(result[9], 5000);
        assert.equal(result[42], 2000);
    });
})

