let gold = parseInt(localStorage.getItem("gold")) || 0;

function addGold(amount) {
    gold += amount;
    localStorage.setItem("gold", gold);
}

function getGold() {
    return gold;
}

