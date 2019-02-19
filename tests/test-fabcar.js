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

        it("Should be able to add & then get a donation", async () => {
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

            //verify the key does not exist
            var actualDonation;
            try {
                actualDonation = await chaincode.getDonation(stub, 'DisasterServicesCorporation', 'Gas');
            } catch(Error){ //we expect an error to be thrown
                expect(Transform.bufferToObject(actualDonation)).to.be.null

                //now add it
                await chaincode.addDonation(stub, 'DisasterServicesCorporation', 'Gas', 1);
                //now get it and check it exists
                actualDonation = await chaincode.getDonation(stub, 'DisasterServicesCorporation', 'Gas');
                expect(Transform.bufferToObject(actualDonation)).not.to.be.null;

            }
        });

        it("Check that it throws error when we try to add a donation for a project that is invalid", async () => {
             //TODO: figure out why the following code did not work
             //expect(async function () { await chaincode.addDonation(stub, 'BAD_PROJECT_NAME', 'Gas', 1); }).to.throw();  // Function expression

             //as an alternative approach, the following verifies the error was thrown
             var actualDonation;
             try {
                await chaincode.addDonation(stub, 'BAD_PROJECT_NAME', 'Gas', 1);
                actualDonation = await chaincode.getDonation(stub, 'BAD_PROJECT_NAME', 'Gas');
             } catch(Error) {} //we expect an error to be thrown

             expect(Transform.bufferToObject(actualDonation)).to.be.null;
         });

        it("Check that it throws error when we try to add a donation for an item type that is invalid", async () => {
             //TODO: figure out why the following code did not work
             //expect(async function () { await chaincode.addDonation(stub, 'DisasterServicesCorporation', 'BAD_ITEM_TYPE', 1) }).to.throw();  // Function expression

             //as an alternative approach, the following verifies the error was thrown
             var actualDonation;
             try {
                await chaincode.addDonation(stub, 'DisasterServicesCorporation', 'BAD_ITEM_TYPE', 1);
                actualDonation = await chaincode.getDonation(stub, 'DisasterServicesCorporation', 'BAD_ITEM_TYPE');
            } catch(Error) {} //we expect an error to be thrown

             expect(Transform.bufferToObject(actualDonation)).to.be.null;
         });

        it("Check that it throws error when we try to add a donation for an amount that is invalid", async () => {
             //TODO: figure out why the following code did not work
             //expect(async function () { await chaincode.addDonation(stub, 'DisasterServicesCorporation', 'Gas', -9999); }).to.throw();  // Function expression

             //as an alternative approach, the following verifies the error was thrown
             var actualDonation;
             try {
                await chaincode.addDonation(stub, 'DisasterServicesCorporation', 'Gas', -99999);
                actualDonation = await chaincode.getDonation(stub, 'DisasterServicesCorporation', 'Gas');
             } catch(Error) {} //we expect an error to be thrown

            expect(Transform.bufferToObject(actualDonation)).to.be.null;
         });
    });

    describe('Test ManageDonations.getDonation', () => {
       it("Check that it throws error when we try to get a donation for a project/item that are invalid", async () => {

            //TODO: figure out why the following code did not work
            //expect(async function () { await chaincode.getDonation(stub, 'BLAH', 'BLAH'); }).to.throw();  // Function expression

            //as an alternative approach, the following verifies the error was thrown
            var actualDonation;
            try {
                actualDonation = await chaincode.getDonation(stub, 'DisasterServicesCorporation', 'Gas');
            } catch(Error) {} //we expect an error to be thrown

            expect(Transform.bufferToObject(actualDonation)).to.be.null;
        });

    });

    describe('Test ManageDonations - helper methods', () => {

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

        it("Should be able to validate a project", async () => {

            expect(chaincode.isValidProject('DisasterServicesCorporation')).to.true;
            expect(chaincode.isValidProject('BAD_PROJECT_NAME')).to.false;
            expect(chaincode.isValidProject('')).to.false;
            expect(chaincode.isValidProject()).to.false;
            expect(chaincode.isValidProject(null)).to.false;

        });

        it("Should be able to validate an item", async () => {

            expect(chaincode.isValidItemType('Electricity')).to.true;
            expect(chaincode.isValidItemType('BAD_ITEM_TYPW')).to.false;
            expect(chaincode.isValidItemType('')).to.false;
            expect(chaincode.isValidItemType()).to.false;
            expect(chaincode.isValidItemType(null)).to.false;

        });

        it("Should be able to validate an amount", async () => {

            expect(chaincode.isValidAmount(1)).to.true;
            expect(chaincode.isValidAmount(99999999)).to.true;
            expect(chaincode.isValidAmount('')).to.false;
            expect(chaincode.isValidAmount()).to.false;
            expect(chaincode.isValidAmount(null)).to.false;
            expect(chaincode.isValidAmount(0)).to.false;
            expect(chaincode.isValidAmount(-1)).to.false;
            expect(chaincode.isValidAmount(-0000000)).to.false;

        });

        it("Should be able to increment the donation", async () => {

            expect(chaincode.incrementDonation(1,2)).to.equal(3);
            expect(chaincode.incrementDonation(2,1)).to.equal(3);
            expect(chaincode.incrementDonation(-1,1)).to.equal(0);
            expect(chaincode.incrementDonation(1,-1)).to.equal(0);
            expect(chaincode.incrementDonation()).to.be.NaN;
            expect(chaincode.incrementDonation('', 1)).to.equal(1);
            expect(chaincode.incrementDonation(1, '')).to.equal(1);
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


