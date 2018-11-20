const StarNotary = artifacts.require('StarNotary')

contract('StarNotary', accounts => {
    const defaultAccount = accounts[0];
    const name = 'Star power 103!';
    const starStory = 'I love my wonderful star';
    const dec = 'ra_032.155';
    const mag = 'dec_121.874';
    const cent =  'mag_245.978';
    const tokenId = 1;

    beforeEach(async function() {
      this.contract = await StarNotary.new({from: defaultAccount});
    })

    describe('star/token creation and existence', () => {
        beforeEach(async function() {
          await this.contract.createStar(name, starStory, dec, mag, cent, tokenId, {from: defaultAccount});
        })

        it('can create a star and check if it exists', async function () {
          assert.equal(await this.contract.checkIfStarExists(dec, mag, cent), true);
        })

        it('should not exist when new star created', async function () {
          assert.equal(await this.contract.checkIfStarExists(0, 0, 0), false);
        })

        it('should have the correct owner', async function () {
          const owner = await this.contract.ownerOf(tokenId, {from: defaultAccount});
          assert.equal(owner, defaultAccount);
        })

        it('should not create a duplicate Star', async function () {
            try {
              await this.contract.createStar(name, starStory, dec, mag, cent, tokenId, {from: defaultAccount});
              assert(false);
            } catch (err) {
              assert.ok(err);
            }
        })

        it('should mint a token', async function () {
            await this.contract.mint(2, {from: defaultAccount});
            var owner = await this.contract.ownerOf(tokenId, {from: defaultAccount})
            assert.equal(owner, defaultAccount);
        })

        it('should return a star from tokenIdToStarInfo', async function () {
            const star = await this.contract.tokenIdToStarInfo(1);
            assert.deepEqual(star, [name, starStory, dec, mag, cent]);
        })
    })
})
