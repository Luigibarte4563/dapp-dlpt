// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract LandLending {
    struct Lease {
        uint256 landId;
        address wallet; // Owner or Lessor
        string ownerName;
        string location;
        uint256 squareFeet;
        uint256 monthlyRate; // Monthly leasing price in wei
        uint256 leaseDurationMonths;
        bool isAvailable;
    }

    mapping(uint256 => Lease) public leases;
    uint256[] public listedLeaseIds;

    event LandListedForLease(
        uint256 landId,
        address wallet,
        string ownerName,
        string location,
        uint256 squareFeet,
        uint256 monthlyRate,
        uint256 leaseDurationMonths
    );

    event LandLeased(
        uint256 landId,
        address lessee,
        uint256 totalPaid,
        uint256 leaseDurationMonths
    );

    function listLandForLease(
        uint256 landId,
        string memory ownerName,
        string memory location,
        uint256 squareFeet,
        uint256 monthlyRate,
        uint256 leaseDurationMonths
    ) public {
        require(leases[landId].landId == 0, "Lease ID already exists");
        require(leaseDurationMonths > 0, "Lease duration must be > 0");

        leases[landId] = Lease({
            landId: landId,
            wallet: msg.sender,
            ownerName: ownerName,
            location: location,
            squareFeet: squareFeet,
            monthlyRate: monthlyRate,
            leaseDurationMonths: leaseDurationMonths,
            isAvailable: true
        });

        listedLeaseIds.push(landId);

        emit LandListedForLease(
            landId,
            msg.sender,
            ownerName,
            location,
            squareFeet,
            monthlyRate,
            leaseDurationMonths
        );
    }

    function getAllLeases() public view returns (Lease[] memory) {
        uint256 count = listedLeaseIds.length;
        Lease[] memory result = new Lease[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = leases[listedLeaseIds[i]];
        }
        return result;
    }

    function leaseLand(uint256 landId) public payable {
        Lease storage lease = leases[landId];
        require(lease.landId != 0, "Lease does not exist");
        require(lease.isAvailable, "Land is not available for lease");
        require(msg.sender != lease.wallet, "You cannot lease your own land");

        uint256 totalCost = lease.monthlyRate * lease.leaseDurationMonths;
        require(msg.value >= totalCost, "Insufficient payment for lease");

        address owner = lease.wallet;
        lease.isAvailable = false;

        payable(owner).transfer(msg.value);

        emit LandLeased(
            landId,
            msg.sender,
            msg.value,
            lease.leaseDurationMonths
        );
    }
}
