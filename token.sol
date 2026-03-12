contract token {
    mapping (address => uint) public coinBalanceOf;
    mapping (uint => address) miningReward;
    event CoinTransfer(address sender, address receiver, uint amount);

    function token(uint supply) {
        coinBalanceOf[msg.sender] = supply;
    }

    function sendCoin(address receiver, uint amount) returns(bool sufficient) {
        if (coinBalanceOf[msg.sender] < amount) return false;
        coinBalanceOf[msg.sender] -= amount;
        coinBalanceOf[receiver] += amount;
        CoinTransfer(msg.sender, receiver, amount);
        return true;
    }

    function claimMiningReward() {
        if (miningReward[block.number] == 0) {
            coinBalanceOf[block.coinbase] += 1;
            miningReward[block.number] = block.coinbase;
        }
    }
}
