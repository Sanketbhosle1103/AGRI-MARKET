import React from 'react';

function SignContract({ contractId, envelopeId }) {
  const handleSign = () => {
    window.location.href = `https://demo.docusign.net/Signing/startInSession.aspx?EnvelopeID=${envelopeId}&accountId=${process.env.REACT_APP_DOCUSIGN_ACCOUNT_ID}`;
  };

  return (
    <button onClick={handleSign}>
      Sign Contract
    </button>
  );
}

export default SignContract;
