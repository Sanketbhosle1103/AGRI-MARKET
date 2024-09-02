import React, { useState } from 'react';

function ContractForm({ createContract }) {
  const [contractDetails, setContractDetails] = useState({
    farmerName: '',
    buyerName: '',
    terms: '',
  });

  const handleChange = (e) => {
    setContractDetails({ ...contractDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createContract(contractDetails);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="farmerName"
        placeholder="Farmer Name"
        value={contractDetails.farmerName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="buyerName"
        placeholder="Buyer Name"
        value={contractDetails.buyerName}
        onChange={handleChange}
        required
      />
      <textarea
        name="terms"
        placeholder="Contract Terms"
        value={contractDetails.terms}
        onChange={handleChange}
        required
      ></textarea>
      <button type="submit">Create Contract</button>
    </form>
  );
}

export default ContractForm;
