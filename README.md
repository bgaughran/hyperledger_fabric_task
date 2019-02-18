# Hyperledger Fabric task details

```
Write an Hyperledger Fabric Chaincode to manage donations to be spent on a particular item.

Each transaction should include:
- Project Name
- Item Type
- Amount
- Timestamp

Chaincode should include the following functionality:
- `AddDonation(ProjectName, ItemType, Amount)`: to add a donation to a project. This should verify that ProjectName and ItemType actually exist.

Extra1: Add Documentation

Extra2: Add Unit tests

Write the Chaincode in NodeJS or GO.

Prepare a demo to show the chaincode running on Local Docker environment via CLI or Fabric SDK.
    
Your code deployment should be tracked on a public git repository on GitHub, and should include sufficient documentation/instructions to replicate. 

Follow good GIT practice to separate the development of each unit test.
```

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for demo & testing purposes

### 
TODO: highlight the main files for review? fabcar, test-fabcar, README.md, startFabric.sh

### Prerequisites - Things you need to install the HyperLedger Fabric environment

- install homebrew and check version using `brew -v`
- install cURL: `brew install curl` and check version using `curl -V`
- install Docker Community Edition (download from website) and check version using `docker -v` and `docker-compose -v` (Docker Compose comes with Docker)
- install Go: `brew install curl` and check version using `go version` and explicitly set 2 environment variables ($GOPATH and the 'bin' folder of your $GOPATH folder is in included in your $PATH):
    - `export GOPATH=$HOME/go`
    - `export PATH=$PATH:$GOPATH/bin`
    - check correct using `echo $GOPATH` and `echo $PATH`
- install NodeJS: `brew install node` and check version using `node -v` and confirm npm (comes with it) is installed `npm -v`
- install HyperLedger Fabric samples and binaries:
    - `cd ~/Desktop/` 
    - start Docker (in Mac, its simply a case of running the app)
    - `curl -sSL http://bit.ly/2ysbOFE | bash -s 1.4.0` (which will install them onto your desktop in a folder called 'fabric-samples', with the main binaries in your 'bin' folder)
    - as at 12/02/2019, one of the npm dependencies requires CommandLineTools installed on Mac (ref https://github.com/nodejs/node-gyp/issues/569)
        - `xcode-select --install` Install Command Line Tools if you haven't already.
        - `sudo xcode-select --switch /Library/Developer/CommandLineTools` Enable command line tools
- Deploying the network
    - `cd first-network`
    - run `./first-network/byfn.sh -h` script to show options on how to do this
    - run `./byfn.sh generate` to generate certs and the genesis block  in order to set up the network, the channel and the identities on the network where we will be making the transactions
    - run  `./byfn.sh up` will run the HyperLedger network (and set up some sample transactions)
    - note: run `./byfn.sh down` brings down the network and clears up the identities/peers and certificates. It also removes the `crypto-config` directory

### Installing the chaincode
- Note: Check docker is running on your machine
- `docker rm -f $(docker ps -aq)` - checks you have no active/stale Docker containers running
- `docker network prune` - clears any cached networks
- `docker rmi dev-peer0.org1.example.com-fabcar-1.0-5c906e402ed29f20260ae42283216aa75549c571e2e380f3615826365d8269ba` - clears out old chaincode
- `./startFabric.sh  javascript`- starts our Blockchain network and install and instantiate a NodeJS/GoLang version of the FabCar smart contract which will be used by our application to access the ledger
- `npm install grpc@1.14.2`  (in directory with package.json)
- `npm install` (in directory with package.json)
- `docker logs -f ca.example.com` - this creates a log of our Certificate authority example (logs requests and responses to the cert authority)
- `node enrollAdmin.js` - creates the admin user that can create users that can interact with the ledger. Note: it creates a directory called ‘wallet/admin’ with the user, public & private key. Every time we send a transaction to the ledger, the keys here will be used to sign those transactions to be considered valid on the blockchain. Once signed, the info will be sent to the chaincode, the chaincode will sign it with the correct info and then the Ledger will accept the transaction
- `node registerUser.js` - registers a user (once you have created the admin) who can interact with the ledger. Note: it updates the ‘wallet/admin’  with the new user and public/private keys

### Running the demo (shows how to get the chaincode running on the local Docker environment via Fabric SDK.)
- open a terminal to tail the logs of the chaincode installed in your docker image
    `docker ps` shows thew docker instances. Choose the ID running your chaincode, eg: af7cd027a5f2
    `docker logs af7cd027a5f -f` will tail the logs
TODO: show the current donations (first call should show no donations)....and show how to call script show ledger output
TODO: show adding a donation
TODO: show the added donation

## Unit tests
To ensure I could write unit tests of the 'addDonation' function in the chaincode, I used a Mock implementation of the 
fabric-shim stub [from this GitHub repository](https://github.com/wearetheledger/fabric-mock-stub) called ChaincodeMockStub.

Note: I could not find anything native within HyperLedger Fabric to provide a mock of 'fabric-shim'

### Installing the unit tests dependencies
- `npm install --global mocha` installs Mocha framework for running unit tests
- `npm install --global chai` installs Chai framework for running unit tests assertions
- `brew install yarn` installs yarn for ChaincodeMockStub dependency
- `cd tests` & run `yarn add @theledger/fabric-mock-stub --dev` installs the ChaincodeMockStub dependency. Note: install this in the directory running the tests

### Running the unit tests
- run `mocha tests/test-fabcar.js`
TODO: show output of the tests here

## Built With
TODO:....
* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

