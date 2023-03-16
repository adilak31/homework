const Web3 = require('web3')

const readline = require('readline-sync')

async function main() {

    let web3 = new Web3('http://127.0.0.1:7545')

    let key = readline.question("enter key: ")
    let password = readline.question("enter password: ")
    let recipient = readline.question("enter address recipient: ")
    let _value = readline.question("enter value: ")

    let sender = await web3.eth.personal.importRawKey(key,password)
    let key1 = "0x2e2b5d740f47208aafae0e13cb79d6e61d0eea63017fa07cd6cf5702763466ad"
    let password1 = "qwerty"
    let ganache = await web3.eth.personal.importRawKey(key1,password1)
    
    await web3.eth.personal.sendTransaction({
            from: ganache,
            to: sender.address,
            value: 10000000000000000000,
            gas: 53000
            },password).then(console.log)           
    
    await web3.eth.sendTransaction({
        from: sender,
        to: recipient,
        value: _value,
        gas:210000
    },password).then(console.log)

    await web3.eth.personal.unlockAccount(sender,password,10000)
    .then(console.log("Account unlock"))

    await web3.eth.sendTransaction({
        from: sender,
        to: recipient,
        value: _value,
        gas:210000
    },password).then(console.log)

    await web3.eth.personal.lockAccount(sender)
    .then(console.log("Account lock"))

     // 
     //1000000000000000000 1 eth

     //0xfd301056479E641b5c6211B6Fe006bF6E0d3194B
}
main()

    .then(() => process.exit(0))

    .catch((error) => {
        console.error(error);
        process.exit(1);
        }
    ); 