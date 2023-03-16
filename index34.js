const Web3 = require('web3')

const readline = require('readline-sync')

async function main() {

    let web3 = new Web3('http://127.0.0.1:7545')
    
    let key = readline.question("enter key: ")
    let recipient = readline.question("enter recipient: ")
    let _value = readline.question("enter value: ")
    
    let password = "qwerty"
    let ganache = await web3.eth.personal.importRawKey("0x916eafee4e57056ffb4d181ad3b893f945c26055b6161d3fc4f428eee9859b2f",
                password)
    console.log("ganache: ", ganache)
    
    let sender = web3.eth.accounts.privateKeyToAccount(key)
    console.log("sender: ", sender)
    
    await web3.eth.getBalance(sender.address)
    .then((balance)=>{
        console.log("balance before transaction: ", balance)
    }) 
    
    await web3.eth.sendTransaction({
        from: ganache,
        to: sender.address,
        value: 2000000000000000000,
        gas: 210000
     },password).then(console.log)
    
     await web3.eth.getBalance(sender.address)
     .then((balance)=>{
        console.log("balance after transaction: ", balance)
     })
    
   let tx =  await web3.eth.accounts.signTransaction({
       to: recipient,
       value: _value,
       gas:210000
    },sender.privateKey)
    console.log(tx)

    await web3.eth.sendSignedTransaction(tx.rawTransaction)
       .on("receipt",console.log)
    
    await web3.eth.getBalance(sender.address)
      .then((balance)=>{
        console.log("balance after all operation: ", balance)
    }) 


    //0x08EFBB0319Ad744604822fBcACb0D64eBaf06901 
    //2000000000000000000
   // 1000000000000000000 
  //0x08EFBB0319Ad744604822fBcACb0D64eBaf06901 
  // 0xc7a3b96eaece486561303e35beea7994f15f6017d8cc973ce6846e9a035bd9ed
  //  0xc7a3b96eaece486561303e35beea7994f15f6017d8cc973ce6846e9a035bd9ed key

   //99999579999000000000
  //119999579999000000000

}
main()

    .then(() => process.exit(0))

    .catch((error) => {
        console.error(error);
        process.exit(1);
        }
    );