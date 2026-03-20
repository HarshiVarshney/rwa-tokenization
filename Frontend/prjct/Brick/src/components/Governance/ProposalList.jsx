import React from 'react';

export default function ProposalList({ proposals, voteProposal }) {
  return (
    <div className="proposals-list">
      {proposals.map(prop => {
        const daysLeft = Math.max(0, Math.floor((prop.deadline - Date.now() / 1000) / 86400));
        const percent = Math.min(100, Math.round((prop.votes / 110) * 100));

        return (
          <div key={prop.id} className="proposal-card">
            <div className="proposal-left">
              <div className="proposal-desc">{prop.description}</div>
              <div className="proposal-meta">
                {daysLeft} days left • {percent}% support
              </div>
            </div>

            <div className="proposal-right">
              <div className="votes-big">{prop.votes}</div>
              <div className="votes-label">votes</div>
              <button onClick={() => voteProposal(prop.id)} className="vote-btn">
                VOTE
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}