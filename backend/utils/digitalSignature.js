const docusign = require('docusign-esign');
const fs = require('fs');
const path = require('path');

const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY;
const secretKey = process.env.DOCUSIGN_SECRET_KEY;
const userId = process.env.DOCUSIGN_USER_ID;
const basePath = process.env.DOCUSIGN_BASE_PATH;
const redirectUri = process.env.DOCUSIGN_REDIRECT_URI;

exports.sendContractForSignature = async (contract, user) => {
  const dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(basePath);
  dsApiClient.setOAuthBasePath('account-d.docusign.com');

  // Authentication via JWT
  const results = await dsApiClient.requestJWTUserToken(
    integrationKey,
    userId,
    'signature',
    fs.readFileSync(path.resolve(__dirname, '../../private.key')),
    3600
  );

  const accessToken = results.body.access_token;

  dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);

  const envelopesApi = new docusign.EnvelopesApi(dsApiClient);
  const envelopeDefinition = makeEnvelope(contract, user);

  const resultsEnvelope = await envelopesApi.createEnvelope(user.accountId, { envelopeDefinition });
  return resultsEnvelope.envelopeId;
};

function makeEnvelope(contract, user) {
  let env = new docusign.EnvelopeDefinition();
  env.emailSubject = `Please sign this contract: ${contract.terms}`;

  // Add document
  const documentContent = Buffer.from(`
    Farmer: ${contract.farmerName}
    Buyer: ${contract.buyerName}
    Terms: ${contract.terms}
  `).toString('base64');

  const doc = new docusign.Document({
    documentBase64: documentContent,
    name: 'Contract', // Can be any string
    fileExtension: 'txt', // Can be any supported file extension
    documentId: '1'
  });

  env.documents = [doc];

  // Add signer
  const signer = docusign.Signer.constructFromObject({
    email: user.email,
    name: user.name,
    recipientId: '1',
    routingOrder: '1'
  });

  const signHere = docusign.SignHere.constructFromObject({
    documentId: '1',
    pageNumber: '1',
    recipientId: '1',
    tabLabel: 'SignHere',
    xPosition: '200',
    yPosition: '200'
  });

  signer.tabs = docusign.Tabs.constructFromObject({ signHereTabs: [signHere] });
  env.recipients = docusign.Recipients.constructFromObject({ signers: [signer] });

  env.status = 'sent'; // 'sent' to send the envelope immediately

  return env;
}

exports.getContractStatusFromDocuSign = async (envelopeId) => {
    const dsApiClient = new docusign.ApiClient();
    dsApiClient.setBasePath(basePath);
    dsApiClient.setOAuthBasePath('account-d.docusign.com');
  
    const results = await dsApiClient.requestJWTUserToken(
      integrationKey,
      userId,
      'signature',
      fs.readFileSync(path.resolve(__dirname, '../../private.key')),
      3600
    );
  
    const accessToken = results.body.access_token;
    dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);
  
    const envelopesApi = new docusign.EnvelopesApi(dsApiClient);
    const envelope = await envelopesApi.getEnvelope(userId, envelopeId);
  
    return envelope.status;
  };
  