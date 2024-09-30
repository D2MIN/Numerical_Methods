const fs = require('fs');

// Функция для получения матрицы из строки
function parseMatrix(data) {
    return data.trim().split('\n').map(row => row.split(' ').map(Number));
}

// Функция для записи матрицы в файл
function writeMatrixToFile(filename, matrix) {
    const data = matrix.map(row => row.join(' ')).join('\n');
    fs.writeFileSync(filename, data);
}

// Функция для выполнения операций с матрицами
function inverseMatrix(matrix) {
    const n = matrix.length;

    // Создаем единичную матрицу для хранения обратной матрицы
    const augmentedMatrix = matrix.map((row, i) => [...row, ...Array(n).fill(0).map((_, j) => (i === j ? 1 : 0))]);

    // Прямой ход
    for (let i = 0; i < n; i++) {
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(augmentedMatrix[k][i]) > Math.abs(augmentedMatrix[maxRow][i])) {
                maxRow = k;
            }
        }

        // Меняем строки местами
        [augmentedMatrix[i], augmentedMatrix[maxRow]] = [augmentedMatrix[maxRow], augmentedMatrix[i]];

        // Нормализуем текущую строку
        const diagElem = augmentedMatrix[i][i];
        if (diagElem === 0) throw new Error('Матрица вырождена и не имеет обратной матрицы.');
        for (let j = 0; j < 2 * n; j++) {
            augmentedMatrix[i][j] /= diagElem;
        }

        // Обнуляем остальные элементы в текущем столбце
        for (let k = 0; k < n; k++) {
            if (k !== i) {
                const factor = augmentedMatrix[k][i];
                for (let j = 0; j < 2 * n; j++) {
                    augmentedMatrix[k][j] -= factor * augmentedMatrix[i][j];
                }
            }
        }
    }

    // Извлекаем обратную матрицу
    return augmentedMatrix.map(row => row.slice(n));
}

// Основная функция
function main() {
    // Чтение входного файла
    const inputFile = 'input.txt';
    const outputFile = 'output.txt';
    const data = fs.readFileSync(inputFile, 'utf8');
    const matrix = parseMatrix(data);

    try {
        const inverse = inverseMatrix(matrix);
        
        writeMatrixToFile(outputFile, inverse);
        console.log('Обратная матрица успешно записана в output.txt');
    } catch (error) {
        console.error('Ошибка:', error.message);
    }
}

main();
