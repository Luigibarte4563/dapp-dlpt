// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract LandNotary {
    struct Notarization {
        uint256 landId;
        string documentURL;
        uint256 validVotes;
        uint256 invalidVotes;
        mapping(address => bool) hasVoted;
    }

    uint256 public nextDocId;
    mapping(uint256 => Notarization) private notarizations;

    event DocumentNotarized(
        uint256 indexed docId,
        uint256 indexed landId,
        string documentURL
    );
    event Voted(uint256 indexed docId, address indexed voter, bool isValid);

    function notarize(uint256 landId, string memory documentURL) public {
        Notarization storage doc = notarizations[nextDocId];
        doc.landId = landId;
        doc.documentURL = documentURL;

        emit DocumentNotarized(nextDocId, landId, documentURL);
        nextDocId++;
    }

    function vote(uint256 docId, bool isValid) public {
        require(docId < nextDocId, "Document does not exist");

        Notarization storage doc = notarizations[docId];
        require(!doc.hasVoted[msg.sender], "Already voted");

        doc.hasVoted[msg.sender] = true;

        if (isValid) {
            doc.validVotes++;
        } else {
            doc.invalidVotes++;
        }

        emit Voted(docId, msg.sender, isValid);
    }

    function getNotarization(
        uint256 docId
    )
        public
        view
        returns (
            uint256 landId,
            string memory documentURL,
            uint256 validVotes,
            uint256 invalidVotes
        )
    {
        require(docId < nextDocId, "Invalid document ID");

        Notarization storage doc = notarizations[docId];
        return (doc.landId, doc.documentURL, doc.validVotes, doc.invalidVotes);
    }
}
