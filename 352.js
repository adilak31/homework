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

let fName = "caller.sol"

let cName = "Caller"
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
    let ABI = JSON.parse(fs.readFileSync(__dirname + '//' + 'Caller.abi', 'utf-8'))
    let bytecode = fs.readFileSync(__dirname + '//' + 'Caller.bin', 'utf-8')
   

    let myContract = new  web3.eth.Contract(ABI)

     let exAddress = readline.question("enter address: ")

    await myContract.deploy({
        data: bytecode,
        arguments: [exAddress]
    }).send({
        from: account.address,
        gas: 3000000
    }).on('receipt',(receipt)=>{
       console.log(receipt)
    })
    .then(function(newContractInstance){
       myContract = newContractInstance
    }    
    )
    
    
    imoutofhere: while(true){
       let choose = readline.question(`choose method:
            1. x()
            2. y()
            3. str()
            4. map(address)
            5. setXY(uint256,uint256)
            6. setStr(string)
            7. init(uint256)
            8. addToMap(address,St)
            0. break
        `)
        if(choose == 1){
            await myContract.methods.getx().call().then(console.log)
        }
        else if(choose == 2){
            await myContract.methods.gety().call().then(console.log)
        }
        else if(choose == 3){
            await myContract.methods.getstr().call().then(console.log)
        }
        else if(choose == 4){
            let index = readline.question("enter index: ")
            await myContract.methods.getData(index).call().then(console.log)
        }
        else if(choose == 5){
            let address = readline.question("enter address: ")
            await myContract.methods.getMap(address).call().then(console.log)
        }
        else if(choose == 6){
            x = readline.question("enter x: ")
            y = readline.question("enter y: ")
            await myContract.methods.setXY(x,y).send({from: account.address})
            .on('reciept', console.log).then(console.log)
        }    
        else if(choose == 7){
            let string = readline.question("enter string: ")
            await myContract.methods.setStr(string).send({from: account.address})
            .on('reciept', console.log).then(console.log)
        }
        else if(choose == 8){
            let count = readline.question("enter count: ")
            await myContract.methods.init(count).send({from: account.address})
            .on('reciept', console.log).then(console.log)
        }
        else if(choose == 9){
            let adr = readline.question("enter address: ")
            let number = readline.question("enter number: ")
            let str = readline.question("enter string: ")
            await myContract.methods.addToMap(adr,[number,str]).send({from:account.address})
            .on('reciept',console.log).then(console.log)
        }
        else if( choose == 0){
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
