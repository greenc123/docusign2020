require('dotenv').config();
const docusign = require('docusign-esign');
const envir = process.env;
var { DOCUSIGN_ACCESS_TOKEN, DOCUSIGN_ENDPOINT } = envir;


function configureDefaultDocuSignApiClient() {
  const accessToken = DOCUSIGN_ACCESS_TOKEN || '{ACCESS_TOKEN}';
  const apiClient = new docusign.ApiClient();
  apiClient.setBasePath(DOCUSIGN_ENDPOINT);
  apiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);
  // Set the DocuSign SDK components to use the apiClient object
  docusign.Configuration.default.setDefaultApiClient(apiClient);
  return apiClient;
};

configureDefaultDocuSignApiClient()

module.exports = docusign
