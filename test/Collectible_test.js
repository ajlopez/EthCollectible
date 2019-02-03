
const Collectible = artifacts.require('./Collectible.sol');

const expectThrow = require('./utils').expectThrow;

contract('Collectible', function (accounts) {
    const creator = accounts[0];
    const alice = accounts[1];
    const bob = accounts[2];
    const charlie = accounts[3];
    const dan = accounts[4];
    
    const NO_COLLECTIBLES = 1000;
    const DEFAULT_PRICE = 100;
    
    beforeEach(async function () {
        this.collectible = await Collectible.new(NO_COLLECTIBLES, DEFAULT_PRICE);
    });
    
    it('initial supply', async function () {
        const totalSupply = await this.collectible.totalSupply();
        
        assert.equal(totalSupply, NO_COLLECTIBLES);
    });
    
    it('default price', async function () {
        const defaultPrice = await this.collectible.defaultPrice();
        
        assert.equal(defaultPrice, DEFAULT_PRICE);
    });
        
    it('set default price', async function () {
        await this.collectible.setDefaultPrice(200, { from: creator });
        
        const defaultPrice = await this.collectible.defaultPrice();
        
        assert.equal(defaultPrice, 200);
    });

    it('only creator can set default price', async function () {
        expectThrow(this.collectible.setDefaultPrice(200, { from: alice }));
        
        const defaultPrice = await this.collectible.defaultPrice();
        
        assert.equal(defaultPrice, DEFAULT_PRICE);
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
        
        const price = await this.collectible.prices(42);
        
        assert.equal(price, DEFAULT_PRICE);
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
        
        const result = await this.collectible.getPrices();
        
        assert.ok(result);
        assert.ok(Array.isArray(result));
        assert.equal(result.length, 1000);
        
        assert.equal(result[1], 3000);
        assert.equal(result[4], 4000);
        assert.equal(result[9], 5000);
        assert.equal(result[42], 2000);
    });
    
    it('get prices in range', async function () {
        await this.collectible.sell(42, 2000);
        await this.collectible.sell(1, 3000);
        await this.collectible.sell(4, 4000);
        await this.collectible.sell(9, 5000);
        
        const result = await this.collectible.getPricesInRange(1, 10);
        
        assert.ok(result);
        assert.ok(Array.isArray(result));
        assert.equal(result.length, 10);
        
        assert.equal(result[0], 3000);
        assert.equal(result[3], 4000);
        assert.equal(result[8], 5000);
    });

    it('get prices invalid range', async function () {
        await this.collectible.sell(42, 2000);
        await this.collectible.sell(1, 3000);
        await this.collectible.sell(4, 4000);
        await this.collectible.sell(9, 5000);
        
        expectThrow(this.collectible.getPricesInRange(10, 1));
    });

    it('get owners', async function () {
        await this.collectible.acquire(42, { from: alice });
        await this.collectible.acquire(1, { from: bob });
        await this.collectible.acquire(4, { from: charlie });
        await this.collectible.acquire(9, { from: dan });
        
        const result = await this.collectible.getOwners();
        
        assert.ok(result);
        assert.ok(Array.isArray(result));
        assert.equal(result.length, 1000);
        
        assert.equal(result[1], bob);
        assert.equal(result[4], charlie);
        assert.equal(result[9], dan);
        assert.equal(result[42], alice);
    });
    
    it('get owners in range', async function () {
        await this.collectible.acquire(42, { from: alice });
        await this.collectible.acquire(1, { from: bob });
        await this.collectible.acquire(4, { from: charlie });
        await this.collectible.acquire(9, { from: dan });
        
        const result = await this.collectible.getOwnersInRange(1, 10);
        
        assert.ok(result);
        assert.ok(Array.isArray(result));
        assert.equal(result.length, 10);
        
        assert.equal(result[0], bob);
        assert.equal(result[3], charlie);
        assert.equal(result[8], dan);
    });
    
    it('get owners invalid range', async function () {
        await this.collectible.sell(42, 2000);
        await this.collectible.sell(1, 3000);
        await this.collectible.sell(4, 4000);
        await this.collectible.sell(9, 5000);
        
        expectThrow(this.collectible.getOwnersInRange(10, 1));
    });

    it('emit collectibles', async function () {
        await this.collectible.emit(1000, { from: creator });
        
        const totalSupply = await this.collectible.totalSupply();
        
        assert.equal(totalSupply, NO_COLLECTIBLES + 1000);
    });
    
    it('only creator could emit collectibles', async function () {
        expectThrow(this.collectible.emit(1000, { from: alice }));
        
        const totalSupply = await this.collectible.totalSupply();
        
        assert.equal(totalSupply, NO_COLLECTIBLES);
    });
})

