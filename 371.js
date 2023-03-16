const fs = require('fs')
const BigNumber = require('bigNumber.js')
const Web3 = require('web3')
const readline = require('readline-sync')

const web3 = new Web3 ('ws://127.0.0.1:7545')
// 0x4232d6887f3ec307045914b4cb8512841961710c27fd74805ca19fb0916e7534
async function main() {

    let key1 = readline.question("enter key: ")
    let key2 = "0xeb8c250fe96e21eefffab7acfef294d1b62f4b53b0403c2fe0fc93e014bb8603"

    let account1 = web3.eth.accounts.privateKeyToAccount(key1)
    let account2 = web3.eth.accounts.privateKeyToAccount(key2)

    let subscription = web3.eth.subscribe('pendingTransactions',
function(error, result){
    if (error) console.log(error);
    else console.log(result);
})
.on("data", function(transaction){
    console.log(transaction);
})
.on("error", function(error){
    console.log(error);
})

let tx = await web3.eth.accounts.signTransaction({
    from: account1.address,
    to: account2.address,
    gas: 3000000,
    value: 1_000_000_000_000_000_000
},key1)
await web3.eth.sendSignedTransaction(tx.rawTransaction)
.on('reciept', reciept => {
    console.log("first tx: ", reciept)
})

tx = await  web3.eth.accounts.signTransaction({
    from: account2.address,
    to: account1.address,
    gas: 3000000,
    value: 2_000_000_000_000_000_000
},key2)
await web3.eth.sendSignedTransaction(tx.rawTransaction)
.on('reciept', reciept => {
    console.log("second tx: ", reciept)
})

}

main()

    .then(() => process.exit(0))

    .catch((error) => {
        console.error(error);
        process.exit(1);
        }
    );    