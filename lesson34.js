const Web3 = require('web3')
const readline = require('readline-sync')
function sleep(milliseconds) {      
    const date = Date.now();        
    let currentDate = null;      
    do {              
        currentDate = Date.now();      
    } while (currentDate - date < milliseconds);
}  
async function main() {
    
    let web3 = new Web3('https://eth-goerli.g.alchemy.com/v2/5lkfmp5gi5tPxIkNwoWFvWHRUFpg_T_x')
     
    await web3.eth.getBlock('latest', function (error, block){
    console.log(`number: ${block.number} baseFeePerGas ${block.baseFeePerGas}`)
    if(block > 15_000_000){
        console.log("price increases")
    } else {
        console.log("price decreases")
    }
})
    let targetFee = readline.question('enter gasfee: ')
    let start = await web3.eth.getBlockNumber()
    let end = start + 3 
    while(start <= end){
       sleep(10000)      
        let newBlock = await web3.eth.getBlock('latest')
        if(newBlock.number > start){
            console.log(`number: ${newBlock.number} baseFeePerGas ${newBlock.baseFeePerGas}`)
            if(newBlock.baseFeePerGas<=targetFee){
                console.log("succes")
                return;
            }
            start = newBlock.number
        }
    }
    console.log("Gas is too expensive. try again later")
}
main()

    .then(() => process.exit(0))

    .catch((error) => {
        console.error(error);
        process.exit(1);
        }
    );