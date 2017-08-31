$( document ).ready(function() {
    var canvas = document.getElementById('canvas');
    var context =  canvas.getContext('2d');
    var main = document.getElementById('paint');
    var paintStyle = getComputedStyle(main);
    canvas.width = parseInt(paintStyle.getPropertyValue('width'));
    canvas.height = parseInt(paintStyle.getPropertyValue('height'));
    var clickX = [];
    var clickY = [];
    var cursorX;
    var cursorY;
    var drawing = false;
    var start = false;
    var countClick = 0;
    var drawL = false;
    var drawP = false;
    var drawG = false;
    var drawC = false;
    var drawR = false;
    var drawRF = false;
    var drawCF=false;
    var lineWidth = 2;
    var gomme = "#FFFFFF";
    var select_color = "#000000";
    var downloadLink = document.getElementById('download');
    var white_b = new Image();
    white_b.src="img/canvas-background.jpg";
    white_b.addEventListener('load', function() {
        context.drawImage(white_b, 0, 0);
    });
    $(this).mouseup(function(e){
        drawing= false;
        start = false;
    });
    $('#largeur').change(function(){
        lineWidth = $(this).val();
    });
    
    $('#my_color').change(function(){
        select_color = $(this).val();
    });

    $('#cercle').click(function(e){
        clickX=[];
        clickY=[];
        drawP = false;
        drawG = false;
        drawL = false;
        drawR = false;
        drawC = true;
        drawCF = false;
        $('#canvas').unbind('mousedown');
        $('#canvas').unbind('click');
        if(drawC){ 
            $('#canvas').click(function(e){
                addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
                countClick++;
                if (countClick===2){
                    cercle();
                    countClick = 0;
                    clickX=[];
                    clickY=[];
                    $('#full').click(function(e){
                        drawCF=true;
                    });
                }
            }); 
        }    
    });
    $('#rectangle').click(function(e){  
        clickX=[];
        clickY=[];
        drawP = false;
        drawG = false;
        drawL = false;
        drawC = false;
        drawR = true;
        drawRF=false;
        $('#canvas').unbind('mousedown');
        $('#canvas').unbind('click');
        if(drawR){ 
            $('#canvas').click(function(e){
                addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
                countClick++;
                if (countClick===2){
                    rectangle();
                    countClick = 0;
                    clickX=[];
                    clickY=[];
                    $('#full').click(function(e){
                        drawRF=true;
                    });
                }
            }); 
        }    
    });
    $('#gomme').click(function(e){
        drawP = false;
        drawL = false;
        drawR = false;
        drawC = false;
        drawG = true;
        $('#canvas').unbind('click');
        $('#canvas').unbind('mousedown');
        $('#canvas').unbind('mousemove');
        if(drawG){
            $('#canvas').mousedown(function(e){
                drawing=true;
                cursorX = (e.pageX - this.offsetLeft);
                cursorY = (e.pageY - this.offsetTop); 
            });
            $('#canvas').mousemove(function(e){
                if(drawing){
                    cursorX = (e.pageX - this.offsetLeft);
                    cursorY = (e.pageY - this.offsetTop);
                    pen(gomme);
                }
            }); 
        }
    }); 

    $('#crayon').click(function(e){
        drawG = false;
        drawL = false;
        drawR = false;
        drawC = false;
        drawP = true;
        $('#canvas').unbind('click');
        $('#canvas').unbind('mousedown');
        $('#canvas').unbind('mousemove');
        if(drawP){
            $('#canvas').mousedown(function(e){
                drawing=true;
                cursorX = (e.pageX - this.offsetLeft);
                cursorY = (e.pageY - this.offsetTop);
            });
            $('#canvas').mousemove(function(e){
                if(drawing){
                    cursorX = (e.pageX - this.offsetLeft);
                    cursorY = (e.pageY - this.offsetTop);
                    pen(select_color);
                }
            }); 
        }
    }); 

    $('#ligne').click(function(e){
        clickX=[];
        clickY=[];
        drawP = false;
        drawG = false;
        drawC = false;
        drawR = false;
        drawL= true;
        $('#canvas').unbind('mousedown');
        $('#canvas').unbind('click');
        if(drawL){ 
            $('#canvas').click(function(e){
                addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
                countClick++;
                if (countClick===2){
                    drawline();
                    countClick = 0;
                    clickX=[];
                    clickY=[];
                }
            }); 
        }    
    });

    $('#clear').click(function(e){
        drawG = false;
        drawL = false;
        drawR = false;
        drawC = false;
        drawP = false;
        $('#canvas').unbind('click');
        $('#canvas').unbind('mousedown');
        $('#canvas').unbind('mousemove');
        clear_canvas();
    }); 
    $("#download").click(function() {
        downloadLink.href = canvas.toDataURL("image/png");
        downloadLink.download = "my_paint.png";
    });

    function addClick(x, y){
        clickX.push(x);
        clickY.push(y);
    }
    
    function drawline(){
        context.strokeStyle = select_color;
        context.lineJoin = "round";
        context.lineWidth = lineWidth;
        context.beginPath();
        context.moveTo(clickX[0], clickY[0]);
        context.lineTo(clickX[1], clickY[1]);
        context.closePath();
        context.stroke();
    }
    function cercle() {
        context.beginPath();
        var rayon = Math.sqrt(Math.pow(clickX[1]-clickX[0] ,2)+Math.pow(clickY[1]-clickY[0] , 2));
        context.arc(clickX[0], clickY[0], rayon, 0, 2 * Math.PI, false);
        context.lineWidth = lineWidth;
        context.strokeStyle = select_color;
        if(drawCF){
            context.fillStyle=select_color;
            context.fill();
        }
        context.stroke();
    } 

    function rectangle(){
        context.beginPath();
        context.lineWidth = lineWidth;
        context.strokeStyle = select_color;
        context.strokeRect(clickX[0], clickY[0], clickX[1]-clickX[0], clickY[1]-clickY[0]);
        if(drawRF){
            context.fillStyle=select_color;
            context.fillRect(clickX[0], clickY[0], clickX[1]-clickX[0], clickY[1]-clickY[0]);
        }
        context.stroke();
    }

    function pen(color){
        if (!start) {
            context.beginPath();
            context.moveTo(cursorX, cursorY);
            start = true;
        } 
        else {
            context.lineTo(cursorX, cursorY);
            context.strokeStyle = color;
            context.lineJoin = "round";
            context.lineWidth = lineWidth;
            context.stroke();
        }
    }
    function clear_canvas() {
        context.clearRect(0,0, canvas.width, canvas.height);
        context.drawImage(white_b, 0, 0);
    } 
}); 