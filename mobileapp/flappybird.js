const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
const scale = 10;
const rows = canvas.height/ scale;
const columns = canvas.width/ scale;

var snake;

(function setup() {
    snake = new Snake();
    

    window.setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        snake.udpate();
        snake.draw();
    }, 250);
}());


