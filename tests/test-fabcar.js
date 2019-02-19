const ManageDonations  = require('../chaincode/fabcar/javascript/lib/fabcar.js');
const { ChaincodeMockStub, Transform } = require('@theledger/fabric-mock-stub');

//add ability to use Chai framework for assertions
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;

// get handle to the chaincode
const chaincode = new ManageDonations();

describe('Test ManageDonations', function(){
    var stub;

    //reset the stub before each test
    beforeEach(function(){
        stub = new ChaincodeMockStub("MyMockStub", chaincode);

        //set up the mock
        stub.mockTransactionStart();
    })

    describe('Test ManageDonations.addDonation', () => {

        it("Should be able to add & get a donation", async () => {
            //call method under test
            await chaincode.addDonation(stub, 'DisasterServicesCorporation', 'Gas', 1);

            //get the donation that was added
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

        it("Should ensure that the donation is incremented", async () => {

            //call method under test
            await chaincode.addDonation(stub, 'DisasterServicesCorporation', 'Gas', 1);
            await chaincode.addDonation(stub, 'DisasterServicesCorporation', 'Gas', 1);
            await chaincode.addDonation(stub, 'DisasterServicesCorporation', 'Gas', 1);

            //get the donation that was added
            const actualDonation = await chaincode.getDonation(stub, 'DisasterServicesCorporation', 'Gas');

            expect(Transform.bufferToObject(actualDonation).amount).to.equal(3);
        });

        it("Should add a key/value donation record where one did not exist before", async () => {

//            expect(async function () { await chaincode.getDonation(stub, 'DisasterServicesCorporation', 'Gas'); }).to.throw();  // Function expression

            //verify the key does not exist
//            const actualDonation = await chaincode.getDonation(stub, 'DisasterServicesCorporation', 'Gas');
//            expect(Transform.bufferToObject(actualDonation)).to.be.null;

            //now verify our chaincode creates one
//            await chaincode.addDonation(stub, 'DisasterServicesCorporation', 'Gas', 1);
//            actualDonation = await chaincode.getDonation(stub, 'DisasterServicesCorporation', 'Gas');
//            expect(Transform.bufferToObject(actualDonation)).to.be.null;


//            expect(getDonationFunction).to.throw(Error);
//            expect(async function () { await chaincode.getDonation(stub, 'DisasterServicesCorporation', 'Gas'); }).to.throw();  // Function expression


            //now check if a new key/value pair is added where one does not exist
//            const actualDonation = await chaincode.getDonation(stub, 'DisasterServicesCorporation', 'Gas');
//            expect(Transform.bufferToObject(actualDonation)).to.equal(0);

//            await chaincode.addDonation(stub, 'DisasterServicesCorporation', 'Gas', 1);

        });

    });

    //todo: check expected errors thrown in getDonation (and test getDonation explicitly)

    describe('Test ManageDonations - helper methods', () => {
        //todo: test rest of helper methods

        it("Should be able to check a key is valid", async () => {

            var exists = chaincode.isKeyValid(null);
            expect(exists).to.false;

            exists = chaincode.isKeyValid('');
            expect(exists).to.false;

            exists = chaincode.isKeyValid('anyKey');
            expect(exists).to.true;

        });

        it("Should be able to create a key correctly", async () => {

            const actualKey = chaincode.createKey('DisasterServicesCorporation', 'Gas');
            expect(actualKey).to.equal('DisasterServicesCorporation:Gas');

        });

        it("Should be able to create a value object correctly", async () => {

            const valueObject = chaincode.createDonationValueObject('DisasterServicesCorporation', 'Gas', 99);

            //assert the valueObject is correct (except timestamp whose value will change and cannot be asserted)
            expect(valueObject).to.deep.include({
                'docType': 'donation',
                'projectName': 'DisasterServicesCorporation',
                'itemType': 'Gas',
                'amount': 99,
            });

            //assert the time stamp of the donation was not null
            expect(valueObject.lastDonationTimeInMilliseconds).to.be.above(0);

        });
    });
});


