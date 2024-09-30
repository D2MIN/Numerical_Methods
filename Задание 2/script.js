// Функция для парсинга данных из строки
function parseData(dataString) {
    const lines = dataString.trim().split('\n');
    return lines.map(line => {
        const [x, y] = line.split(' ').map(Number);
        return { x, y };
    });
}

// Функция для рисования графика
function drawChart(data) {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;

    // Находим минимальные и максимальные значения
    const xValues = data.map(point => point.x);
    const yValues = data.map(point => point.y);
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);

    // Функции для преобразования координат
    const scaleX = (x) => padding + (x - xMin) / (xMax - xMin) * chartWidth;
    const scaleY = (y) => canvas.height - padding - (y - yMin) / (yMax - yMin) * chartHeight;

    // Рисуем оси
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // Рисуем точки и линии
    ctx.beginPath();
    ctx.moveTo(scaleX(data[0].x), scaleY(data[0].y));
    for (let i = 1; i < data.length; i++) {
        ctx.lineTo(scaleX(data[i].x), scaleY(data[i].y));
    }
    ctx.strokeStyle = 'blue';
    ctx.stroke();

    // Рисуем точки
    ctx.fillStyle = 'red';
    data.forEach(point => {
        ctx.beginPath();
        ctx.arc(scaleX(point.x), scaleY(point.y), 3, 0, 2 * Math.PI);
        ctx.fill();
    });

    // Подписи осей
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.fillText('X', canvas.width - padding + 10, canvas.height - padding + 20);
    ctx.fillText('Y', padding - 20, padding - 10);
}

// Функция для загрузки данных и отрисовки графика
function loadDataAndDrawChart() {
    fetch('output.txt')
        .then(response => response.text())
        .then(data => {
            const parsedData = parseData(data);
            drawChart(parsedData);
        })
        .catch(error => console.error('Ошибка при загрузке данных:', error));
}

// Вызываем функцию после загрузки страницы
window.onload = loadDataAndDrawChart;