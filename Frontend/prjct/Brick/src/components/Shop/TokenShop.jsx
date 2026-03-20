import React from 'react';

export default function TokenShop({ buyTokens, tokensSold }) {
  return (
    <div className="shop-page">
      <div className="shop-card">
        <h2>Buy BRICK Tokens</h2>
        <p className="shop-desc">0.0005 ETH per token • Max 110 tokens total</p>

        <div className="input-group">
          <label>Number of tokens</label>
          <input type="number" id="tokenQty" min="1" max="110" defaultValue="1" className="qty-input" />
        </div>

        <button onClick={buyTokens} className="buy-btn">
          BUY NOW • Pay with ETH
        </button>

        <div className="sold-progress">Progress: {tokensSold}/110 sold</div>
      </div>
    </div>
  );
}