// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.5.0
pragma solidity ^0.8.27;

import {ERC721} from "@openzeppelin/contracts@5.5.0/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import {Brick} from "./Brick.sol";
import {LeaseAgreement} from "./LeaseAgreement.sol";
import {ProposalManager} from "./ProposalManager.sol";

contract BlockShare is ERC721, LeaseAgreement, ProposalManager {

    uint256 private _2BHK;
    uint256 private _3BHK = 5;
    address public seller;
    uint256[] private AvailableFlats;
    uint256 public PriceOf2BHK = 10 ;
    uint256 public PriceOf3BHK = 12 ;
    uint256[] private FlatsSold;
    uint256 public TotalFlats = 10;
    uint256 public TotalTokens = 110;
    mapping(uint256 FlatNo => uint256) private MintedFlats;

    constructor() ERC721("BlockShare", "BKS")  {
       seller = msg.sender;       
    }

    uint256 private FlatNo;

    function Mint_2BHK() external  {
        require(msg.sender == seller, "You are not the owner");
        FlatNo = _2BHK++;
        _safeMint(msg.sender, FlatNo);
        AvailableFlats.push(FlatNo);
        MintedFlats[FlatNo]=1;
        
    }

    function Mint_3BHK() external  {
        require(msg.sender == seller, "You are not the owner");
        FlatNo = _3BHK++;
        _safeMint(msg.sender, FlatNo);
        AvailableFlats.push(FlatNo);
        MintedFlats[FlatNo]=1;
        
    } 

    using Strings for uint256;

    function FlatDescription () internal pure returns(string memory)
    {
        return "https://aqua-labour-toad-100.mypinata.cloud/ipfs/bafybeibh5apeajhvu2trongux2ggfrrhk77xts6iz33mihp44tm2vzo6qu/";
    }
     function _FlatDescription(uint256 FlatNo) public view returns (string memory)
    {
        require(FlatNo <10, "Flat does not exist");
        require(_ownerOf(FlatNo) != address(0), "Flat does not exist");
        return string(abi.encodePacked( FlatDescription(), FlatNo.toString(),".json"));
    }

     function FlatPlan () internal pure returns(string memory)
    {
        return "https://aqua-labour-toad-100.mypinata.cloud/ipfs/bafybeia36dgem7vc6tbtfrpt3vbluyhdsedol4lphjye54fnotm4rj6ljq/";
    }
    function _FlatPlan(uint256 FlatNo) public view returns (string memory)
    {
        require(FlatNo <10, "Flat does not exist");
        require(_ownerOf(FlatNo) != address(0), "Flat does not exist");
        return string(abi.encodePacked(FlatPlan(), FlatNo.toString(), ".png"));
    }

    function transfer_2BHK (address receiver, uint256 FlatNo) external {
       require(NumOfTokens[receiver]>=10, "You need 10 Tokens to claim this Flat");
       require(FlatNo<=4, "No such 2BHK flat exists");
       require(FlatLandLord[FlatNo] == address(0), "Already sold");
       address currentOwner = ownerOf(FlatNo);
      _transfer(currentOwner, receiver, FlatNo);
       FlatLandLord[FlatNo] = receiver;
       NumOfTokens[receiver]-=10;
       TotalTokens-=10;
       for (uint i = 0; i < AvailableFlats.length; i++) {
        if (AvailableFlats[i] == FlatNo) {
            AvailableFlats[i] = AvailableFlats[AvailableFlats.length - 1];
            AvailableFlats.pop();
            break;
        }
        
       }
       FlatsSold.push(FlatNo);

    }

    function transfer_3BHK (address receiver, uint256 FlatNo) external {
       require(NumOfTokens[receiver]>=12, "You need 12 Tokens to claim this 3BHK");
       require(FlatNo >4, "No such 3BHK flat exists");
       require(FlatLandLord[FlatNo] == address(0), "Already sold");
      address currentOwner = ownerOf(FlatNo);
      _transfer(currentOwner, receiver, FlatNo);
       FlatLandLord[FlatNo] = receiver;
       NumOfTokens[receiver]-=12;
       TotalTokens-=12;
       for (uint i = 0; i < AvailableFlats.length; i++) {
        if (AvailableFlats[i] == FlatNo) {
            AvailableFlats[i] = AvailableFlats[AvailableFlats.length - 1];
            AvailableFlats.pop();
            break;
        }
        
       }
       FlatsSold.push(FlatNo);

    }

    
    
    function _AvailableFlats() public view returns(uint256[] memory) {
        return AvailableFlats;
    }

    function _FlatsSold() public view returns(uint256[] memory) {
        return FlatsSold;
    }

    function checkFlats(uint256 FlatNo) public view returns (string memory) {
        for (uint i = 0; i < AvailableFlats.length; i++) {
            if (AvailableFlats[i] == FlatNo) {
                return "Available";
            }
        }
        return "sold";
    }

    mapping(address Investor => uint Amount) public RentCollected;
    uint256 balance = address(this).balance;
    function transferRent() public onlyOwner {

        uint256 amount = address(this).balance / TotalTokens;

        require(amount > 0, "No balance in contract");

        for(uint i =0; i<Investors.length; i++){

            address payable investor = payable(Investors[i]);

            (bool success, ) = investor.call{value: amount*(NumOfTokens[investor])}("");
            require(success, "Transfer failed");
            RentCollected[investor] += amount*(NumOfTokens[investor]);
        }
    }
    

    
}