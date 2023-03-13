const Web3 = require('web3')

const readline = require('readline-sync')

async function main() {

    let web3 = new Web3('http://127.0.0.1:7545')
    let entropy = readline.question("enter string: ")
    let recipient = readline.question("enter recipient: ")
    let _value = readline.question("enter value: ")

    let sender = web3.eth.accounts.create(entropy)
    let wallet = web3.eth.accounts.wallet.create()
        web3.eth.accounts.wallet.add(sender)
    let password = "qwerty"
    let ganache = await web3.eth.personal.importRawKey("0x8f5d514fa006926e3074f7c9d32a3214305782de348df290bdfb1b81426e2645",
                    password)
    await web3.eth.sendTransaction({
            from: ganache,
            to: sender.address,
            value: 2000000000000000000,
            gas: 210000
         },password).then(console.log)
    await web3.eth.sendTransaction({
            from: sender.address,
            to: recipient,
            value: _value,
            gas:210000
         },sender.privateKey).then(console.log)         
    
 // qwertyuiopasdfghjklzxcvbnm123456 entropy
 //1000000000000000000 1 eth
}    
    main()

    .then(() => process.exit(0))

    .catch((error) => {
        console.error(error);
        process.exit(1);
        }
    ); 