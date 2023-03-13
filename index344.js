const Web3 = require('web3')

const readline = require('readline-sync')

async function main() {
    
    let web3 = new Web3('http://127.0.0.1:7545')
    
    let password = readline.question("enter password: ")
    let recipient = readline.question("enter recipient: ")
    let _value = readline.question("enter value: ")

    let sender = await web3.eth.personal.newAccount(password)

    let password2 = "qwerty"
    let ganache = await web3.eth.personal.importRawKey("0x8f088ffb5106ff74a64c1ab4f402011ddc4cd53e00032e6a7c44234f2ee402bf",
                    password2)
    
    await web3.eth.sendTransaction({
        from: ganache,
        to: sender,
        value: 2000000000000000000,
        gas: 210000
        },password2).then(console.log) 
        
    await web3.eth.personal.sendTransaction({
        from: sender,
        to: recipient,
        value: _value,
        gas:210000
        },password).then(console.log)   

        //2000000000000000000
        //1000000000000000000 
        //3000000000000000000
}
main()

    .then(() => process.exit(0))

    .catch((error) => {
        console.error(error);
        process.exit(1);
        }
    );
