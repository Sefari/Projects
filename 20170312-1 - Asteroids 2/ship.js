// Criar um criador de Objectos Particles usando a mesma logica da criaçao do criador de Objectos Vectores

// Constructor function
function ship (x, y, speed, direction, grav) {

    // Começamos por definir as propriedades Position e Velocity
    // Começam por ser null para estarem assim no template e nao já definidos o que afectaria todas as Particles criadas    
    this.position = new vector(x, y);

    this.velocity = new vector(0.0, 0.00001);
    this.velocity.setLength(speed);
    this.velocity.setAngle(direction);

    this.bearing = new vector(0.0, 0.0);
    this.bearing.setAngle(direction);

    this.acceleration = new vector(0.0, 0.0); // criar vector thrust inicialmente sem valores, mas que ira mudar com o mouse
    this.acceleration.setLength(0.0001);
    this.acceleration.setAngle(direction);

    this.maxVelocity = 10;
    
    this.color = "blue"; // atribuir uma propriedade Color a novas Particles

    this.turningLeft = false;
    this.turningRight = false;
    this.thrusting = false;

    this.hit = false;    

    this.accelerate = function () {
        if (this.thrusting == true) {
            this.acceleration.setLength(0.1*1);
            }
        else {
            this.acceleration.setLength(0.00001);
            };

        if (this.turningLeft == true) {
            this.acceleration.setAngle(this.acceleration.getAngle() - 0.05*1);
            this.bearing.setAngle(this.bearing.getAngle() - 0.05*1);
            };

        if (this.turningRight == true) {
            this.acceleration.setAngle(this.acceleration.getAngle() + 0.05*1);
            this.bearing.setAngle(this.bearing.getAngle() + 0.05*1);
            };
        };


    this.collision = function () {
        for (var i = 0; i < Asteroids.length; i++) {
            if (GameStartKey == true && // Nave só é atingível se já se tocou em nenhuma tecla
                Math.abs(this.position.getX() - Asteroids[i].position.getX()) <= 7 + Asteroids[i].radius &&
                Math.abs(this.position.getY() - Asteroids[i].position.getY()) <= 7 + Asteroids[i].radius) {
                this.hit=true;
                };
            };
        };

    this.powerup = function () {
        for (var i = Powerups.length-1; i >=0; i--) {
            if (Math.abs(this.position.getX() - Powerups[i].position.getX()) <= 7 + Powerups[i].radius &&
                Math.abs(this.position.getY() - Powerups[i].position.getY()) <= 7 + Powerups[i].radius) {
                this.color = "lightgreen";
                Powerups.splice(i, 1)
            };
        };
    };

    // Função para actualizar a Position da Particle em cada iteracao tendo em conta a sua Velocity
    this.update = function () {
        if (this.velocity.getLength() > this.maxVelocity) {
            this.velocity.setLength(this.maxVelocity);
            };
        this.position.addTo(this.velocity);
        this.velocity.addTo(this.acceleration);
        };

    
    // Evitar que a nave saia do ecra voltando a coloca-la no outro lado quando sair
    this.edge = function () {
        if (this.position.getX() > width) {
            this.position.setX(0);
        };
        if (this.position.getX() < 0) {
            this.position.setX(width);
        };
        if (this.position.getY() > heigth) {
            this.position.setY(0);
        };
        if (this.position.getY() < 0) {
            this.position.setY(heigth);
        };
    };
    

    this.draw = function () {
        // Mecanica para criar ilusao de rotacao da ship via rotacao do canvas (como feito no Episode 5 com Arctangent 2)
        context.save(); // salvar o canvas
        context.translate(this.position.getX(), this.position.getY()); // transladar o canvas para a posicao da nave
        context.rotate(this.bearing.getAngle()+Math.PI*0.5); //rodar o canva pelo valor do angulo de ataque actual da nave

        // Desenhar a nave
        drawShip(-25/2, -35/2, 25, 35);        

        // Shield se o jogo ainda não começou / ainda não se tocou em nenhuma tecla
        if (!GameStartKey) {
            context.beginPath();
            context.strokeStyle = "gold" ;
            context.arc(0, 0, 18, 0, Math.PI * 2);
            context.stroke();
            context.closePath();
            };
        
        // Fogo atrás se tiver thrust
        if (this.thrusting) {
            drawThrust(-10/2, +30/2, 10, 15);        
            };

        // Restaurar rotacao do canvas apos desenhar a nave
        context.restore();

    };

};