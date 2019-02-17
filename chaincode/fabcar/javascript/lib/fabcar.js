//ensure the Javascript is executed in strict mode
'use strict';

//array of allowable items to donate
const itemTypes = ["Electricity","Gas", "Groceries", "Cash"];

//array of allowable projects to donate to
const projectNames = ["IrishRedCross", "DisasterServicesCorporation", "StVincentDePaul"];

// Fabric smart contract class
const { Contract } = require('fabric-contract-api');

/*
 *  Smart Contract to manage donations to be spent on a particular item
 *  @extends Contract
 */
//TODO: consider splitting this into smaller files if its too big (as per Dr Bob guidelines) - see https://github.com/hyperledger/fabric-samples/blob/master/commercial-paper/organization/magnetocorp/contract/lib/papercontract.js
class ManageDonations extends Contract {

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        //No implementation required with this example
        console.log('Instantiate the contract');

        //TODO: initialise the balance to zero for every itemtype and project?
    }

    /*
     * Add a donation to a project.
     *
     * Note: projectName and itemType are verified to ensure they actually exist.
     *
     * @param {Context} ctx         the transaction context
     * @param {String}  projectName the name of a pre-existing project that relates to the donation to be added
     * @param {String}  itemType    the type of donation to be added
     * @param {Integer} amount      the monetary amount in cents (Euros currency). Note: we require the amount in cents to work around common floating point issues in javascript
     */
    async addDonation(ctx, projectName, itemType, amount) {

        console.info('============= START : addDonation ===========');

        //TODO: add call to a method to verify the project name

        //TODO: add call to a method to verify the item type

        //TODO: add call to a method to verify the amount is a valid monetary amount (i.e. integer greater than zero)

        //TODO: add a call to add the donation to the ledger
            //TODO: first get the current balance for the projectName & itemType
            //TODO: then add to it
        /*
        By design, the 'key' for the state will be a combination of properties that uniquely identify it in a given context - in this case the 'projectName' and 'amount'
        The state key allows us to uniquely identify a donation
        */
        //TODO: use 'const' here?
        const donation = {
            docType: 'donation',
            projectName,
            itemType,
            amount,
        };

        await ctx.stub.putState(projectName, Buffer.from(JSON.stringify(donation)));


        //TODO: need to ensure we include a timestamp in the transaction

        console.info('============= END : addDonation ===========');
    }

    async getDonation2(ctx) {
        console.log('Called getDonation2');
    }

    async getDonationsForProject(ctx, projectName) {
        console.log('Called getDonationsForProject');

        const donationAsBytes = await ctx.stub.getState(projectName);
        if (!donationAsBytes || donationAsBytes.length === 0) {
            throw new Error(`${projectName} does not exist`);
        }
        console.log(donationAsBytes.toString());
        return donationAsBytes.toString();
    }

}

//TODO: is this and why is this required?
module.exports = ManageDonations;
