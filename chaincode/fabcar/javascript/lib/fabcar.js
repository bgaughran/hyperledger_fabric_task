//ensures the Javascript is executed in strict mode
'use strict';

//array of allowable projects to donate to
const projectNames = ["IrishRedCross", "DisasterServicesCorporation", "StVincentsDePaul"];

//array of allowable item types to donate
const itemTypes = ["Electricity", "Gas", "Groceries", "Cash"];

//Fabric smart contract class
const { Contract } = require('fabric-contract-api');

/*
 *  Smart Contract to manage donations to be spent on a particular item
 *  @extends Contract
 */
class ManageDonations extends Contract {

    //constructor required to enable unit testing
    constructor(){
        super();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        //No implementation required with this example
        console.log('Instantiate the contract');
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

        if (!this.isValidProject(projectName)){
            console.log('Cannot add a donation to a project that does not exist: ' + projectName)
            throw new Error(`${projectName} does not exist`);
        }

        if (!this.isValidItemType(itemType)){
            console.log('Cannot add a donation to an item type that does not exist: ' + itemType)
            throw new Error(`${itemType} does not exist`);
        }

        if (!this.isValidAmount(amount)){
            console.log('Cannot add a donation with an invalid amount: ' + amount)
            throw new Error(`${amount} is an invalid amount`);
        }

        var key = this.createKey(projectName, itemType);

        /*
            Add to the existing donations if the key (project / item) exists.
            Otherwise, create the first donation for the key (project / item)
        */
        const donationAsBytes = await ctx.stub.getState(key); // get the donation from chaincode state
        if (!this.isKeyValid(donationAsBytes)){
            console.log('Key does not exist: ' + key)

            console.log('Creating a new project & item type key/value of value = ' +key);
            var donation = this.createDonationValueObject(projectName, itemType, amount);
            await ctx.stub.putState(key, Buffer.from(JSON.stringify(donation)));

        } else {
            console.log('Key exists: ' + key)
            var donation = JSON.parse(donationAsBytes.toString());

            console.log('Adding an amount of ' + amount + ' to the existing donation total of ' + donation.amount);
            donation.amount = this.incrementDonation(donation.amount, amount);

            console.log('Updating timestamp');
            donation.lastDonationTimeInMilliseconds = Date.now();

            await ctx.stub.putState(key, Buffer.from(JSON.stringify(donation)));
        }

        console.info('============= END : addDonation ===========');
    }

    isValidProject(projectName) {
        return projectNames.includes(projectName);
    }

    isValidItemType(itemType) {
        return itemTypes.includes(itemType);
    }

    isValidAmount(amount) {
       return Number(amount) > 0;
    }

    /*
     * Increment the amount by the donated amount
     */
    incrementDonation(currentAmount, amountToIncrement){
       return Number(currentAmount) + Number(amountToIncrement);
    }

    /*
     * Determine if the donation value returned indicates that the associated key is valid
     */
    isKeyValid(donationAsBytes){
        if (!donationAsBytes || donationAsBytes.length === 0) {
            return false;
        }

        return true;
    }

    /*
     * Create a key to use in ledger transactions
     *
     * By design, the 'key' for the state will be a combination of properties that uniquely identify it in a given context - in this case the 'projectName' and 'amount'
     * The state key allows us to uniquely identify a donation
     * TODO: as an improvement, it might be useful in the future to use the 'createCompositeKey' to allow each the project & itemType to be independently searchable
     */
    createKey(projectName, itemType){
        //NOTE: no validation added here given that the chaincode author defines the key elements
        return projectName + ':' + itemType;
    }

    /*
     * Create the donation value object to use in ledger transaction
     */
    createDonationValueObject(projectName, itemType, amount){
        //NOTE: no validation added here given that the chaincode author defines the key elements

        var lastDonationTimeInMilliseconds = Date.now();

        var donation =  {
            docType: 'donation',
            projectName,
            itemType,
            amount,
            lastDonationTimeInMilliseconds
        };

        return donation;
    }


    async getDonation(ctx, projectName, itemType) {
        console.log('Called getDonation');

        var key = this.createKey(projectName, itemType);
        var donationAsBytes = await ctx.stub.getState(key);

        if (!donationAsBytes || donationAsBytes.length === 0) {
            throw new Error(`${key} does not exist`);
        }

        console.log(donationAsBytes.toString());
        return donationAsBytes.toString();
    }

}

module.exports = ManageDonations;
