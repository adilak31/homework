// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.15;

contract Wallet{
    mapping (address => uint256) public balances;
    function addBalance()public payable{
        balances[msg.sender]+= msg.value;
    }
    function transEth(address recipient, uint256 value)public  virtual  {
       require(balances[msg.sender] >= value, "balance is not enough");
        
        balances[msg.sender] -= value;
        balances[recipient] += value;
        
    }
    function withdraw(uint256 value) public virtual returns(bool) {
        if(balances[msg.sender] <value ){
            return false;
        }    
        balances[msg.sender] -= value;
        payable(msg.sender).transfer(value);
        return true;
    }
}
contract Bank{

    struct Stake{
      uint256 target; 
      uint256 balance;
    }  
    mapping (address => Stake) public stakes;
    function addStake(uint256 target)public payable{
       require(stakes[msg.sender].target <= target);
       if(target > stakes[msg.sender].target){
           stakes[msg.sender].target = target;
       }
       stakes[msg.sender].balance += msg.value;
    }
    function unstake()public virtual returns(bool){
        require(stakes[msg.sender].balance <=stakes[msg.sender].target);
        uint256 balance = stakes[msg.sender].balance;
        delete stakes[msg.sender];
        return payable(msg.sender).send(balance);
    }
}



contract Credit is Wallet, Bank{

    uint256 public persent; // процентная ставка
    uint256 public BankBalance; // сумма собственных средств банка
    uint256 public OpenCredit; // количество открытых кредитов
    address owner;

    struct Client{
        uint256 bail; // долг
        uint256 debt; // залог
        uint256 time; // время взятие кредита
        uint256 id;   // id кредита
        uint256 lastPay; // оплата последнего месяца
        
    }
    mapping (uint256 => address) public borrowers; // словарь заемщиков
    mapping (address => Client) public  credits; // словарь кредитов

    constructor(uint256 _persent)payable{
        persent = _persent;
        owner = msg.sender;
        BankBalance = msg.value;
    }
    function getCredit(uint256 bail)public{
        require(credits[msg.sender].bail == 0); // нету задолжностей 
        require(BankBalance>=bail);// проверка баланса банка
        //для получения кредита необходим залог. 
        //Сумма эфира на счёте и вкладе клиента в контракте 
        // должна быть минимум в два раза больше суммы получаемого кредита 
        require(balances[msg.sender]+stakes[msg.sender].balance >= bail*2);
        OpenCredit++;// добавление кредита
        credits[msg.sender] =  Client(bail, bail*2, block.timestamp, OpenCredit, 0);//
        borrowers[OpenCredit]  = msg.sender;// добавление заемщика в словарь
        BankBalance -= bail; // вычет из баланса банка 
        payable(msg.sender).transfer(bail); // отправка средсв заемщику
    }
    function repayLoan()public payable{
        require (msg.value > 0);
        require (credits[msg.sender].bail != 0);// проверка наличия кредита

        Client memory credit  = credits[msg.sender];
        uint8 month =  uint8((block.timestamp - credit.time) / 30 days);

        for(uint256 i = 0; i < month - credit.lastPay;i++){
            credit.bail += credit.bail * persent / 100;
        }
        if(msg.value >= credit.bail){
            BankBalance += credit.bail;//пополнение счета банка заемщиком
            //излишки переводятся на счет заемщика
            balances[msg.sender] += msg.value - credit.bail; 
            
            if(credit.id != OpenCredit){
            //адрес заемщика меняем местами с последним в списке
              credits[borrowers[OpenCredit]].id = credit.id; 
              borrowers[credit.id] = borrowers[OpenCredit] ; 
            }
            delete credits[msg.sender]; //закрываем кредит заемщика
            delete borrowers[OpenCredit]; //закрываеи этот кредит в списке
            OpenCredit --; // сокращаем список на один
        }
        else{
            BankBalance += msg.value;//пополнение баланса банка
            credit.bail -= msg.value;//уменьшаем задолжность на прсиланный эфир
            credit.debt = credit.bail * 2;// уменьшаем залог
            credits[msg.sender] = credit; //сохраняем все изменения
        }
    }
    function closeCredit(address debtor)public{
        require(owner == msg.sender, "You are not owner");
        Client memory credit = credits[debtor];
        // проверяемь, что кредит еще не выплачен
        //рассчитываем сколько месяцев прошло с открытия кредита
        require(credit.bail != 0, "credit repaid");
        uint8 month = uint8((block.timestamp - credit.time) / 30 days);
        //проверяем, что истек год с момента выдачи кредита или платежи по долгу не посткпали
        //более 4 месяцев
        require((month > 12) || (month - credit.lastPay) > 4, "credit is not overvue yet");
        //рассчитываем сколько набежало процентов по долгу смомента последнего платежа
        for(uint256  i=0; i < month - credit.lastPay; i++){
            credit.bail += credit.bail * persent / 100;
        }
        //рассчитываем залог по остатку долга
        credit.debt = credit.bail * 2;
        //если залог больше счета и вклада вместе взятых
        if(credit.debt > balances[debtor]+ stakes[debtor].balance){
        //то забираем все, что есть на счете и вкладе в счет банка
           BankBalance += balances[debtor] + stakes[debtor].balance;    
        }
        //если счет больше залога
        else if(balances[debtor] > credit.debt){
        //то вычитаываем весь залог из взноса
            balances[debtor] -= credit.debt;
        //весь залог идет в счет банка
            BankBalance += credit.debt;
        }
        
        else{
        //весь залог идет в счет в банка
            BankBalance += credit.debt; 
        //в противном случаи вычитаем все из счета
            credit.debt -=balances[debtor];
            balances[debtor] = 0;
        //оставшиеся вычитаем из вклада
            stakes[debtor].balance -= credit.debt;
               
        }
        //удаляем заемщика из списка
        //меняем его местами с последним в списке
        if(credit.id != OpenCredit){
            credits[borrowers[OpenCredit]].id = credit.id; 
            (borrowers[OpenCredit], borrowers[credit.id]) = (borrowers[credit.id], borrowers[OpenCredit]);
        }
        delete credits[debtor];// закрываем кредит
        delete borrowers[OpenCredit];
        //уменьшааем кол-во открытых кредитов
        OpenCredit --;
    }
    //функция возвращает список кредитов
    function getCredits() external view returns(Client[] memory){
       require(msg.sender == owner,"you are not owner");
    //создаем список структур Credit
       Client[] memory _credits = new Client[](OpenCredit);
    //проходим по всему кредитам и сохраняем в массиве
       for( uint256 i = 0; i < OpenCredit; i++){
           _credits[i] = credits[borrowers[i+1]];
       }
       return _credits;
    }
    function recalculation(address debtor) public returns(Client memory){
        Client memory credit = credits[debtor];
        //проверяем, что кредит еще не выплачен
        if(credit.bail !=0){
        //рассчитываем склько прошло месяцев с момента взятия кредита
        uint8 month = uint8((block.timestamp - credit.time) / 30 days); 
        //рассчитываем сколько набежало процентов по долгу 
           for(uint256  i=0; i < month - credit.lastPay; i++){
            credit.bail += credit.bail * persent / 100;
        }
        //обнавляем значение
           credit.debt = credit.bail * 2;
           credits[debtor] = credit;
        }
        return credit;
    }
    //перегруженная функция transEth
    function transEth(address recipient, uint256 value) public override{
        require(balances[msg.sender] >= value, "balance is not enough");
    //перечитываем задолжность по кредиту
        recalculation(msg.sender);
    //проверяемБчто оставшихся средств будет достаточно для залога
        uint256 delta = balances[msg.sender] + stakes[msg.sender].balance - value;
        require(delta < credits[msg.sender].debt, 
        "There are not enough funds in your accounts to bail you out");
        balances[msg.sender] -= value;
        balances[recipient]  += value;         
    }
    //перегруженная функция withdraw
    function withdraw(uint256 value)public override returns(bool){
        require(balances[msg.sender] >= value, "balance not enough");
    //пересчитываем задолжность покредиту
        recalculation(msg.sender);
    //проверяем, что после вывода средств на баласе счета и вклада
        uint256 delta = balances[msg.sender] + stakes[msg.sender].balance - value;
        require(delta < credits[msg.sender].debt, 
        "There are not enough funds in your accounts to bail you out");
        balances[msg.sender] -= value;
        return payable (msg.sender).send(value);
    }
    //снова перегружвем
    function unstake() public override returns (bool){
        uint256 balance = stakes[msg.sender].balance;
        require(balance >= stakes[msg.sender].target, "Target not met");
    //пересчитываем задолжность по кредиту
        recalculation(msg.sender);
        require(balances[msg.sender] >= credits[msg.sender].debt,
        "There are not enough funds in your accounts to bail you out");
        stakes[msg.sender].balance = 0;
        stakes[msg.sender].target  = 0;
        return payable (msg.sender).send(balance);
    }
    //функция вывода средств для владельца контракта
    function withdrawBank(uint256 value) public {
        require(BankBalance>= value, "Not enough eth in the bank");
        payable(owner).transfer(value);
    } 
    //функция для отправки средств на котракт
    function sendBank()public payable{
        BankBalance += msg.value;
    }
}
