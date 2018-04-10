function cards() {
    this.view = function view() {
        var card = document.createElement("div");
        card.className = "card card-outline-secondary mb-3"
        var cardBlock = document.createElement("div");
        cardBlock.className = "block";
        var cardTitle = document.createElement("h3");
        cardTitle.className = "card-title";
        cardTitle.innerHTML = "Harro";
    }
}

console.log("test");

$(".class-cards").append(cards.view());