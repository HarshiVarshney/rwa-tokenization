import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';

import { CONTRACT_ADDRESS, CONTRACT_ABI } from './constants/contract';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BalanceCard from './components/Dashboard/BalanceCard';
import RentCard from './components/Dashboard/RentCard';
import YourFlats from './components/Dashboard/YourFlats';
import TokenShop from './components/Shop/TokenShop';
import FlatsMarketplace from './components/Marketplace/FlatsMarketplace';
import RentLeaseSection from './components/RentLease/RentLeaseSection';
import ProposalForm from './components/Governance/ProposalForm';
import ProposalList from './components/Governance/ProposalList';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [brickBalance, setBrickBalance] = useState(0);
  const [displayBalance, setDisplayBalance] = useState(0);
  const [tokensSold, setTokensSold] = useState(0);
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [proposals, setProposals] = useState([]);
  const [newProposalDesc, setNewProposalDesc] = useState("");
  const [contractInstance, setContractInstance] = useState(null);
  const [rentTicker, setRentTicker] = useState(12480);
  const [ownedFlats, setOwnedFlats] = useState([]);
  const [allFlats, setAllFlats] = useState([]);
  const [userRentCollected, setUserRentCollected] = useState(0);
  const [availableFlats, setAvailableFlats] = useState([]);
  

  const threeRef = useRef(null);

  // Animated balance counter
  useEffect(() => {
    let start = displayBalance;
    const target = brickBalance;
    const duration = 800;
    const step = (target - start) / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      setDisplayBalance(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [brickBalance]);

  useEffect(() => {
  const loadAvailableFlats = async () => {
    if (!contractInstance) return;

    try {
      const flats = await contractInstance.FlatsAvailableForRent();
      console.log("Available flats:", flats);

      setAvailableFlats(flats.map(f => Number(f)));
    } catch (e) {
      console.error("Error loading flats:", e);
    }
  };

  loadAvailableFlats();

  }, [contractInstance]);

  // Rent ticker animation (fake)
  useEffect(() => {
    const interval = setInterval(
      () => setRentTicker(p => p + Math.floor(Math.random() * 45) + 15),
      2800
    );
    return () => clearInterval(interval);
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      setContractInstance(contract);
      setWalletAddress(address);
      setIsConnected(true);

      // Brick data
      const bal = await contract.NumOfTokens(address);
      setBrickBalance(Number(bal));

      const sold = await contract.TokensSold();
      setTokensSold(Number(sold));

      // Rent
      const rent = await contract.RentCollected(address);
      setUserRentCollected(Number(rent));

      // Proposals
      const loaded = [];
      for (let i = 0; i < 8; i++) {
        try {
          const p = await contract.Proposals(i);
          loaded.push({
            id: i,
            description: p[0],
            votes: Number(p[1]),
            deadline: Number(p[2])
          });
        } catch (_) {
          break;
        }
      }
      setProposals(
        loaded.length
          ? loaded
          : [{
              id: 0,
              description: "Renovate lobby and add rooftop gym?",
              votes: 82,
              deadline: Math.floor(Date.now() / 1000) + 86400 * 4
            }]
      );

      await loadAllFlats(contract, address);
    } catch (err) {
      console.error(err);
      alert("Connection failed. Check contract address & deployment.");
    }
  };

  const loadAllFlats = async (contract, wallet) => {
  try {
    const flatList = [];
    const ownedList = [];

    const seller = await contract.seller();
    const user = wallet.toLowerCase();
    const sellerAddr = seller.toLowerCase();

    for (let fid = 0; fid < 10; fid++) {
      try {
        const ownerAddr = (await contract.ownerOf(fid)).toLowerCase();

        const is2BHK = fid <= 4;
        const price = is2BHK ? 10 : 12;

        const flat = {
          id: fid,
          type: is2BHK ? "2BHK" : "3BHK",
          priceInBrick: price,
          status:
            ownerAddr === sellerAddr
              ? "Available"
              : ownerAddr === user
              ? "Owned"
              : "Sold",
          image: is2BHK
            ? `https://aqua-labour-toad-100.mypinata.cloud/ipfs/bafybeia36dgem7vc6tbtfrpt3vbluyhdsedol4lphjye54fnotm4rj6ljq/0.png`
            : `https://aqua-labour-toad-100.mypinata.cloud/ipfs/bafybeia36dgem7vc6tbtfrpt3vbluyhdsedol4lphjye54fnotm4rj6ljq/5.png`,
          owner:
            ownerAddr === user
              ? "You"
              : ownerAddr.slice(0, 6) + "..." + ownerAddr.slice(-4)
        };

        flatList.push(flat);

        if (ownerAddr === user) {
          ownedList.push(flat);
        }

      } catch (e) {
        console.log(`Skipping token ${fid}:`, e.message);
      }
    }

    setAllFlats(flatList);
    setOwnedFlats(ownedList);

  } catch (e) {
    console.log("Flats loading error:", e);
  }
};

  const buyTokens = async () => {
    if (!contractInstance) return;
    const qty = parseInt(document.getElementById("tokenQty").value) || 1;
    try {
      const value = ethers.parseEther((0.0005 * qty).toString());
      const tx = await contractInstance.mintBrick({ value });
      await tx.wait();
      alert(`✅ ${qty} BRICK tokens minted!`);

      const newBal = await contractInstance.NumOfTokens(walletAddress);
      setBrickBalance(Number(newBal));

      const newSold = await contractInstance.TokensSold();
      setTokensSold(Number(newSold));

      await loadAllFlats(contractInstance, walletAddress);
    } catch (e) {
      alert("TX failed: " + e.message);
    }
  };

  const createProposal = async () => {
    if (!contractInstance || !newProposalDesc) return;
    try {
      const tx = await contractInstance.CreateProposal(newProposalDesc);
      await tx.wait();
      alert("✅ Proposal created!");
      setNewProposalDesc("");

      const fresh = [];
      for (let i = 0; i < 8; i++) {
        try {
          const p = await contractInstance.Proposals(i);
          fresh.push({
            id: i,
            description: p[0],
            votes: Number(p[1]),
            deadline: Number(p[2])
          });
        } catch (_) {
          break;
        }
      }
      setProposals(fresh);
    } catch (e) {
      alert(e.message);
    }
  };

  const voteProposal = async (id) => {
    if (!contractInstance) return;
    try {
      const tx = await contractInstance.Vote(id);
      await tx.wait();
      alert(`✅ Voted! (weight = ${brickBalance})`);

      setProposals(prev =>
        prev.map(p =>
          p.id === id ? { ...p, votes: p.votes + brickBalance } : p
        )
      );
    } catch (e) {
      alert(e.message.includes("already voted") ? "Already voted." : e.message);
    }
  };

  const claimFlat = async (flatId) => {
    if (!contractInstance) {
        alert("Please connect wallet first");
        return;
    }

    const flat = allFlats.find(f => f.id === flatId);
    if (!flat) {
        alert("Flat not found");
        return;
    }

    if (flat.status !== "Available") {
        alert("This flat is no longer available");
        return;
    }

    if (brickBalance < flat.priceInBrick) {
        alert(`You need ${flat.priceInBrick} BRICK tokens to claim this flat`);
        return;
    }

    try {
        let tx;

        if (flatId <= 4) {
            
            tx = await contractInstance.transfer_2BHK(walletAddress, flatId);
        } else {
            
            tx = await contractInstance.transfer_3BHK(walletAddress, flatId);
        }

        alert("Transaction sent... waiting for confirmation");

        const receipt = await tx.wait();
        console.log("Claim confirmed in block:", receipt.blockNumber);

        alert(`Success! Flat #${flatId} is now yours.\nTokens were transferred to the project owner.`);

        
        await loadAllFlats(contractInstance, walletAddress);

    } catch (err) {
        console.error("Claim error:", err);

        if (err.reason) {
            alert("Transaction reverted: " + err.reason);
        } else if (err.message.includes("Not enough BRICK")) {
            alert("Not enough BRICK tokens (contract check failed)");
        } else if (err.message.includes("This flat is no longer available")) {
            alert("Flat already claimed by someone else");
        } else {
            alert("Claim failed: " + (err.shortMessage || err.message));
        }
    }
};

  const rentOutFlat = async (flatId) => {

    if (!contractInstance) return;
    const is2BHK = flatId <= 4;
    const fee = is2BHK ? ethers.parseEther("0.0001") : ethers.parseEther("0.0012");
    console.log(fee);
    try {
      const tx = is2BHK
        ? await contractInstance._2BHKForLease(walletAddress, flatId, {value : fee})
        : await contractInstance._3BHKForLease(walletAddress, flatId, {value : fee});

      await tx.wait();
      alert(`📤 Flat #${flatId} leased!`);
      await loadAllFlats(contractInstance, walletAddress);
    } catch (e) {
      alert("Lease failed (check contract rules): " + e.message);
    }
  };

  return (
    <div className="app">
      <Navbar
        isConnected={isConnected}
        walletAddress={walletAddress}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        connectWallet={connectWallet}
      />

      {!isConnected && <Hero connectWallet={connectWallet} threeRef={threeRef} />}

      {isConnected && (
        <div className="main-app">
          {currentTab === "dashboard" && (
            <div className="dashboard">
              <BalanceCard
                displayBalance={displayBalance}
                brickBalance={brickBalance}
                tokensSold={tokensSold}
              />
              <RentCard userRentCollected={userRentCollected} />
              <YourFlats
                ownedFlats={ownedFlats}
                rentOutFlat={rentOutFlat}
                setCurrentTab={setCurrentTab}
              />
            </div>
          )}

          {currentTab === "shop" && (
            <TokenShop buyTokens={buyTokens} tokensSold={tokensSold} />
          )}

          {currentTab === "marketplace" && (
            <FlatsMarketplace allFlats={allFlats} claimFlat={claimFlat} />
          )}

          {currentTab === "rent" && (
            <RentLeaseSection availableFlats={availableFlats} rentOutFlat={rentOutFlat} />
          )}

          {currentTab === "governance" && (
            <div className="governance">
              <div className="gov-header">
                <div>
                  <h2>Governance Hub</h2>
                  <p>Vote with your BRICK balance</p>
                </div>
                <ProposalForm
                  newProposalDesc={newProposalDesc}
                  setNewProposalDesc={setNewProposalDesc}
                  createProposal={createProposal}
                />
              </div>

              <ProposalList proposals={proposals} voteProposal={voteProposal} />
            </div>
          )}
        </div>
      )}

      <footer className="footer">
        Built for SPV-based building tokenization • BlockShare Contract Connected • 2026
      </footer>
    </div>
  );
}

export default App;
