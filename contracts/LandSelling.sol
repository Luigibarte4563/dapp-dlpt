// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract LandSelling {
    struct Land {
        uint256 landId;
        address wallet;
        string ownerName;
        string location;
        uint256 squareFeet;
        uint256 price;
        bool isAvailable;
    }

    mapping(uint256 => Land) public lands;
    uint256[] public listedLandIds;

    event LandListed(
        uint256 landId,
        address wallet,
        string ownerName,
        string location,
        uint256 squareFeet,
        uint256 price
    );

    event LandSold(uint256 landId, address buyer, uint256 price);

    function listLandForSale(
        uint256 landId,
        string memory ownerName,
        string memory location,
        uint256 squareFeet,
        uint256 price
    ) public {
        require(lands[landId].landId == 0, "Land ID already exists");

        lands[landId] = Land({
            landId: landId,
            wallet: msg.sender,
            ownerName: ownerName,
            location: location,
            squareFeet: squareFeet,
            price: price,
            isAvailable: true
        });

        listedLandIds.push(landId);

        emit LandListed(
            landId,
            msg.sender,
            ownerName,
            location,
            squareFeet,
            price
        );
    }

    function getAllListings() public view returns (Land[] memory) {
        uint256 count = listedLandIds.length;
        Land[] memory activeLands = new Land[](count);
        for (uint256 i = 0; i < count; i++) {
            activeLands[i] = lands[listedLandIds[i]];
        }
        return activeLands;
    }

    function buyLand(uint256 landId) public payable {
        Land storage land = lands[landId];
        require(land.landId != 0, "Land does not exist");
        require(land.isAvailable, "Land is not available");
        require(msg.value >= land.price, "Insufficient payment");

        address seller = land.wallet;

        land.isAvailable = false;
        land.wallet = msg.sender;

        payable(seller).transfer(msg.value);

        emit LandSold(landId, msg.sender, land.price);
    }
}
