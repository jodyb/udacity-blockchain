# Project 4: Build a Private Blockchain Notary Service

In this project, you'll build a Star Registry service that allows users to claim ownership of their favorite star in the night sky. To do this, you'll add functionality to the Web API you built in Project 3: Web Services. You'll connect this web service to your own private blockchain, allowing users to notarize ownership of a digital asset, in this case whichever star they choose.

## Why this project?
With this project you will demonstrate your ability to use Node.js Web API frameworks to notarize ownership of a digital asset by implementing algorithms to sign and verify messages.

Connecting a web API to a private blockchain is a huge first step toward developing web applications that are consumable by other web clients. This is an important way to reach users with your blockchain applications and is a core skill of any blockchain developer. Notarizing digital assets using wallet signatures and verifying them in code is a huge step to be able to implement production ready applications.

## What will I learn?
This project will combine various ideas and skills we’ve been practicing throughout the course as well as require you to solve new challenges you haven't quite seen before.

You’ll configure the blockchain to:
* Notarize ownership of a digital asset using message signatures and validation
* Accept user requests using registration endpoints
* Implement a mempool for the message queue
* Allow search by blockchain wallet address or by specific attribute (e.g.star block hash, star block height)

This project helps build on the skills you learned throughout Course 3: Web Services. You will apply these skills using real-world technologies to get hands-on with the tools used to create web API's.

## How does this help my career?
In this project, you’ll demonstrate creating and working with web APIs that notarizes ownership of a digital asset using message signatures and validation. To do so, you’ll demonstrate your understanding of many core blockchain concepts such as encoding and decoding transaction data, configuring your blockchain to handle wallet identities, and configuring your blockchain to properly handle user requests.

This project is a great step toward getting started as a blockchain developer. These skills are important whether it's for personal interest, to work on more complicated projects, or to use as a great portfolio item to show potential employers.

---
## Framework Used

[Sails.js | Realtime MVC Framework for Node.js](https://sailsjs.com/)

## Installation

Install dependent node packages

```
npm install
```

## Testing

Start the Sails application:

```
sails lift
```

**Validate User Request**
This signature proves the users blockchain identity. Upon validation of this identity, the user should be granted access to register a single star.

*URL*
This functionality should be made available at the following URL.
http://localhost:8000/requestValidation


*Example: requestValidation endpoint*
Here is an example post request using curl.
```
curl -X "POST" "http://localhost:8000/requestValidation" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{ "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ"}'
```
*Example: JSON response*
Your application will provide a JSON response to users. Here is an example of this response.
```
{
  "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
  "requestTimeStamp": "1532296090",
  "message": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ:1532296090:star Registry",
  "validationWindow": 300
}
```

**Allow User Message Signature**
After receiving the response, users will prove their blockchain identity by signing a message with their wallet. Once they sign this message, the application will validate their request and grant access to register a star.

*URL*
This functionality should be made available at the following URL.
http://localhost:8000/message-signature/validate

*Payload*
The payload delivered by the user requires the following fields.

* Wallet address
* Message signature

*Message Configuration*
Message for verification can be configured within the application logic from validation request.

```
[walletAddress]:[timeStamp]:starRegistry
```

*JSON Response*
```
Success/fail
```

*Example*
```
message-signature/validate endpoint
```

*Post validation with curl*
```
curl -X "POST" "http://localhost:8000/message-signature/validate" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
  "signature": "H6ZrGrF0Y4rMGBMRT2+hHWGbThTIyhBS0dNKQRov9Yg6GgXcHxtO9GJN4nwD2yNXpnXHTWU9i+qdw5vpsooryLU="
}'
```

*JSON Response Example*
```
{
  "registerStar": true,
  "status": {
    "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
    "requestTimeStamp": "1532296090",
    "message": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ:1532296090:starRegistry",
    "validationWindow": 193,
    "messageSignature": "valid"
  }
}
```
