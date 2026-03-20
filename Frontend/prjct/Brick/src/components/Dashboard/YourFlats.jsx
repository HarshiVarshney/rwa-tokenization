import React from 'react';

export default function YourFlats({ ownedFlats, rentOutFlat, setCurrentTab }) {
  return (
    <div className="your-flats">
      <div className="section-header">
        <h2>Your Flats</h2>
        <button onClick={() => setCurrentTab("marketplace")} className="view-all">
          Browse all flats →
        </button>
      </div>

      <div className="flats-carousel">
        {ownedFlats.length > 0 ? (
          ownedFlats.map(flat => (
            <div key={flat.id} className="flat-card">
              <img src={flat.image} alt={flat.type} className="flat-image" />
              <div className="flat-info">
                <div>
                  <div className="flat-type">{flat.type}</div>
                  <div className="flat-status owned">Owned</div>
                </div>
                {/*<button onClick={() => rentOutFlat(flat.id)} className="rent-out-btn">
                  Rent Out
                </button>*/}
              </div>
            </div>
          ))
        ) : (
          <div className="no-flats">Claim flats in Marketplace (requires 10/12 BRICK)</div>
        )}
      </div>
    </div>
  );
}