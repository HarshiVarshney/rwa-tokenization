// SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;

contract LeaseAgreement {

    mapping(uint256 FlatNo => address Tenant) public _2BHKTenants;
    mapping(uint256 FlatNo => address Tenant) public _3BHKTenants;
    mapping(uint256 FlatNo => address LandLord) internal FlatLandLord;
    uint256[] private _FlatsAvailableForRent = [0,1, 2, 3, 4, 5, 6, 7, 8, 9];
    uint256[] private _FlatsRented;

    address private Owner;

    constructor() {
        Owner = msg.sender;
    }

    function _2BHKForLease (address Tenant, uint256 FlatNo) public payable {
       require(FlatLandLord[FlatNo] == address(0), "SPV does not own this flat, please pay your land lord");
       require(msg.value == 1000000000000000000, "Please pay 1 ether for rent");
       require(FlatNo>=0 && FlatNo<=4, "No such 2BHK flat exists");
       require(_2BHKTenants[FlatNo] == address(0), "Flat is already rented");
       _2BHKTenants[FlatNo] = Tenant;
       for (uint i = 0; i < _FlatsAvailableForRent.length; i++) {
        if (_FlatsAvailableForRent[i] == FlatNo) {
            _FlatsAvailableForRent[i] = _FlatsAvailableForRent[_FlatsAvailableForRent.length - 1];
            _FlatsAvailableForRent.pop();
            break;
        }
        
       }
       _FlatsRented.push(FlatNo);

    }

    function _3BHKForLease (address Tenant, uint256 FlatNo) public payable {
       require(FlatLandLord[FlatNo] == address(0), "SPV does not own this flat, please pay your land lord");
       require(msg.value == 1200000000000000000, "Please pay 1.2 ether for rent");
       require(FlatNo>4 && FlatNo<10, "No such 3BHK flat exists");
       require(_3BHKTenants[FlatNo] == address(0), "Flat is already rented");
       _3BHKTenants[FlatNo] = Tenant;
       for (uint i = 0; i < _FlatsAvailableForRent.length; i++) {
        if (_FlatsAvailableForRent[i] == FlatNo) {
            _FlatsAvailableForRent[i] = _FlatsAvailableForRent[_FlatsAvailableForRent.length - 1];
           _FlatsAvailableForRent.pop();
            break;
        }
        
       }
       _FlatsRented.push(FlatNo);

    }

    function CollectRent() public only_Owner{

        (bool callSuccess,) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Call failed");
   }

    modifier only_Owner() {
        require(msg.sender == Owner, "Must be owner");
        _;
    }

    function FlatsAvailableForRent() public view returns(uint256[] memory) {
        return _FlatsAvailableForRent;
    }

    function FlatsRented() public view returns(uint256[] memory) {
        return _FlatsRented;
    }

}