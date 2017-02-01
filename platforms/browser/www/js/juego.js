var app={
  inicio: function(){
    //Todas las variables declaradas en esta función son accesibles desde iniciaJuego
    var puntuacion = "Puntuación: 0";
    var caja1,cajaMov;
    var timer;

    tiempo = 0;
    tRestante = 'T: 16s';
    alto  = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;
    app.iniciaJuego();
  },

  iniciaJuego: function(){

    function preload() {
      game.load.image('caja1', 'assets/sprites/caja.png');
      game.load.image('coin', 'assets/sprites/coin.png');
      game.load.audio('sfx', 'assets/sounds/whack.mp3');
    }

    var fx;
    var iTween = -1;
    var emitter;

    function create() {

      game.stage.backgroundColor = 0x337799;
      //Creamos los objetos del juego: 2 textos(puntuación y tiempo restante) y el bloque a golpear y su objeto de animación
      scoreText = game.add.text(16, 16, puntuacion, { fontSize: '30px', fill: '#F43C3A' });
      tRestante = game.add.text(ancho - 100, 16, tiempo, { fontSize: '30px', fill: '#EAF600' });
      gameOver = game.add.text(ancho-250,alto/2,"Game Over",{ fontSize: '30px', fill: '#F43C3A' });
      gameOver.visible = false;
      caja1 = game.add.sprite((ancho/2)-30, (alto/2)-30, 'caja1');
      caja1.scale.setTo(0.3,0.3);
      caja1.inputEnabled = true;
      caja1.events.onInputDown.add(listenerCaja, this);
      cajaMov = game.add.tween(caja1);

      game.physics.startSystem(Phaser.Physics.ARCADE);
      emitter = game.add.emitter(0, 0, 100);
      emitter.minParticleScale = 0.03;
      emitter.maxParticleScale = 0.04;
      emitter.makeParticles('coin');
      emitter.gravity = 200;


      //Configuración del sonido para el bloque golpeado
      fx = game.add.audio('sfx');
      fx.allowMultiple = true;
      fx.addMarker('whack', 1, 1.0);

      // Configuración del reloj de juego
      timer = game.time.create(false);
      //  Un evento en bucle que se ejecuta cada segundo
      timer.loop(1000, actualizaMovimiento, this);

      //El timer no empieza automáticamente, hay que darle el start si o si.
      timer.start();
    }

    function render()
    {
      if(timer.running)
      {
        tRestante.text = "T: " + (16 - Math.round(timer.seconds)) +"s";
      }
      else {
        tRestante.text = "T: 0s";
      }
      scoreText.text = "Puntuación: " + puntuacion;

    }

    var puntuacion = 0;

    function cuentaFinal(){
      timer.stop();
    }

    /* Esta función se ejecuta cada segundo y genera un nuevo Tween aleatorio para mover el cubo por la pantalla*/
    function actualizaMovimiento(){
      //iTween hace que el movimiento de la caja sea en un eje concreto según el valor del mismo sea par o impar
      iTween++;
      cajaMov = game.add.tween(caja1);

      if(iTween == 15)
      {
        caja1.inputEnabled = false;
        cajaMov.to({x: (ancho/2)-30, y: (alto/2)-30},1000,Phaser.Easing.Bounce.In);
        cajaMov.start();
        timer.stop();
        gameOver.visible = true;
        gameOver.bringToTop();
      }
      else {
        if(iTween % 2 == 1) {
          cajaMov.to({y:rangoAletario(50,alto-60)}, 1900, Phaser.Easing.Bounce.Out);
        }
        else {
          cajaMov.to({x:rangoAletario(50,ancho-60)}, 1900, Phaser.Easing.Bounce.In);
        }
      }
      cajaMov.start();
    }

    function listenerCaja(pointer){
      fx.play('whack');
      emitter.x = pointer.x;
      emitter.y = pointer.y;
      emitter.start(true, 2000, null, 1);
      puntuacion++;

    }

    function rangoAletario(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //Declaramos los estados de juego que queremos controlar y acto seguido generamos nuestro juego.
    var estados = { preload: preload, create: create, render: render };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
  },

  recomienza: function(){
    document.location.reload(true);
  }
};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}
