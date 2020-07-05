const docusign = require('docusign-esign')
const bodyParser = require('body-parser')
const express = require('express')
const process = require('process')
const path = require('path')
const fs = require('fs')
const mongoose = require('mongoose');
require('dotenv').config()

const port = process.env.PORT || 3000
const host = process.env.HOST || 'localhost'
const app = express()

const basePath = 'https://demo.docusign.net/restapi'
const envir = process.env;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse applicaiton/json
app.use(bodyParser.json())
console.log(envir, 'envir')

async function sendEnvelopeController(req, res) {
  const {email, user} = req.body

  console.log(req.body, 'body')
  console.log(email, 'email')
  console.log(user, 'user')

  if (!email) {
    console.log("No Email found in req.body")
    return res.status(400).json({"error": "no email found in req.body"})
  }

  if (!user) {
    console.log("No user found in req.body")
    return res.status(400).json({"error": "no user found in req.body"})
  }

  const qp = req.query;
  // Fill in these constants or use query parameters of ACCESS_TOKEN, ACCOUNT_ID, USER_FULLNAME, USER_EMAIL
  // or environment variables.

  console.log(envir, 'envir')
  const {ACCESS_TOKEN, ACCOUNT_ID } = envir

  const signerName = user;
  const signerEmail = email;

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
  const pdfBytes = fs.readFileSync(path.resolve(__dirname, fileName)),
    pdfBase64 = pdfBytes.toString('base64');

  // Create the document request object
  const doc = docusign.Document.constructFromObject({
    documentBase64: pdfBase64,
    fileExtension: 'pdf', // You can send other types of documents too.
    name: 'Sample document',
    documentId: '1',
  });

  // Create a documents object array for the envelope definition and add the doc object
  envDef.documents = [doc];

  // Create the signer object with the previously provided name / email address
  const signer = docusign.Signer.constructFromObject({
    name: signerName,
    email: signerEmail,
    routingOrder: '1',
    recipientId: '1',
  });

  // Create the signHere tab to be placed on the envelope
  const signHere = docusign.SignHere.constructFromObject({
    documentId: '1',
    pageNumber: '1',
    recipientId: '1',
    tabLabel: 'SignHereTab',
    xPosition: '195',
    yPosition: '147',
  });

  // Create the overall tabs object for the signer and add the signHere tabs array
  // Note that tabs are relative to receipients/signers.
  signer.tabs = docusign.Tabs.constructFromObject({signHereTabs: [signHere]});

  // Add the recipients object to the envelope definition.
  // It includes an array of the signer objects.
  envDef.recipients = docusign.Recipients.constructFromObject({
    signers: [signer],
  });
  // Set the Envelope status. For drafts, use 'created' To send the envelope right away, use 'sent'
  envDef.status = 'sent';

  // Send the envelope
  let envelopesApi = new docusign.EnvelopesApi(),
    results;

  try {
    results = await envelopesApi.createEnvelope(ACCOUNT_ID, {
      envelopeDefinition: envDef,
    });
  } catch (e) {
    let body = e.response && e.response.body;
    if (body) {
      // DocuSign API exception
      res.status(e.response.status).json(JSON.stringify({
        body,
      }))
    } else {
      // Not a DocuSign exception
      throw e;
    }
  }
  // Envelope has been created:
  if (results) {
    res.status(200).json(JSON.stringify({
      results
    }))
  }
}

// The mainline
app.post('/', sendEnvelopeController)
app.listen(port, host);
console.log(`Your server is running on ${host}:${port}`);
