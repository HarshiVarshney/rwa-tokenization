import React from 'react';

export default function RentCard({ userRentCollected }) {
  return (
    <div className="rent-card">
      <div className="rent-label">YOUR RENT COLLECTED (ETH)</div>
      <div className="rent-amount">{userRentCollected} ETH</div>
      <div className="rent-sub"></div>
    </div>
  );
}