const fs = require('fs');

// Функция для считывания данных из файла
function readInputFile(filename) {
    const data = fs.readFileSync(filename, 'utf8');
    const lines = data.trim().split('\n');
    
    const matrix = [];
    const results = [];
    
    // Разбираем строки файла
    lines.forEach(line => {
        const [coeffStr, resultStr] = line.split(' = ');
        const coefficients = coeffStr.split(' ').map(Number);
        const result = Number(resultStr);
        
        matrix.push(coefficients);
        results.push(result);
    });
    
    return { matrix, results };
}

// Функция для записи решения в файл
function writeOutputFile(filename, solution) {
    fs.writeFileSync(filename, solution.join('\n'), 'utf8');
}

// Метод Гаусса для решения СЛАУ
function solve(matrix, results) {
    const n = results.length;
    
    for (let i = 0; i < n; i++) {
        // Поиск максимального элемента в столбце для избежания вырождения
        let max = i;
        for (let j = i + 1; j < n; j++) {
            if (Math.abs(matrix[j][i]) > Math.abs(matrix[max][i])) {
                max = j;
            }
        }
        // Меняем местами строки
        [matrix[i], matrix[max]] = [matrix[max], matrix[i]];
        [results[i], results[max]] = [results[max], results[i]];

        // Прямой ход
        for (let j = i + 1; j < n; j++) {
            const factor = matrix[j][i] / matrix[i][i];
            for (let k = i; k < n; k++) {
                matrix[j][k] -= factor * matrix[i][k];
            }
            results[j] -= factor * results[i];
            console.log(results)
        }
    }

    // Обратный ход
    const solution = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        let sum = 0;
        for (let j = i + 1; j < n; j++) {
            sum += matrix[i][j] * solution[j];
            
        }
        console.log(results[i],matrix[i][i]);
        solution[i] = (results[i] - sum) / matrix[i][i];
    }

    return solution;
}

// Основная функция
function main() {
    const { matrix, results } = readInputFile('input.txt');
    
    // Проверяем, что матрица квадратная
    const n = matrix.length;
    matrix.forEach(row => {
        if (row.length !== n) {
            throw new Error('Матрица должна быть квадратной.');
        }
    });

    const solution = solve(matrix, results);
    
    writeOutputFile('output.txt', solution);
    console.log('Решение записано в файл output.txt');
}

main();
