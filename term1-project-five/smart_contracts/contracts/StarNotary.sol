pragma solidity ^0.4.23;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';
contract StarNotary is ERC721 {


    struct Star {
      string name;
      string starStory;
      string dec;
      string mag;
      string cent;
    }

    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;
    mapping(uint256 => bool) public starsRegistered;

    function checkIfStarExists(string _dec, string _mag, string _cent) public view returns(bool) {
      uint256 coordinates = uint256(keccak256(abi.encodePacked(_dec, _mag, _cent)));
      return starsRegistered[coordinates];
    }

    function createStar(string _name, string _staryStory, string _dec, string _mag, string _cent, uint256 _tokenId) public {
        require(!checkIfStarExists(_dec, _mag, _cent));
        uint256 coordinates = uint256(keccak256(abi.encodePacked(_dec, _mag, _cent)));
        starsRegistered[coordinates] = true;

        Star memory newStar = Star(_name, _staryStory, _dec, _mag, _cent);
        tokenIdToStarInfo[_tokenId] = newStar;
  
        _mint(msg.sender, _tokenId);
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(this.ownerOf(_tokenId) == msg.sender);
        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0);

        uint256 starCost = starsForSale[_tokenId];
        address starOwner = this.ownerOf(_tokenId);
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);

        starOwner.transfer(starCost);

        if(msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }
    }
}
