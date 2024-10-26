const fs = require('fs');
const { parse } = require('path');

// Чтение и парсинг файла input.txt
function parseInput(filename) {
    const content = fs.readFileSync(filename, 'utf-8').trim().split('\n');
    const numVariables = parseInt(content[0], 10);
    const initialGuess = content[1].split(' ').map(parseFloat);
    const equations = content.slice(2).map(eq => new Function('x', 'y', `return ${eq};`));
    return { numVariables, initialGuess, equations };
}

// Запись результата в output.txt
function writeOutput(filename, result) {
    fs.writeFileSync(filename, `Решение системы:\n${result.join('\n')}`, 'utf-8');
}

// Вычисление значения функций системы
function evaluateSystem(equations, variables) {
    return equations.map(fn => fn(...variables));
}

// Численное приближение Якоби (частные производные функций по переменным)
function computeJacobian(equations, variables, delta = 1e-5) {
    const numVars = variables.length;
    const jacobian = Array.from({ length: equations.length }, () => new Array(numVars).fill(0));

    for (let i = 0; i < equations.length; i++) {
        for (let j = 0; j < numVars; j++) {
            const variablesDelta = [...variables];
            variablesDelta[j] += delta;
            const f1 = equations[i](...variablesDelta);
            const f0 = equations[i](...variables);
            jacobian[i][j] = (f1 - f0) / delta;
        }
    }
    return jacobian;
}

// Решение системы методом Ньютона
function solveNewtonSystem(equations, initialGuess, tolerance = 1e-7, maxIterations = 100) {
    let variables = [...initialGuess];
    const jacobian = computeJacobian(equations, variables);

    for (let iteration = 0; iteration < maxIterations; iteration++) {
        const F = evaluateSystem(equations, variables);
        
        // Проверка на сходимость
        const error = Math.sqrt(F.reduce((sum, value) => sum + value ** 2, 0));
        if (error < tolerance) return variables;

        // Решение системы уравнений Якоби * Δx = -F
        const deltaX = solveLinearSystem(jacobian, F.map(f => -f));

        // Обновление переменных
        variables = variables.map((v, i) => v + deltaX[i]);
    }
    throw new Error('Решение не сошлось');
}

// Решение линейной системы методом Гаусса
function solveLinearSystem(matrix, vector) {
    const n = matrix.length;
    const augmentedMatrix = matrix.map((row, i) => [...row, vector[i]]);

    for (let i = 0; i < n; i++) {
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(augmentedMatrix[k][i]) > Math.abs(augmentedMatrix[maxRow][i])) maxRow = k;
        }

        [augmentedMatrix[i], augmentedMatrix[maxRow]] = [augmentedMatrix[maxRow], augmentedMatrix[i]];

        for (let k = i + 1; k < n; k++) {
            const factor = augmentedMatrix[k][i] / augmentedMatrix[i][i];
            for (let j = i; j <= n; j++) {
                augmentedMatrix[k][j] -= factor * augmentedMatrix[i][j];
            }
        }
    }

    const solution = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        solution[i] = augmentedMatrix[i][n] / augmentedMatrix[i][i];
        for (let k = i - 1; k >= 0; k--) {
            augmentedMatrix[k][n] -= augmentedMatrix[k][i] * solution[i];
        }
    }

    return solution;
}

// Основная программа
try {
    const { numVariables, initialGuess, equations } = parseInput('input.txt');
    const solution = solveNewtonSystem(equations, initialGuess);
    writeOutput('output.txt', solution);
    console.log('Решение записано в output.txt');
} catch (error) {
    console.error('Ошибка:', error.message);
}
