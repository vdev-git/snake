//инициализация переменных	
function init(){
	//объект - game - игровое поле
	//game = new rect('#fff', 0, 0, 800, 600);
  key_delay = true;
  tail_side = true;
	//--------------------
	canvas = document.getElementById('canvas_id');
	canvas.width = 800;
	canvas.height = 600
	context = canvas.getContext('2d'); 
	//--------------------
	
	//шаг движения
	step = 50;
	//первоначальное направление движения(1 вверх, 2 вправо, 3 вниз, 0 влево)
	check = 2;	
	//начальная скорость
  speed = 7;
  //счет очков
  scope = 0;
  context.font = '30px Roboto';
  context.textAlign = 'right';

	//голова
	side_head = step;
	head_posx = 150;
	head_posy = 150;
	head = new imag(head_posx,head_posy);
	
	//хвост
	tail_quan = 4; //первоначальное кол-во клеток хвоста
	tail = [];
	createTail(tail_quan);
	
	//еда
	eat = new imag(0, 0);
	checkCoordEat();
 
	//картинка фона
	backgr = new imag(0, 0);

  //цикл
	timer = setTimeout(play, 1000/speed);
}

//отрисовка
function draw(){
	
}

//главная функция цикла
function play(){
	updateHead();
	checkEat();
	var death = checkDeath();
	if(!death){
		backgr.drawImg(backgr_pic);	
		drawHead();
		updateTail();
		drawTail();
		eat.drawImg(food_pic);
		drawScope();
	}
	timer = setTimeout(play, 1000/speed);
	if(death){
		clearTimeout(timer);
	}
}

function drawScope(){
	context.fillText("Очки: "+ scope, 770, 50);
}


//обновление координат головы
function updateHead(){
	switch (check) {
		case 0:
				head.x = head.x - step;	
			break;
		case 1:
				head.y = head.y - step;		
			break;
		case 2:
				head.x = head.x + step;							
			break;
		case 3:
				head.y = head.y + step;			
			break;
		default:
			break;
	}
}

//присваивание картинки для головы в зависимости от направления и отрисовка
function drawHead(){
	switch (check) {
		case 0:
				head.drawImg(head_left_pic);
			break;
		case 1:
				head.drawImg(head_top_pic);
			break;
		case 2:
				head.drawImg(head_right_pic);
			break;
		case 3:
				head.drawImg(head_bot_pic);
			break;
		default:
			break;
	}
}


//проверка на смерть
function checkDeath(){
	//проверка левой стороны
	if(head.x < 0){
		return true;
	}
	//проверка верхней стороны
	if(head.y < 0){
		return true;
	}
	//проверка правой стороны
	if(head.x > canvas.width - step){
		return true;
	}
	//проверка нижней стороны
	if(head.y > canvas.height - step){
		return true;
	}
	//проверка налезания на хвост
	for(var i = 0; i < tail.length; i++){
		if((head.x == tail[i].x)&&(head.y == tail[i].y)){
			return true;
		}
	}
}

//функция проверки координат еды
function checkEat(){
	if((head.x == eat.x)&&(head.y == eat.y)){
		//увеличение скорости
		speed = speed + 0.1;
		//добавление очков
		scope++;
		//добавление хвоста
		addTailItem();
		//новые координаты для еды
		checkCoordEat();
	}
}

//вычисление коорожинат для еды
function checkCoordEat(){
	eat.x = getRandom(0, canvas.width - step,step);
	eat.y = getRandom(0, canvas.height - step,step);
	var b = true;	
	for(var i = 0; i < tail.length; i++){
		if((eat.x == tail[i].x) && (eat.y == tail[i].y)){
			b = false;
		}
	}

	if((eat.x == head.x)&&(eat.y == head.y)){
		b = false;
	}

	if(!b){
		checkCoordEat();
	}
}

//получение случайных координат для еды
function getRandom(min, max, step){
	var a;
	while(a%step!=0){
		a = Math.floor(Math.random() *(max - min + 1)) + min;
	}
	return a;
}


//влево - 0, вверх - 1, вправо - 2, вниз - 3 
document.body.onkeydown = function(e){
	switch (e.keyCode) {
		case 37:
			if((check != 2) && (check != -1) && (key_delay == true)){
				check = 0;
				key_delay = false;
				setTimeout(function() { key_delay = true; }, 700/speed); 
			}
			break;
		case 38:
			if((check != 3)&&(key_delay == true)){
				check = 1;
				key_delay = false;
				setTimeout(function() { key_delay = true; }, 700/speed);
			}
			break;
		case 39:
			if((check != 0)&&(key_delay == true)){
				check = 2;
				key_delay = false;
				setTimeout(function() { key_delay = true; }, 700/speed);
			}
			break;
		case 40:
			if((check != 1)&&(key_delay == true)){
				check = 3;
				key_delay = false;
				setTimeout(function() { key_delay = true; }, 700/speed);
			}
			break;
			default:
				break;
	}	

}

//функция-коструктор для картинок
function imag(x, y) {
    this.x = x; // координата х на холсте
    this.y = y; // координата у
    this.drawImg = function(pic) // Метод рисующий картинку
    {
				context.drawImage(pic, this.x, this.y);      
    }

}


