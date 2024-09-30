const fs = require('fs');

// Функция для чтения данных из файла
function readInput(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.trim().split('\n');
    const matrix = lines.map(line => line.split(' ').map(Number));
    return matrix;
}

// Функция для записи данных в файл
function writeOutput(filePath, matrix) {
    const lines = matrix.map(row => row.join(' ')).join('\n');
    fs.writeFileSync(filePath, lines);
}

// Функция для вычисления обратной матрицы методом Гаусса
function inverseMatrix(matrix) {
    const n = matrix.length;
    const augmentedMatrix = matrix.map((row, i) => [...row, ...Array(n).fill(0).map((_, j) => i === j ? 1 : 0)]);

    for (let i = 0; i < n; i++) {
        // Приведение диагонального элемента к 1
        const diagElement = augmentedMatrix[i][i];
        for (let j = 0; j < 2 * n; j++) {
            augmentedMatrix[i][j] /= diagElement;
        }

        // Обнуление элементов под диагональю
        for (let k = 0; k < n; k++) {
            if (k !== i) {
                const factor = augmentedMatrix[k][i];
                for (let j = 0; j < 2 * n; j++) {
                    augmentedMatrix[k][j] -= factor * augmentedMatrix[i][j];
                }
            }
        }
    }

    // Извлечение обратной матрицы
    const inverse = augmentedMatrix.map(row => row.slice(n));
    return inverse;
}

// Основная функция
function main() {
    const inputMatrix = readInput('input.txt');
    const inverse = inverseMatrix(inputMatrix);
    writeOutput('output.txt', inverse);
}

main();
