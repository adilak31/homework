const fs = require('fs')
const solc = require('solc')
const Web3 = require('web3')
const readline = require('readline-sync')
function myCompiler(solc, fileName, contractName, contractCode){
    //настраиваем структуру input для компилятора
    let input = {
        language: 'Solidity',
        sources: {
            [fileName]: {
            content: contractCode
        }
        },
        settings: {
            outputSelection: {
                '*': {
                   '*': ['*']
                }
            }
        }
    }
    let output = JSON.parse(solc.compile(JSON.stringify(input)));
    // console.log("Compilation result: ", output.contracts[fName])
    let ABI = output.contracts[fName][contractName].abi
    let bytecode = output.contracts[fName][contractName].evm.bytecode.object
    fs.writeFileSync(__dirname + '//' + contractName + '.abi', JSON.stringify(ABI))
    fs.writeFileSync(__dirname + '//' + contractName + '.bin', bytecode)
}

let fName = "credit.sol"

let cName = "Credit"
// считаем код контракта из файла
let cCode = fs.readFileSync(__dirname + '//' + fName, 'utf-8')
console.log(cCode)



try{
    myCompiler(solc, fName, cName, cCode)
} catch(err){
    console.log(err)
    // выбор компилятора
    let solcx = solc.setupMethods(require('./soljson-v0.8.15+commit.e14f2714'))

    let compileVersion = "v0.8.15+commit.e14f2714"
    solc.loadRemoteVersion(compileVersion, (err, solcSnapshot) => {
        if(err){
            console.log(err)
        }else{
            myCompiler(solcSnapshot, fName, cName, cCode)
        }
    })
}
async function main() {
    
    let web3 = new Web3('ws://127.0.0.1:7545')

    let account = web3.eth.accounts.privateKeyToAccount("0xd1866d6bc92d36d40c37eecd89ab06a39113bf96e23689e86e5f6c303b22e191")
    let ABI = JSON.parse(fs.readFileSync(__dirname + '//' + 'Credit.abi', 'utf-8'))
    let bytecode = fs.readFileSync(__dirname + '//' + 'Credit.bin', 'utf-8')
   

    let myContract = new  web3.eth.Contract(ABI)
    let persent = 2
    

    await myContract.deploy({
        data: bytecode,
        arguments: [persent]
    }).send({
        from: account.address,
        gas: 3000000,
        value: 1_000_000_000_000_000_000
    }).on('receipt',(receipt)=>{
       console.log(receipt)
    })
    .then(function(newContractInstance){
       myContract = newContractInstance
    }    
    )

    imoutofhere: while(true){
        let choose = readline.question(`choose method:
             1. getcredit(uint256)
             2. repayLoan()
             3. closeCredit(address)
             4. getCredits(address)
             5. recalculation(address)
             6. transEth(address,uint256)
             7. withdraw(uint256)
             8. unstake()
             9. withdrawBank(uint256)
             10.sendBank 
             0. break
         `)

         if(choose == 1){
            let eventCall = web3.utils.sha3('EventCall(uint256,address,string)')
            resContract.events.EventCall({
            topics: [eventCall]
            })
            .on("data", function(logs){
            let result = web3.eth.abi.decodeLog([{
            type: 'uint256',
            name: 'number',
            indexed: true
            },{
            type: 'address',
            name: 'addr',
            indexed: true
            },{
            type: 'string',
            name: 'str'
            }],
            logs.raw.data,
            logs.raw.topics
            )
            console.log(result);
            console.log('------------------------------')
            console.log(logs.returnValues)
            })

            //let bail = readline.question("enter bail: ")
            //await myContract.methods.getCredit(bail).call().then(console.log)
        }
        else if(choose == 2){
            await myContract.methods.repayLoan().call().then(console.log)
        }
        else if(choose == 3){
            let debtor = readline.question("enter address: ")
            await myContract.methods.closeCredit(debtor).call().then(console.log)
        }
        else if(choose == 4){
            await myContract.methods.getCredits().call().then(console.log)
        }
        else if(choose == 5){
            debtor = readline.question("enter address: ")
            await myContract.methods.recalculation(debtor).call().then(console.log)
        }
        else if(choose == 6){
            let recipient = readline.question("enter address: ")
            let value = readline.question("enter value: ")
            await myContract.methods['transEth(uint256)'](recipient,value).call().then(console.log)
        }
        else if(choose == 7){
            value = readline.question("enter value: ")
            await myContract.methods['withdraw(uin256)'](value).call().then(console.log)
        }
        else if(choose == 8){
            await myContract.methods['unstake()']().call().then(console.log)
        }
        else if(choose == 9){
            value = readline.question("enter value: ")
            await myContract.methods.withdrawBank(value).call().then(console.log)
        }
        else if(choose == 10){
            await myContract.methods.sendBank().call().then(console.log)
        }
        else if(choose == 0){
            console.log("Goodbuy")
            break;
        }

        


    }

}
    main()

    .then(() => process.exit(0))

    .catch((error) => {
        console.error(error);
        process.exit(1);
        }
    );