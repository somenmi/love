// js/sparkles/sparkle-2.js
document.addEventListener('DOMContentLoaded', function() {
    // Создаем canvas динамически
    const canvas = document.createElement('canvas');
    canvas.id = "sparkle-canvas";
    document.body.insertBefore(canvas, document.body.firstChild);
    
    // Стили для canvas
    Object.assign(canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        zIndex: '1',
        pointerEvents: 'none'
    });

    // Определение мобильных устройств
    const mobile = navigator.userAgent.match(/Android|webOS|iPhone|BlackBerry|Windows Phone/i);
    
    // Инициализация WebGL с прозрачностью
    const gl = canvas.getContext('webgl', {
        alpha: true,
        premultipliedAlpha: false
    });
    
    if(!gl) {
        console.error("WebGL не инициализирован");
        return;
    }

    // Настройки эффекта
    let layers_ = mobile ? 6 : 3;
    const dt = 0.006;
    let time = 0.0;

    // Шейдеры (ваши оригинальные с небольшими изменениями)
    const vertexSource = `
        attribute vec2 position;
        void main() {
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;

    const fragmentSource = `
        precision highp float;

        uniform float width;
        uniform float height;
        uniform float time;
        
        vec2 resolution = vec2(width, height);

        float random(vec2 par) {
            return fract(sin(dot(par.xy, vec2(12.9898, 78.233))) * 43758.5453);
        }

        vec2 random2(vec2 par) {
            float rand = random(par);
            return vec2(rand, random(par+rand));
        }

        float getGlow(float dist, float radius, float intensity) {
            return pow(radius/dist, intensity);
        }

        void main() {
            float t = 1.0 + time * 0.010;
            const float layers = ${layers_}.0;
            float scale = 96.0;
            float depth;
            float phase;
            float rotationAngle = time * -0.1;
            float size;
            float glow;
            const float del = 1.0/layers;
            
            vec2 uv;
            vec2 fl;
            vec2 local_uv;
            vec2 index;
            vec2 pos;
            vec2 seed;
            vec2 centre;    
            vec2 cell;
            vec2 rot = vec2(cos(t), sin(t));
            
            mat2 rotation = mat2(cos(rotationAngle), -sin(rotationAngle), 
                           sin(rotationAngle), cos(rotationAngle));
            vec3 col = vec3(0);
            vec3 tone;
            
            for(float i = 0.0; i <= 1.0; i+=del) {
                depth = fract(i + t);
                centre = rot * 0.2 * depth + 0.5;
                uv = centre-gl_FragCoord.xy/resolution.x;
                uv *= rotation;
                uv *= mix(scale, 0.0, depth);
                fl = floor(uv);
                local_uv = uv - fl - 0.5;

                for(float j = -1.0; j <= 1.0; j++) {
                    for(float k = -1.0; k <= 1.0; k++) {
                        cell = vec2(j,k);
                        index = fl + cell;
                        seed = 128.0 * i + index;
                        pos = cell + 0.9 * (random2(seed) - 0.5);
                        phase = 128.0 * random(seed);
                        tone = vec3(random(seed), random(seed + 1.0), random(seed + 2.0));
                        size = (0.1 + 0.5 + 0.5 * sin(phase * t)) * depth;
                        glow = size * getGlow(length(local_uv-pos), 0.03, 2.0);
                        col += 1.0 * vec3(0.02 * glow) + tone * glow;
                    }
                }
            }
            
            col = 1.0 - exp(-col);
            gl_FragColor = vec4(col, 0.8); // Прозрачность
        }
    `;

    // Компиляция шейдеров
    function compileShader(shaderSource, shaderType) {
        const shader = gl.createShader(shaderType);
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Ошибка компиляции шейдера:", gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    // Создание программы
    const vertexShader = compileShader(vertexSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentSource, gl.FRAGMENT_SHADER);
    
    if(!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Ошибка линковки программы:", gl.getProgramInfoLog(program));
        return;
    }
    
    gl.useProgram(program);

    // Настройка вершинного буфера
    const vertexData = new Float32Array([-1,1, -1,-1, 1,1, 1,-1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

    const positionHandle = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionHandle);
    gl.vertexAttribPointer(positionHandle, 2, gl.FLOAT, false, 0, 0);

    // Получение uniform-переменных
    const timeHandle = gl.getUniformLocation(program, 'time');
    const widthHandle = gl.getUniformLocation(program, 'width');
    const heightHandle = gl.getUniformLocation(program, 'height');

    // Функция изменения размера
    function onWindowResize() {
        canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        canvas.style.width = canvas.offsetWidth + 'px';
        canvas.style.height = canvas.offsetHeight + 'px';
        
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform1f(widthHandle, canvas.width);
        gl.uniform1f(heightHandle, canvas.height);
    }

    // Инициализация
    onWindowResize();
    window.addEventListener('resize', onWindowResize);

    // Настройка прозрачности
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);

    // Функция анимации
    function draw() {
        time += dt;
        gl.uniform1f(timeHandle, time);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        requestAnimationFrame(draw);
    }

    draw();
});