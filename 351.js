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
let fName = "example.sol"
let cName = "Example"
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
    let ABI = JSON.parse(fs.readFileSync(__dirname + '//' + 'Example.abi', 'utf-8'))
    let bytecode = fs.readFileSync(__dirname + '//' + 'Example.bin', 'utf-8')

    let myContract = new  web3.eth.Contract(ABI)

    let x = 100 //readline.question("enter x: ")
    let y  = 200 //readline.question("enter y: ")
    let str = "qwerty" //readline.question("enter string: ")


    await myContract.deploy({
        data: bytecode,
        arguments: [x,y, str]
    }).send({
        from: account.address,
        gas: 1000000
    }).on('receipt',(receipt)=>{
       console.log(receipt)
    })
    .then(function(newContractInstance){
       myContract = newContractInstance
    }    
    )
}
main()

    .then(() => process.exit(0))

    .catch((error) => {
        console.error(error);
        process.exit(1);
        }
    );
    //0x8C709E5398a69aFeF4ca91baBF7d82DC695C0882