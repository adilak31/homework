const Web3 = require('web3')
// прочие необходимые модули
const readline = require('readline-sync')


// асинхронная функция, в которой возможно использовать await
async function main() {
    // подключение к провайдеру
    let web3 = new Web3('https://eth-goerli.g.alchemy.com/v2/5lkfmp5gi5tPxIkNwoWFvWHRUFpg_T_x')
    let slot2 =  web3.utils.keccak256(
        '0x0000000000000000000000000000000000000000000000000000000000000002')
    console.log(slot2)
    let zero = web3.utils.hexToNumber(await web3.eth.getStorageAt(
        '0x12f428dfb80BA48e4F373681D237E00660dEEea1',
        0
    ))
    console.log(zero)
    let one = web3.utils.hexToNumber(await web3.eth.getStorageAt(
        '0x12f428dfb80BA48e4F373681D237E00660dEEea1',
        1
    ))
    console.log(one) 
    let size = web3.utils.hexToNumber(await web3.eth.getStorageAt(
        '0x12f428dfb80BA48e4F373681D237E00660dEEea1', 
        2
        ))
    console.log(size)
        for(let i = 0; i<size; i++){
            await web3.eth.getStorageAt(
              '0x12f428dfb80BA48e4F373681D237E00660dEEea1',
                 web3.utils.toBN(slot2).add(web3.utils.toBN(i))
                ).then(console.log)
        }
    let three  = web3.utils.hexToString( await web3.eth.getStorageAt(
    '0x12f428dfb80BA48e4F373681D237E00660dEEea1',
    3
    ))
    console.log(three)
    //    web3.utils.toBN(slot).add(web3.utils.toBN(0))
    //).then(console.log))
    
   // await web3.eth.getStorageAt(
    //    '0x12f428dfb80BA48e4F373681D237E00660dEEea1',
     //   web3.utils.toBN(slot).add(web3.utils.toBN(1))
   // ).then(console.log)
}

// 0x3586088e7c36ddbc8f688c48a6f92ecbcbeb684545781e1a510302f6826f725d
//8011969
//8016112
//0x7B55f2b7708EaF2ac2165f6b5F86d41f674002b7 адрес кирилл
 //8468963
// запуск функции main
main()
// если завершилась успешно - завершаем работу
    .then(() => process.exit(0))
// если с ошибкой - выводим ошибку и завершаем работу
    .catch((error) => {
        console.error(error);
        process.exit(1);
        }
    );


