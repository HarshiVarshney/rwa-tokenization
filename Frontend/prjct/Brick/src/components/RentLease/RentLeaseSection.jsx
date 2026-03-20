import React from 'react';

export default function RentLeaseSection({ availableFlats, rentOutFlat }) {
  return (
    <div className="rent-page">
      <div className="rent-card-full">
        <h2>Rent</h2>
        <div className="owner-section">
          <div className="section-title">AS TENANT</div>
          {availableFlats.length > 0 ? (
            availableFlats.map(f => (
              <div key={f} className="lease-row">
                <span> Flat {f}</span>
                <button onClick={() => rentOutFlat(f)} className="lease-btn">
                  Pay Rent (0.0001 / 0.0012 ETH)
                </button>
              </div>
            ))
          ) : (
            <p className="empty-text">No Flat available for Rent.</p>
          )}
        </div>

      </div>
    </div>
  );
}
