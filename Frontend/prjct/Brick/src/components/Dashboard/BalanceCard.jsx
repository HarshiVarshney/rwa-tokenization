import React from 'react';

export default function BalanceCard({ displayBalance, brickBalance, tokensSold }) {
  return (
    <div className="balance-card">
      <div className="balance-label">YOUR BRICK BALANCE</div>
      <div className="balance-number">{displayBalance}</div>
      <div className="balance-symbol">BRICK</div>
      <div className="eth-value">≈ {(brickBalance * 0.0005).toFixed(4)} ETH</div>

      <div className="progress-container">
        <div className="progress-label">Total Supply: {tokensSold} / 110</div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(tokensSold / 110) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}