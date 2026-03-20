import React from 'react';

export default function FlatsMarketplace({ allFlats, claimFlat }) {
  return (
    <div className="marketplace">
      <h2 className="page-title">Flats Marketplace</h2>

      <div className="flats-grid">
        {allFlats.length > 0 ? (
          allFlats.map(flat => (
            <div key={flat.id} className="market-card">
              <img src={flat.image} alt={flat.type} className="market-image" />
              <div className="market-content">
                <div className="market-header">
                  <div>
                    <div className="market-type">{flat.type}</div>
                    <div className="market-owner">{flat.owner}</div>
                  </div>
                  <div className="market-price">
                    {flat.priceInBrick} <span className="brick-unit">BRICK</span>
                  </div>
                </div>

                <div className={`status-badge ${flat.status.toLowerCase()}`}>
                  {flat.status}
                </div>

                {flat.status === "Available" && (
                  <button onClick={() => claimFlat(flat.id)} className="claim-btn">
                    CLAIM FLAT
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", padding: "60px", color: "#666" }}>
            No flats minted yet.<br />
            Call Mint_2BHK() / Mint_3BHK() 5 times each from Remix as seller.
          </p>
        )}
      </div>
    </div>
  );
}