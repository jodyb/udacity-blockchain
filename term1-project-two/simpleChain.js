const SHA256 = require('crypto-js/sha256');
const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/
class Block{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = "0x0"
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
  constructor() {
		this.getBlockHeight().then((blockHeight) => {
		  if (blockHeight == -1) {
			  console.log('Triggering Genesis block creation.');
        this.addBlock(new Block("First block in the chain - Genesis block"));
	    }
	  });
  }

  // Add new block
  async addBlock(newBlock){
    const height = parseInt(await this.getBlockHeight());
		newBlock.height = height + 1;
		// UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    // previous block hash
    if(newBlock.height > 0){
			const previousBlock = await this.getBlock(height);
      newBlock.previousBlockHash = previousBlock.hash;
    }
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    // Adding block object to chain
		await this.saveBlockToLevelDB(newBlock.height, JSON.stringify(newBlock));
  }

    // Get block height
    async getBlockHeight(){
			return await this.getBlockHeightFromLevelDB() - 1;
    }

    // get block
    async getBlock(blockHeight){
			return JSON.parse(await this.getBlockFromLevelDB(blockHeight));
    }

    // validate block
    validateBlock(blockHeight){
      // get block object
      let block = this.getBlock(blockHeight);
      // get block hash
      let blockHash = block.hash;
      // remove block hash to test block integrity
      block.hash = '';
      // generate block hash
      let validBlockHash = SHA256(JSON.stringify(block)).toString();
      // Compare
      if (blockHash===validBlockHash) {
          return true;
        } else {
          console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
          return false;
        }
    }

   // Validate blockchain
    validateChain(){
      let errorLog = [];
      for (var i = 0; i < this.chain.length-1; i++) {
        // validate block
        if (!this.validateBlock(i))errorLog.push(i);
        // compare blocks hash link
        let blockHash = this.chain[i].hash;
        let previousHash = this.chain[i+1].previousBlockHash;
        if (blockHash!==previousHash) {
          errorLog.push(i);
        }
      }
      if (errorLog.length>0) {
        console.log('Block errors = ' + errorLog.length);
        console.log('Blocks: '+errorLog);
      } else {
        console.log('No errors detected');
      }
    }

 // Data Layer
 // Use LevelDB to persist blockchain
	saveBlockToLevelDB(key, value) {
		return new Promise((resolve, reject) => {
			db.put(key, value, function(err) {
				if (err) {
					console.log('Block ' + key + ' save to levelDB failed', err);
					reject();
				} else {
					console.log('Block ' + key + ' saved to levelDB');
					resolve();
				}
			})
 		})
	}
  getBlockFromLevelDB(key) {
		return new Promise((resolve, reject) => {
      db.get(key, function (err, value) {
				if (err) {
					console.log('Unable to retrieve Block ' + key + ' from levelDB', err);
					reject(err);
				} else {
					resolve(value);
				}
      })
    })
  }
	getBlockHeightFromLevelDB() {
    return new Promise((resolve, reject) => {
      let i = 0; //trigger genesis block file empty;
      db.createReadStream().on('data', (data) => {
        i++
      }).on('error', (err) => {
				console.log('Unable to read data stream!', err)
        resolve(err);
      }).on('close', () => {
        resolve(i)
      })
    })
  }
} //Blochchain

/* ===== Testing ==============================================================|
|                                                                              |
|  Test adding and retrieval of blocks from peristent store                    |
|																																							 |
|  ===========================================================================*/

let blockchain = new Blockchain();

(function theLoop (i) {
  setTimeout(function () {
    blockchain.addBlock(new Block('Block ' + i + ' added to levelDB')).then(() => {
      if (--i) theLoop(i);
    })
  }, 100);
})(10);
