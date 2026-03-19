// SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;

import {Brick} from "./Brick.sol";

contract ProposalManager is Brick {

    struct Proposal {

        string description;
        uint256 votes;
        uint deadline;
        bool executed;
    
    }

    Proposal[] public proposals;
    mapping(address Investor => bool voted) public hasVoted;

    function CreateProposal(string memory description) public {

        require(NumOfTokens[msg.sender]>0, "only an investror can create a proposal");
        uint deadline = block.timestamp + 7 days;
        proposals.push(Proposal(description, 0, deadline, false));
    
    }

    function Vote(uint256 proposalId) public {

        Proposal storage proposal = proposals[proposalId];
        require(!hasVoted[msg.sender], "You have already voted."); 
        require(block.timestamp < proposal.deadline, "Voting period has ended."); 
        require(NumOfTokens[msg.sender] >0, "You are not eligible for voting");
        proposal.votes+=NumOfTokens[msg.sender]; 
        hasVoted[msg.sender] = true; 
    
    }

    function getVotes(uint256 proposalId) public view returns (uint256) {
        return proposals[proposalId].votes;
    }

    mapping(uint256 proposalId => bool execution) public hasExecuted; 

    function Execution(uint256 proposalId) public {
      
        require(block.timestamp > proposals[proposalId].deadline, "Voting period is not over yet.");
        require(!hasExecuted[proposalId], "Proposal already executed.");
        if(proposals[proposalId].votes > 55) {
            hasExecuted[proposalId] = true;

        }
    }
    
    function Proposals(uint256 proposalId) public view returns (string memory description, uint256 votes, uint256 deadline) {
          return (proposals[proposalId].description, proposals[proposalId].votes, proposals[proposalId].deadline);
    }



}