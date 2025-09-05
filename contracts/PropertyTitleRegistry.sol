// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title PropertyTitleRegistry
 * @dev A contract to register and manage property titles on the blockchain.
 * Records are stored and retrieved using an auto-incrementing unique ID (mapping key).
 */
contract PropertyTitleRegistry {
    // Structure to hold property title details
    struct PropertyTitle {
        string ownerName; // Full name of the property owner
        string propertyAddress; // Full address of the property
        uint256 totalAreaSqm; // Total area in square meters
        uint256 createdAt; // Timestamp of creation on the blockchain
    }

    // Mapping to store PropertyTitle structs, indexed by their unique ID
    // The 'id' here refers to the key used in the mapping, not a field within the struct.
    mapping(uint256 => PropertyTitle) public propertyTitles;

    // Counter for the next available property ID (mapping key), starts from 1
    uint256 private nextPropertyId = 1;

    // Event emitted when a new property title is added
    event PropertyTitleAdded(
        uint256 indexed id, // The unique ID used as the key for this record in the mapping
        string ownerName,
        string propertyAddress,
        uint256 totalAreaSqm
    );

    /**
     * @dev Adds a new property title to the registry.
     * Assigns a unique, auto-incrementing ID (mapping key) to the property.
     * @param _ownerName The full name of the property owner.
     * @param _propertyAddress The full address of the property.
     * @param _totalAreaSqm The total area of the property in square meters.
     * @return The ID (uint256) which is the key used to store this property in the mapping.
     */
    function addPropertyTitle(
        string memory _ownerName,
        string memory _propertyAddress,
        uint256 _totalAreaSqm
    ) public returns (uint256) {
        // Assign the current nextPropertyId and then increment it
        uint256 currentId = nextPropertyId++;

        // Create a new PropertyTitle struct and store it in the mapping using the generated ID as key
        propertyTitles[currentId] = PropertyTitle({
            ownerName: _ownerName,
            propertyAddress: _propertyAddress,
            totalAreaSqm: _totalAreaSqm,
            createdAt: block.timestamp // Record the block timestamp
        });

        // Emit an event for external listeners
        emit PropertyTitleAdded(
            currentId,
            _ownerName,
            _propertyAddress,
            block.timestamp
        );

        return currentId;
    }

    function getPropertyTitle(
        uint256 _id
    )
        public
        view
        returns (
            string memory ownerName,
            string memory propertyAddress,
            uint256 totalAreaSqm,
            uint256 createdAt
        )
    {
        // Retrieve the property title from the mapping
        PropertyTitle storage pTitle = propertyTitles[_id];

        // Ensure the property title exists by checking if its 'createdAt' timestamp is non-zero.
        // This is a reliable way to check for existence when 'id' is not part of the struct.
        require(
            pTitle.createdAt != 0,
            "Property title does not exist for this ID."
        );

        return (
            pTitle.ownerName,
            pTitle.propertyAddress,
            pTitle.totalAreaSqm,
            pTitle.createdAt
        );
    }
}
