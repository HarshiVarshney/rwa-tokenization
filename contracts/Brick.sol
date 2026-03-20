// SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;

contract Brick  {

    address private Owner;
    string public TokenName;
    string public TokenSymbol;

    constructor() {
       TokenName = "BrickToken"; 
       TokenSymbol = "BRICK"; 
       Owner =msg.sender;
    }

    address[] public Investors;
    mapping(address investor =>uint256 amount) public NumOfTokens;
    uint256 public TokensSold = 0;

    function mintBrick() public payable {

        require(TokensSold<=110, "All tokens have been sold");
        require(msg.value >= 500000000000000, "Mininum 0.0005 ETH required to purchase a token");
        Investors.push(msg.sender);
        NumOfTokens[msg.sender] += msg.value/500000000000000;
        TokensSold += msg.value/500000000000000;
    }

    function withdrawETH() public onlyOwner{

        (bool callSuccess,) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Call failed");
   }

    modifier onlyOwner() {
        require(msg.sender == Owner, "Must be owner");
        _;
    }
}