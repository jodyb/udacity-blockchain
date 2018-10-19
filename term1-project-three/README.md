# Term One -  Project 3: RESTful Web API with Node.js Framework

## Project Introduction
Your next challenge is to build a RESTful API using a Node.js framework that will interfaces with the private blockchain By configuring an API for your private blockchain you expose functionality that can be consumed by several types of web clients ranging from desktop, mobile, and IoT devices. For your next project, you will be creating a RESTful web API for your private blockchain. The API project will require two endpoints:

* GET block
* POST block

## Why this project?
This project introduces you to the fundamentals of web APIs with Node.js frameworks. Using your own private blockchain to create a web API is a huge first step toward developing your own web applications that are consumable by a variety of web clients. Later in this program, you’ll be programming blockchain technologies that utilize these similar features using smart contracts.

## What will I learn?
You will learn to create and manage a web API with a Node.js framework to interact with your private blockchain. You’ll get first hand experience generating API endpoints and configuring the endpoints response that can be consumable by many types of web clients. This project helps build on the skills you’ve learned so far an allow you to apply these skills using real world technologies to get hands on with the tools used to create web APIs.

## How does this help my career?
Understanding web APIs and ways to create them will help you build user applications later in the program. These applications will serve as great portfolio items for potential employers.

---
## Framework Used

[Sails.js | Realtime MVC Framework for Node.js](https://sailsjs.com/)

## API Endpoints

# GET Block Endpoint

URL
http://localhost:8000/block/[blockheight]

Example URL path:
http://localhost:8000/block/0, where '0' is the block height.

Response
The response for the endpoint should provide block object is JSON format.

Example GET Response
For URL, http://localhost:8000/block/0

HTTP/1.1 200 OK
content-type: application/json; charset=utf-8
cache-control: no-cache
content-length: 179
accept-ranges: bytes
Connection: close          
{"hash":"49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3","height":0,"body":"First block in the chain - Genesis block","time":"1530311457","previousBlockHash":""}

# POST Block Endpoint

Post a new block with data payload option to add data to the block body. The block body should support a string of text. The response for the endpoint should provide block object in JSON format.

Response
The response for the endpoint should provide block object in JSON format.

Example POST response
For URL: http://localhost:8000/block

HTTP/1.1 200 OK
content-type: application/json; charset=utf-8
cache-control: no-cache
content-length: 238
Connection: close
{"hash":"ffaffeb2330a12397acc069791323783ef1a1c8aab17ccf2d6788cdab0360b90","height":1,"body":"Testing block with test string data","time":"1531764891","previousBlockHash":"49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"}
