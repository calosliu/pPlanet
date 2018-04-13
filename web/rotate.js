//定义变量
var canvasScreen = document.getElementById('cas'),
    ctx = canvasScreen.getContext('2d'),
    //planet的坐标
    vpx = canvasScreen.width / 2,
    vpy = canvasScreen.height / 2,
    //半径
    Radius = 150,
    //纬线数量
    latitudeNum = 12,
    //同一维度上,与不同经线交叉的点的数目
    crossNum = 12,
    circles = [],
    angleX = Math.PI / 100,
    angleY = Math.PI / 100;


window.addEventListener('mousemove', function (event) {
    var x = event.clientX - canvasScreen.offsetLeft - vpx;
    var y = event.clientY - canvasScreen.offsetTop - vpy;

    angleY = -x * 0.0001;
    angleX = -y * 0.0001;
});


var Animation = function () {
    this.init();
};

Animation.prototype = {
    isRunning: false,
    init: function () {
        //分割成上下两个半球,分别画纬线
        var semisphereLineCount = latitudeNum / 2;
        for (var i = 0; i <= semisphereLineCount; i++) {
            var l1 = new latitude(i, 1);
            l1.draw();
            var l2 = new latitude(i, -1);
            l2.draw();
        }

    },

    start: function () {
        this.isRunning = true;
        animate();
    },
    stop: function () {
        this.isRunning = false;
    }
}

//绘图
function animate() {
    ctx.clearRect(0, 0, canvasScreen.width, canvasScreen.height);
    rotateX();
    rotateY();
    rotateZ();

    for (var i = 0; i < circles.length; i++) {
        circles[i].paint();
    }
    if (animation.isRunning) {
        if ("requestAnimationFrame" in window) {
            requestAnimationFrame(animate);
        }
        else if ("webkitRequestAnimationFrame" in window) {
            webkitRequestAnimationFrame(animate);
        }
        else if ("msRequestAnimationFrame" in window) {
            msRequestAnimationFrame(animate);
        }
        else if ("mozRequestAnimationFrame" in window) {
            mozRequestAnimationFrame(animate);
        }
    }
}

//星球
var planet = function (x, y, z, r) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.r = r;
    this.width = 2 * r;
}

planet.prototype = {
    paint: function () {
        var fl = 450 //焦距
        ctx.save();
        ctx.beginPath();
        var scale = fl / (fl - this.z);
        var alpha = (this.z + Radius) / (2 * Radius);
        ctx.arc(vpx + this.x, vpy + this.y, this.r * scale, 0, 2 * Math.PI, true);
        ctx.fillStyle = "rgba(255,255,255," + (alpha + 0.5) + ")";
        ctx.fill();
        ctx.restore();
    }
}

//纬线截面
var latitude = function (num, up) {
    this.radius = Math.sqrt(Math.pow(Radius, 2) - Math.pow(Radius * Math.cos(num * Math.PI * 2 / crossNum), 2))
    this.x = 0;
    this.y = 0;
    this.up = up;
}

latitude.prototype = {
    setBalls: function (radius) {
        for (var i = 0; i < crossNum; i++) {
            var angle = 2 * Math.PI / crossNum * i;
            var b = new planet(radius * Math.cos(angle), radius * Math.sin(angle), this.up * Math.sqrt(Math.pow(Radius, 2) - Math.pow(radius, 2)), 1.5);
            b.paint();
            circles.push(b);
        }

    },
    draw: function () {
        ctx.beginPath();
        ctx.arc(vpx, vpy, this.radius, 0, 2 * Math.PI, true);
        ctx.strokeStyle = "#000";
        ctx.stroke();
        this.setBalls(this.radius);
    }
}


//旋转角度
function rotateX() {
    var cos = Math.cos(angleX);
    var sin = Math.sin(angleX);
    for (var i = 0; i < circles.length; i++) {
        var y1 = circles[i].y * cos - circles[i].z * sin;
        var z1 = circles[i].z * cos + circles[i].y * sin;
        circles[i].y = y1;
        circles[i].z = z1;
    }
}

function rotateY() {
    var cos = Math.cos(angleY);
    var sin = Math.sin(angleY);
    for (var i = 0; i < circles.length; i++) {
        var x1 = circles[i].x * cos - circles[i].z * sin;
        var z1 = circles[i].z * cos + circles[i].x * sin;
        circles[i].x = x1;
        circles[i].z = z1;
    }
}

function rotateZ() {
    var cos = Math.cos(angleY);
    var sin = Math.sin(angleY);
    for (var i = 0; i < circles.length; i++) {
        var x1 = circles[i].x * cos - circles[i].y * sin;
        var y1 = circles[i].y * cos + circles[i].x * sin;
        circles[i].x = x1;
        circles[i].y = y1;
    }
}




//开始
var animation = new Animation();
animation.start();

document.getElementById("controlBtn").onclick = function () {
    this.innerText === "开始" ? this.innerText = "停止" : this.innerText = "开始";
    this.innerText === "开始" ? animation.stop() : animation.start();
    ;
}
