document.addEventListener('DOMContentLoaded', function () {
    // Создаем canvas
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

    // Проверка мобильного устройства
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);

    // Получаем CSS переменные один раз в начале
    const cssSpeed = parseFloat(getComputedStyle(document.documentElement)
        .getPropertyValue('--sparkle-speed')) || 1;

    // Инициализация WebGL
    const gl = canvas.getContext('webgl', {
        alpha: true,
        premultipliedAlpha: false,
        powerPreference: isMobile ? 'low-power' : 'default'
    });

    if (!gl) {
        console.error("WebGL не поддерживается");
        return;
    }

    if (isMobile) {
        gl.getExtension('EXT_shader_texture_lod');
        gl.getExtension('OES_standard_derivatives');
    }

    // Настройки эффекта (единое место для всех параметров)
    const settings = {
        layers: isMobile ? 3 : 6,
        speed: (isMobile ? 0.001 : 0.001) * cssSpeed,
        scale: isMobile ? 6 : 12,
        intensity: isMobile ? 1.5 : 2.0,
        particleSize: isMobile ? 0.08 : 0.1,
        particleDensity: isMobile ? 0.7 : 1.5,
        colorIntensity: isMobile ? 0.8 : 1.0,
        baseColor: [0.02, 0.02, 0.05],
        dt: isMobile ? 0.0003 : 0.0004,
        mobileBoost: isMobile ? 1.5 : 1.0,    // Усиление эффекта для мобильных
        minVisible: 0.05     // Минимальная видимость частиц
    };

    let time = 0.0;
    let lastTime = 0;

    // Вершинный шейдер
    const vertexSource = `
        attribute vec2 position;
        void main() {
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;

    // Фрагментный шейдер с правильными подстановками
    const fragmentSource = `
    precision highp float;
    
    uniform float width;
    uniform float height;
    uniform float time;
    
    float random(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    vec2 random2(vec2 p) {
        return vec2(random(p), random(p * 1.1));
    }
    
    float getGlow(float dist, float radius, float intensity) {
        return pow(radius/(dist+0.001), ${settings.intensity.toFixed(1)});
    }
    
    void main() {
        float t = 1.0 + time * 0.01;
        const float layers = ${settings.layers}.0;
        const float scale = ${settings.scale}.0;
        const float del = 1.0/layers;
        
        vec3 col = vec3(0.0);
        
        for(float i = 0.0; i < ${settings.particleDensity.toFixed(1)}; i += del) {
            float depth = fract(i + t);
            vec2 rot = vec2(cos(t), sin(t));
            vec2 centre = rot * 0.2 * depth + 0.5;
            vec2 uv = (gl_FragCoord.xy - centre * vec2(width, height)) / width;
            
            float rotationAngle = time * -0.1;
            mat2 rotation = mat2(
                cos(rotationAngle), -sin(rotationAngle),
                sin(rotationAngle), cos(rotationAngle)
            );
            uv *= rotation;
            uv *= mix(scale, 0.0, depth);
            
            vec2 fl = floor(uv);
            vec2 local_uv = uv - fl - 0.5;
    
            for(int j = -1; j <= 1; j++) {
                for(int k = -1; k <= 1; k++) {
                    vec2 cell = vec2(float(j), float(k));
                    vec2 index = fl + cell;
                    vec2 seed = 128.0 * i + index;
                    vec2 pos = cell + 0.9 * (random2(seed) - 0.5);
                    float phase = 128.0 * random(seed);
                    vec3 tone = vec3(
                        random(seed),
                        random(seed + 1.0),
                        random(seed + 2.0)
                    );
                    float size = (${settings.particleSize.toFixed(2)} + 0.5 + 0.5 * sin(phase * t)) * depth;
                    float glow = size * getGlow(length(local_uv-pos), 0.03, 2.0);
                    col += ${settings.colorIntensity.toFixed(1)} * vec3(
                        ${settings.baseColor[0].toFixed(2)},
                        ${settings.baseColor[1].toFixed(2)},
                        ${settings.baseColor[2].toFixed(2)}
                    ) * glow + tone * glow;
                }
            }
        }
        
        // Финалная обработка цвета с оптимизациями для мобильных
                    float visibilityBoost = ${isMobile ? settings.mobileBoost.toFixed(1) : '1.0'};
            float minVisibility = ${settings.minVisible.toFixed(2)};
    
            col = 1.0 - exp(-col * visibilityBoost);
            col = max(col, vec3(minVisibility)); // Гарантируем минимальную видимость
    
            gl_FragColor = vec4(col, 0.8);
    }
    `;

    // Компиляция шейдеров
    function compileShader(source, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Ошибка компиляции шейдера:", gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    // Создание программы
    const vertexShader = compileShader(vertexSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentSource, gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Ошибка линковки программы:", gl.getProgramInfoLog(program));
        return;
    }

    gl.useProgram(program);

    // Настройка вершинного буфера
    const vertexData = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]);
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
        const dpr = isMobile ? Math.min(1.5, window.devicePixelRatio) : window.devicePixelRatio;
        canvas.width = Math.floor(canvas.offsetWidth * dpr);
        canvas.height = Math.floor(canvas.offsetHeight * dpr);

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

    // Функция анимации с контролем скорости для мобильных
    // Функция анимации с исправлением
    function draw(currentTime) {
        if (!lastTime) lastTime = currentTime;
        const delta = currentTime - lastTime;
        const targetFPS = isMobile ? 60 : 60;
        const frameInterval = 1000 / targetFPS;

        if (delta > frameInterval) {
            time += settings.dt; // ИСПРАВЛЕНО: Используем settings.dt вместо dt
            gl.uniform1f(timeHandle, time);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            lastTime = currentTime;
        }

        if (isMobile) {
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); // Принудительный первый рендер
        }

        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);

    console.log('WebGL settings:', settings);
    console.log('Mobile:', isMobile, 'DPR:', window.devicePixelRatio, 'Canvas size:', canvas.width, canvas.height);

});