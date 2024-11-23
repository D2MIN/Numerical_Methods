const fs = require('fs/promises');

// Чтение файла input.txt
async function readFileAsObject() {
    try {
        const data = await fs.readFile('input.txt', 'utf8'); // Асинхронное чтение файла
        const obj = JSON.parse(data); // Преобразование строки в объект
        console.log('Файл успешно прочитан');
        return obj; // Возвращаем объект
    } catch (err) {
        console.error('Ошибка при чтении файла:', err);
    }
}

async function writeFileAsObject(data) {
    try {
        await fs.writeFile('output.txt', data, 'utf8'); // Асинхронное запись файла
        console.log('Файл успешно записан');
    } catch (err) {
        console.error('Ошибка при записи файла:', err);
    }
}

function calcFunction(func,x){
    const answer = eval(func.replace('x', x));
    return answer;
}

function sumFunc(func,a,b,n){
    let sum = 0;
    for(let i=a; i <= b; i+=n){
        sum += calcFunction(func, i);
    }
    return sum;
}

function calcItegral(a,n,b,func,exp){
    const delta = n;
    let flag = true;
    let start = a;
    let end = a;
    while(flag){
        const startEndValue = (calcFunction(func,end) - calcFunction(func,start))/2
        const answer = delta * (startEndValue + sumFunc(func,start,end,n));
        if(Math.abs(answer - b) > exp){
            end += n;
        }else{
            flag = false;
            return end;
        }
    }
}

async function main(){
    const inputObj = await readFileAsObject();
    const answer = calcItegral(inputObj.a,inputObj.n,inputObj.b,inputObj.function,inputObj.exp);
    console.log(answer)
    // writeFileAsObject(answer)
}


main();