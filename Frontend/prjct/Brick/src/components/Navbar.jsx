import React from 'react';

export default function Navbar({
  isConnected,
  walletAddress,
  currentTab,
  setCurrentTab,
  connectWallet
}) {
  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="logo">
          <div className="logo-icon">B</div>
          <span className="logo-text">BRICK</span>
        </div>

        {isConnected && (
          <div className="nav-links">
            <button
              onClick={() => setCurrentTab("dashboard")}
              className={`nav-btn ${currentTab === "dashboard" ? "active" : ""}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentTab("shop")}
              className={`nav-btn ${currentTab === "shop" ? "active" : ""}`}
            >
              Token Shop
            </button>
            <button
              onClick={() => setCurrentTab("marketplace")}
              className={`nav-btn ${currentTab === "marketplace" ? "active" : ""}`}
            >
              Flats
            </button>
            <button
              onClick={() => setCurrentTab("rent")}
              className={`nav-btn ${currentTab === "rent" ? "active" : ""}`}
            >
              Rent & Lease
            </button>
            <button
              onClick={() => setCurrentTab("governance")}
              className={`nav-btn ${currentTab === "governance" ? "active" : ""}`}
            >
              Governance
            </button>
          </div>
        )}

        {!isConnected ? (
          <button onClick={connectWallet} className="connect-btn">
            Connect Wallet
          </button>
        ) : (
          <div className="wallet-info">
            <div className="wallet-dot"></div>
            <span className="wallet-address">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
          </div>
        )}
      </div>
    </nav>
  );
}