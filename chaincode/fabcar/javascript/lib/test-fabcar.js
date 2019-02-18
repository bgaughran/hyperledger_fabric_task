const ManageDonations  = require('./fabcar.js');
const { ChaincodeMockStub, Transform } = require('@theledger/fabric-mock-stub');

//add ability to use Chai framework for assertions
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;

// get handle to the chaincode
const chaincode = new ManageDonations();

describe('Test ManageDonations', () => {

    it("Should be able to add donation", async () => {
        const stub = new ChaincodeMockStub("MyMockStub", chaincode);

        //set up the mock
        stub.mockTransactionStart();

        //call method under test
        await chaincode.addDonation(stub, 'DisasterServicesCorporation', 'Gas', 1);

        //get the donation was added
        const actualDonation = await chaincode.getDonation(stub, 'DisasterServicesCorporation', 'Gas');

        //assert the donation was correct (except timestamp whose value will change and cannot be asserted)
        expect(Transform.bufferToObject(actualDonation)).to.deep.include({
            'docType': 'donation',
            'projectName': 'DisasterServicesCorporation',
            'itemType': 'Gas',
            'amount': 1,
        });

        //assert the time stamp of the donation was not null
        expect(Transform.bufferToObject(actualDonation).lastDonationTimeInMilliseconds).to.be.above(0);

    });

});

//TODO:add test for all methods

