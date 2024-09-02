const Contract = require('../models/Contract');
const { sendContractForSignature } = require('../utils/digitalSignature');

exports.createContract = async (req, res) => {
  try {
    const newContract = new Contract(req.body);
    await newContract.save();

    // Send contract to DocuSign for signature
    const envelopeId = await sendContractForSignature(newContract, req.user);
    newContract.docusignEnvelopeId = envelopeId;
    await newContract.save();

    res.status(201).json({ message: 'Contract created and sent for signature', contract: newContract });
  } catch (error) {
    res.status(500).json({ message: 'Error creating contract', error });
  }
};

exports.getContractStatus = async (req, res) => {
  const { envelopeId } = req.params;
  try {
    const status = await getContractStatusFromDocuSign(envelopeId);
    res.status(200).json({ status });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving contract status', error });
  }
};
