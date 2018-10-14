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
     this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
  constructor(){
    this.chain = [];
    this.addBlock(new Block("First block in the chain - Genesis block"));
  }

  // Add new block
  async addBlock(newBlock){
    // Block height
    newBlock.height = this.chain.length;
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    // previous block hash
    if(this.chain.length>0){
      newBlock.previousBlockHash = this.chain[this.chain.length-1].hash;
    }
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    // Adding block object to chain
  	this.chain.push(newBlock);
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
      let i = 0; //zero based height
      db.createReadStream().on('data', (data) => {
        i++
      }).on('error', (err) => {
				console.log('Unable to read data stream!', err)
        reject(error)
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
blockchain.getBlock(0).then(block => console.log(block)).catch(err => console.log(err));
blockchain.addBlock(new Block('Testing data 1'));
blockchain.addBlock(new Block('Testing data 2'));
blockchain.getBlockHeight().then((height) => console.log('Block height ' + height)).catch(err => console.log(err));
//blockchain.validateBlock(0);
//blockchain.validateChain(0);
//console.log(blockchain.chain);
