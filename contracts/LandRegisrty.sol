// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LandRegistry
 * @dev This contract handles land registration, buying, and selling using NFTs.
 * Each land is represented as a token owned by a wallet address.
 */

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LandRegistry is ERC721URIStorage, Ownable {
    uint256 public landCounter = 0;

    struct Land {
        uint256 id;
        string location;
        string area;
        address currentOwner;
        bool forSale;
        uint256 price;
    }

    mapping(uint256 => Land) public allLands;
    mapping(address => uint256[]) public ownerLands;

    event LandRegistered(uint256 indexed landId, address indexed owner);
    event LandListed(uint256 indexed landId, uint256 price);
    event LandSold(uint256 indexed landId, address from, address to, uint256 price);

    constructor() ERC721("LandRegistryNFT", "LANDNFT") {}

    // ✅ Register new land
    function registerLand(string memory _location, string memory _area) public {
        landCounter++;
        uint256 newId = landCounter;

        allLands[newId] = Land({
            id: newId,
            location: _location,
            area: _area,
            currentOwner: msg.sender,
            forSale: false,
            price: 0
        });

        _safeMint(msg.sender, newId);
        ownerLands[msg.sender].push(newId);

        emit LandRegistered(newId, msg.sender);
    }

    // ✅ List land for sale
    function listForSale(uint256 _landId, uint256 _price) public {
        require(ownerOf(_landId) == msg.sender, "Not owner");
        Land storage land = allLands[_landId];
        land.forSale = true;
        land.price = _price;

        emit LandListed(_landId, _price);
    }

    // ✅ Buy land
    function buyLand(uint256 _landId) public payable {
        Land storage land = allLands[_landId];
        require(land.forSale, "Not for sale");
        require(msg.value == land.price, "Incorrect price");

        address prevOwner = ownerOf(_landId);
        _transfer(prevOwner, msg.sender, _landId);
        payable(prevOwner).transfer(msg.value);

        land.currentOwner = msg.sender;
        land.forSale = false;
        land.price = 0;

        emit LandSold(_landId, prevOwner, msg.sender, msg.value);
    }

    // ✅ View all lands
    function getAllLands() public view returns (Land[] memory) {
        Land[] memory lands = new Land[](landCounter);
        for (uint256 i = 1; i <= landCounter; i++) {
            lands[i - 1] = allLands[i];
        }
        return lands;
    }

    // ✅ View lands owned by sender
    function getMyLands() public view returns (Land[] memory) {
        uint256[] memory ids = ownerLands[msg.sender];
        Land[] memory lands = new Land[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            lands[i] = allLands[ids[i]];
        }
        return lands;
    }
}
