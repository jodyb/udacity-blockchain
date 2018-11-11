
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
**Configure Star Registration Endpoint**
After configuring the Blockchain validation routine, you’ll configure the star registration endpoint. This will allow your application to accept users requests. In this section, we'll provide resources on how to do this effectively.

*URL*
This functionality should be made available at the following URL.
[http://localhost:8000/block](http://localhost:8000/block)

*Payload*
The payload delivered by the user requires the following fields.

-   `Requires address [Wallet address]`
-   `Requires star object with properties`
-   `right_ascension`
-   `declination`
-   `magnitude [optional]`
-   `constellation [optional]`
-   `star_story [Hex encoded Ascii string limited to 250 words/500 bytes]`
-   `JSON Response`
-   `block object`

*Example: Block with star object endpoint*
Post block with curl
```
curl -X "POST" "http://localhost:8000/block" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
  "star": {
    "dec": "-26° 29'\'' 24.9",
    "ra": "16h 29m 1.0s",
    "story": "Found star using https://www.google.com/sky/"
  }
}'
```
*JSON Response*
```
{
  "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
  "height": 1,
  "body": {
    "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
    "star": {
      "ra": "16h 29m 1.0s",
      "dec": "-26° 29' 24.9",
      "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f"
    }
  },
  "time": "1532296234",
  "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
}
```
**Configure Star Lookup - Search by Blockchain Wallet Address**
 *Details*

> -   Get endpoint with URL parameter for wallet address
> -   JSON Response
> -   Star block objects

*URL*

> [http://localhost:8000/stars/address:[ADDRESS]](http://localhost:8000/stars/address:[ADDRESS])

*Payload*

URL parameter with wallet address.

Example:  stars/address:[address] endpoint

*Get request with curl*
```
curl "http://localhost:8000/stars/address:142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ"
```

*Example: JSON response*
```
[
  {
    "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
    "height": 1,
    "body": {
      "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
      "star": {
        "ra": "16h 29m 1.0s",
        "dec": "-26° 29' 24.9",
        "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
        "storyDecoded": "Found star using https://www.google.com/sky/"
      }
    },
    "time": "1532296234",
    "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
  },
  {
    "hash": "6ef99fc533b9725bf194c18bdf79065d64a971fa41b25f098ff4dff29ee531d0",
    "height": 2,
    "body": {
      "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
      "star": {
        "ra": "17h 22m 13.1s",
        "dec": "-27° 14' 8.2",
        "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
        "storyDecoded": "Found star using https://www.google.com/sky/"
      }
    },
    "time": "1532330848",
    "previousBlockHash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f"
  }
]
```
**Configure Star Lookup - Search by Star Block Address**
Get endpoint with URL parameter for star block hash JSON Response

-   Star block object

*URL*
> [http://localhost:8000/stars/hash:[HASH]](http://localhost:8000/stars/hash:[HASH])

*Payload*
URL parameter with star block hash.

*Example:*  stars/hash:[hash] endpoint

*Get request with curl*
```
curl "http://localhost:8000/stars/hash:a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f"

```
*Example: JSON response*
```
{
  "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
  "height": 1,
  "body": {
    "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
    "star": {
      "ra": "16h 29m 1.0s",
      "dec": "-26° 29' 24.9",
      "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
      "storyDecoded": "Found star using https://www.google.com/sky/"
    }
  },
  "time": "1532296234",
  "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
}

```

[](https://classroom.udacity.com/nanodegrees/nd1309/parts/c4ecd959-25d3-46c3-91ba-e5d79c638a34/modules/f3c9547d-af90-44e2-a5f5-c1c6160a2b2b/lessons/532fc24f-cb8c-4b0b-9e8b-c0d125bf84b3/concepts/a302d909-09f5-49bb-8194-556e884350aa#)

**Configure Star Lookup - Search by Star Block Height**

#### Details

> -   Get endpoint with URL parameter for star block height
> -   JSON Response
> -   Star block object

#### URL

> [http://localhost:8000/block/[HEIGHT]](http://localhost:8000/block/[HEIGHT])

#### Payload

URL parameter with block height.

**Example:**  `stars/address:[address] endpoint`

#### Get request with curl

```
curl "http://localhost:8000/block/1"

```

#### Example: JSON response

```
{
  "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
  "height": 1,
  "body": {
    "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
    "star": {
      "ra": "16h 29m 1.0s",
      "dec": "-26° 29' 24.9",
      "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
      "storyDecoded": "Found star using https://www.google.com/sky/"
    }
  },
  "time": "1532296234",
  "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
}
```
