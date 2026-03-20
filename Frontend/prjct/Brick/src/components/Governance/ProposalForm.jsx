import React from 'react';

export default function ProposalForm({ newProposalDesc, setNewProposalDesc, createProposal }) {
  return (
    <div className="proposal-form">
      <input
        type="text"
        value={newProposalDesc}
        onChange={e => setNewProposalDesc(e.target.value)}
        placeholder="Enter proposal description..."
        className="proposal-input"
      />
      <button onClick={createProposal} className="create-proposal-btn">
        Create Proposal
      </button>
    </div>
  );
}