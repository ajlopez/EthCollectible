
const rskapi = require('rskapi');
const simpleabi = require('simpleabi');

const config = require('./config');

const Collectible = require('../build/contracts/Collectible.json');

const network = 'development';

const provider = config.networks[network].provider;
const host = rskapi.host(provider);

const bytecodes = Collectible.bytecode;
const params = simpleabi.encodeValues(1000, 100);

async function run() {
    const accounts = await host.getAccounts();
    const account = accounts[0];
    
    const tx = {
        from: account,
        data: bytecodes + params,
        value: 0,
        gas: 2000000,
        gasPrice: 0
    }
    
    const txhash = await host.sendTransaction(tx);

    console.log("tx", txhash);
    
    var counter = 0;

    var txr = null
    
    while (counter++ < 50 && !txr)
        txr = await host.getTransactionReceiptByHash(txhash);
    
    console.log('contract address', txr.contractAddress);
    console.log('gas used', parseInt(txr.gasUsed));
}

run();
