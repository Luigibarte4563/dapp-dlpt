// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract LandRegistry {
    struct Land {
        uint256 id;
        address owner;
        string ownerName;
        string location;
        uint256 squareMeters;
    }

    uint256 public nextLandId;
    mapping(uint256 => Land) public lands;

    event LandRegistered(
        uint256 indexed landId,
        address indexed owner,
        string ownerName,
        string location,
        uint256 squareMeters
    );

    event OwnershipTransferred(
        uint256 indexed landId,
        address indexed oldOwner,
        address indexed newOwner,
        string location,
        uint256 squareMeters
    );

    function registerLand(
        string memory _ownerName,
        string memory _location,
        uint256 _squareMeters
    ) public {
        lands[nextLandId] = Land({
            id: nextLandId,
            owner: msg.sender,
            ownerName: _ownerName,
            location: _location,
            squareMeters: _squareMeters
        });

        emit LandRegistered(
            nextLandId,
            msg.sender,
            _ownerName,
            _location,
            _squareMeters
        );
        nextLandId++;
    }

    function transferOwnership(uint256 _landId, address _newOwner) public {
        Land storage land = lands[_landId];
        require(msg.sender == land.owner, "Not the land owner");

        address oldOwner = land.owner;
        land.owner = _newOwner;

        emit OwnershipTransferred(
            _landId,
            oldOwner,
            _newOwner,
            land.location,
            land.squareMeters
        );
    }

    function getLandDetails(uint256 _landId) public view returns (Land memory) {
        return lands[_landId];
    }
}
