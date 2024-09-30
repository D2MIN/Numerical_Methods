  const fs = require('fs');

  // Чтение входных данных из файла input.txt
  function readInput(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    const lines = data.trim().split('\n');
    const points = lines.map(line => {
      const [x, y] = line.trim().split(' ').map(Number);
      return { x, y };
    });
    return points;
  }

  // Решение системы линейных уравнений методом Гаусса
  function solveGauss(matrix, vector) {
    const n = vector.length;
    for (let i = 0; i < n; i++) {
      // Прямой ход метода Гаусса
      for (let j = i + 1; j < n; j++) {
        const factor = matrix[j][i] / matrix[i][i];
        for (let k = i; k < n; k++) {
          matrix[j][k] -= factor * matrix[i][k];
        }
        vector[j] -= factor * vector[i];
      }
    }
    
    // Обратный ход метода Гаусса
    const result = new Array(n);
    for (let i = n - 1; i >= 0; i--) {
      result[i] = vector[i] / matrix[i][i];
      for (let j = i - 1; j >= 0; j--) {
        vector[j] -= matrix[j][i] * result[i];
      }
    }
    
    return result;
  }

  // Вычисление кубических сплайнов
  function computeCubicSpline(points) {
    const n = points.length - 1;
    const h = new Array(n);
    const alpha = new Array(n);
    
    // Формула для вычисления шага h_i: h_i = x_(i+1) - x_i
    for (let i = 0; i < n; i++) {
      h[i] = points[i + 1].x - points[i].x;
      // Формула для вычисления alpha_i: alpha_i = 3/h_i * (f_(i+1) - f_i)
      alpha[i] = (3 / h[i]) * (points[i + 1].y - points[i].y);
    }
    
    // Матрицы для решения методом Гаусса
    const matrix = new Array(n - 1).fill(0).map(() => new Array(n - 1).fill(0));
    const b = new Array(n).fill(0);
    const d = new Array(n).fill(0);
    const c = new Array(n + 1).fill(0);
    
    // Формируем матрицу для решения системы
    // Формула для диагональных элементов: 2(h_(i-1) + h_i)
    // Формула для элементов над и под диагональю: h_i
    for (let i = 1; i < n; i++) {
      matrix[i - 1][i - 1] = 2 * (h[i - 1] + h[i]);
      if (i > 1) matrix[i - 1][i - 2] = h[i - 1];
      if (i < n - 1) matrix[i - 1][i] = h[i];
    }

    const rhs = new Array(n - 1);
    // Формула для правой части системы: 3((f_(i+1) - f_i)/h_i - (f_i - f_(i-1))/h_(i-1))
    for (let i = 1; i < n; i++) {
      rhs[i - 1] = 3 * ((points[i + 1].y - points[i].y) / h[i] - (points[i].y - points[i - 1].y) / h[i - 1]);
    }

    // Решаем систему уравнений
    const cReduced = solveGauss(matrix, rhs);

    // Восстанавливаем полный массив коэффициентов c
    for (let i = 1; i < n; i++) {
      c[i] = cReduced[i - 1];
    }

    // Вычисляем остальные коэффициенты
    // Формула для b_i: b_i = (f_(i+1) - f_i)/h_i - h_i(c_(i+1) + 2c_i)/3
    // Формула для d_i: d_i = (c_(i+1) - c_i)/(3h_i)
    for (let i = 0; i < n; i++) {
      b[i] = (points[i + 1].y - points[i].y) / h[i] - h[i] * (c[i + 1] + 2 * c[i]) / 3;
      d[i] = (c[i + 1] - c[i]) / (3 * h[i]);
    }

    return { a: points.map(p => p.y), b, c, d };
  }

  // Интерполяция по кубическому сплайну
  function splineInterpolation(spline, points, x) {
    const n = points.length - 1;
    let i = n - 1;
    for (let j = 0; j < n; j++) {
      if (x >= points[j].x && x <= points[j + 1].x) {
        i = j;
        break;
      }
    }

    const dx = x - points[i].x;
    // Формула для интерполяции: S_i(x) = a_i + b_i(x - x_i) + c_i(x - x_i)^2 + d_i(x - x_i)^3
    return spline.a[i] + spline.b[i] * dx + spline.c[i] * dx**2 + spline.d[i] * dx**3;
  }

  // Запись результата в файл output.txt
  function writeOutput(filename, results) {
    const output = results.map(res => `${res.x.toFixed(5)} ${res.y.toFixed(5)}`).join('\n');
    fs.writeFileSync(filename, output, 'utf-8');
  }

  // Основная функция
  function main() {
    const points = readInput('input.txt');
    const spline = computeCubicSpline(points);
    
    // Интерполируем значения для x от min до max с шагом 0.1
    const minX = points[0].x;
    const maxX = points[points.length - 1].x;
    const results = [];
    for (let x = minX; x <= maxX; x += 0.1) {
      const y = splineInterpolation(spline, points, x);
      results.push({ x, y });
    }
    
    writeOutput('output.txt', results);
    console.log('Интерполяция завершена, результат записан в output.txt');
  }

  main();