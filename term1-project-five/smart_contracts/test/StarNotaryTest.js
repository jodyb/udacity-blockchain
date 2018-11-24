const StarNotary = artifacts.require('StarNotary')

contract('StarNotary', accounts => {
    const defaultAccount = accounts[0];
    const secondAccount = accounts[1];
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

        it('should determine if a star does not exist', async function () {
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

    describe('buying and selling stars', () => {
        let user1 = accounts[1]
        let user2 = accounts[2]
        let randomMaliciousUser = accounts[3]

        let starId = 1
        let starPrice = web3.toWei(.01, "ether")

        beforeEach(async function () {
          await this.contract.createStar('Star power 103!', 'I love my wonderful star', 'ra_032.155', 'dec_121.874', 'mag_245.978', 1, {from: accounts[1]});
        })

        it('user1 owns the star they created', async function () {
            assert.equal(await this.contract.ownerOf(starId), user1)
        })

        it('user1 can put up their star for sale', async function () {
            await this.contract.putStarUpForSale(starId, starPrice, {from: user1})
            assert.equal(await this.contract.starsForSale(starId), starPrice)
        })

        describe('user2 can buy a star that was put up for sale', () => {
            let tx;
            beforeEach(async function () {
                tx = await this.contract.putStarUpForSale(starId, starPrice, {from: user1})
            })

            it('user2 is the owner of the star after they buy it', async function() {
                await this.contract.buyStar(starId, {from: user2, value: starPrice, gasPrice: 0})
                assert.equal(await this.contract.ownerOf(starId), user2)
            })

            it('user2 ether balance changed correctly', async function () {
                let overpaidAmount = web3.toWei(.05, 'ether')
                const balanceBeforeTransaction = web3.eth.getBalance(user2)
                await this.contract.buyStar(starId, {from: user2, value: overpaidAmount, gasPrice: 0})
                const balanceAfterTransaction = web3.eth.getBalance(user2)
                assert.equal(balanceBeforeTransaction.sub(balanceAfterTransaction), starPrice)
            })
        })
    })

    describe('ERC 721 methods from Openzeppelin', () => {
      it('should set second account as approver for star created by default account', async function() {
        await this.contract.createStar(name, starStory, dec, mag, cent, tokenId, {from: defaultAccount});
        await this.contract.approve(secondAccount, tokenId, {from: defaultAccount});
        assert.equal(await this.contract.getApproved(tokenId, {from: defaultAccount}), secondAccount);
      })

     it('should allow safe transfer of star', async function() {
       let tokenId = 1;
       await this.contract.createStar(name, starStory, dec, mag, cent, tokenId, {from: defaultAccount});
       await this.contract.safeTransferFrom(defaultAccount, secondAccount, tokenId);
       assert.equal(await this.contract.ownerOf(tokenId), secondAccount);
     })

     it('should set approvalForAll', async function() {
       await this.contract.createStar(name, starStory, dec, mag, cent, 1, {from: defaultAccount});
       await this.contract.setApprovalForAll(secondAccount, 1)
       assert.equal(await this.contract.isApprovedForAll(defaultAccount, secondAccount, {from: defaultAccount}), true);
     })


    })
})
