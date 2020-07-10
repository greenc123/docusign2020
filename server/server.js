const docusign = require('docusign-esign');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const process = require('process');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const { PORT, HOST, DB, MONGO_INITDB_ROOT_USERNAME, MONGO_INITDB_ROOT_PASSWORD } = process.env;
const port = PORT || 3000;
const host = HOST || 'localhost';
const db = DB || 'localhost';
const app = express();

const basePath = 'https://demo.docusign.net/restapi';
const dbAuth = `${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}`;

// allow CORS
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse applicaiton/json
app.use(bodyParser.json());

(async () => {
  try {
    await mongoose.connect(`mongodb://${dbAuth}@${db}/`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  } catch (error) {
    console.error('Unable to connect to mongodb: ' + error);
    throw error;
  }
})();

const connection = mongoose.connection;

connection.once('open', function() {
  console.log('MongoDB database connection established successfully');
});

async function sendEnvelopeController(req, res) {
  const { email, user } = req.body;
  const errorMessages = [];

  if (!email) {
    errorMessages.push('No email found in req.body');
  }

  if (!user) {
    errorMessages.push('No user found in req.body');
  }

  if (errorMessages.length > 0) {
    return res.status(200).json(JSON.stringify({ errors: errorMessages }));
  }

  const { ACCESS_TOKEN, ACCOUNT_ID } = process.env;

  // The document you wish to send. Path is relative to the root directory of this repo.
  const fileName = 'demo_documents/World_Wide_Corp_lorem.pdf';

  /**
   *  The envelope is sent to the provided email address.
   *  One signHere tab is added.
   *  The document path supplied is relative to the working directory
   */
  const apiClient = new docusign.ApiClient();
  apiClient.setBasePath(basePath);
  apiClient.addDefaultHeader('Authorization', 'Bearer ' + ACCESS_TOKEN);
  // Set the DocuSign SDK components to use the apiClient object
  docusign.Configuration.default.setDefaultApiClient(apiClient);

  // Create the envelope request
  // Start with the request object
  const envDef = new docusign.EnvelopeDefinition();
  //Set the Email Subject line and email message
  envDef.emailSubject = 'Please sign this document sent from the Node example';
  envDef.emailBlurb = 'Please sign this document sent from the Node example.';

  // Read the file from the document and convert it to a Base64String
  const pdfBytes = fs.readFileSync(path.resolve(__dirname, fileName));
  const pdfBase64 = pdfBytes.toString('base64');

  // Create the document request object
  const doc = docusign.Document.constructFromObject({
    documentBase64: pdfBase64,
    fileExtension: 'pdf', // You can send other types of documents too.
    name: 'Sample document',
    documentId: '1'
  });

  // Create a documents object array for the envelope definition and add the doc object
  envDef.documents = [doc];

  // Create the signer object with the previously provided name / email address
  const signer = docusign.Signer.constructFromObject({
    email,
    name: user,
    routingOrder: '1',
    recipientId: '1'
  });

  // Create the signHere tab to be placed on the envelope
  const signHere = docusign.SignHere.constructFromObject({
    documentId: '1',
    pageNumber: '1',
    recipientId: '1',
    tabLabel: 'SignHereTab',
    xPosition: '195',
    yPosition: '147'
  });

  // Create the overall tabs object for the signer and add the signHere tabs array
  // Note that tabs are relative to receipients/signers.
  signer.tabs = docusign.Tabs.constructFromObject({signHereTabs: [signHere]});

  // Add the recipients object to the envelope definition.
  // It includes an array of the signer objects.
  envDef.recipients = docusign.Recipients.constructFromObject({
    signers: [signer]
  });
  // Set the Envelope status. For drafts, use 'created' To send the envelope right away, use 'sent'
  envDef.status = 'sent';

  // Send the envelope
  let envelopesApi = new docusign.EnvelopesApi();
  let results;

  try {
    results = await envelopesApi.createEnvelope(ACCOUNT_ID, {
      envelopeDefinition: envDef
    });
  } catch (e) {
    let body = e.response && e.response.body;
    if (body) {
      // DocuSign API exception
      return res.status(e.response.status).json(JSON.stringify({ body }));
    } else {
      // Not a DocuSign exception
      throw e;
    }
  }
  // Envelope has been created:
  if (results) {
    return res.status(200).json(JSON.stringify({ results }))
  }
}

const Employee = require("./model/demo");

async function saveEmployees(req, res) {
    console.log(req.body);
    Employee.insertMany(req.body, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
}

async function getEmployees(req, res) {
  Employee.find({}, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
}

// The mainline
app.get('/employees', getEmployees)
app.post('/employees', saveEmployees)
app.post('/', sendEnvelopeController)
app.listen(port, host);

console.log(`Your server is running on ${host}:${port}`);
