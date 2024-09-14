### Описание кода для решения СЛАУ

## Функици 

4. *main()* - главная функция запускающая остальные функции и проверяющая матрицу на размерность
1. *readInputFile()* - Функция для чтения файла `input` и преобразования данных в нужный вид
2. *writeOutputFile()* - Функция для записи ответа в файл `output`
3. *solve()* - Функция вычисления СЛАУ методом Гауса

### Функция *solve()*

В функции используется метод Гауса для решения СЛАУ.

В начале функция находит максимальные элементы в столбце и меняем строки для того что бы избежать деление на 0 и сделать расчеты более точными.
```js
let max = i;
        for (let j = i + 1; j < n; j++) {
            if (Math.abs(matrix[j][i]) > Math.abs(matrix[max][i])) {
                max = j;
            }
        }
        // Меняем местами строки
        [matrix[i], matrix[max]] = [matrix[max], matrix[i]];
        [results[i], results[max]] = [results[max], results[i]];
```

Далее идёт метод гауса, а именно прямой ход метода.
```js
// Прямой ход
        for (let j = i + 1; j < n; j++) {
            const factor = matrix[j][i] / matrix[i][i];
            for (let k = i; k < n; k++) {
                matrix[j][k] -= factor * matrix[i][k];
            }
            results[j] -= factor * results[i];
            console.log(results)
        }
```

 В нем мы приводим матрицу к верхне-диагональному уровню отнимая от элемента число равное ему
```js
matrix[j][k] -= factor * matrix[i][k];
```
После чего в вектор столбце правой части у строки равной строке с 0 отнимаем значение равному деленому на `коэфициент зануления` строки выше 
```js
results[j] -= factor * results[i];
```

После чего идет обратный ход метода Гауса
```js
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
```

В нем мы находим иксы по формуле - x_i = (b_i - a_ij * x_j) / a_ii
Где a_ij * x_j это sum
```js
sum += matrix[i][j] * solution[j]
```
А x_i
```js
solution[i] = (results[i] - sum) / matrix[i][i];
```