const fs = require('fs/promises');

async function readFile(path){
    const expression = await fs.readFile(path,{encode:'utf-8'},(err)=>{
        if(err) return 'File not be reading';
    });

    return(expression.toString());
}

async function writeFile(path, data){
    try {
        await fs.writeFile(path, data);
        console.log(`Ответ записан в файл ${path}`);
    } catch (err) {
        console.log('Ошибка при записи в файл');
    }
}

function Func(expression, xValue){
    const modifiedExpression = expression.replace(/x/g, xValue);
    const result = eval(modifiedExpression);
    return(result);
} 

function SteffencensMethod(expression,x,accuracy){
    let nextX = x - ( Func(expression,x)**2 ) / ( Func(expression, x + Func(expression,x))- Func(expression,x) );
    if(Func(expression,nextX) < accuracy){
        return(nextX);
    }else{
        return SteffencensMethod(expression,nextX,accuracy);
    }
}

function calcFirstX(expression){
    for(let i = 0; i < 10; i++){
        if(Func(expression, i) < 0 && Func(expression, i+1) > 0){
            return ( (i+i+1)/2 ) + 0.1;
        }
    }
}

async function Main(){
    const expression = await readFile('./input.txt');
    const firstX = calcFirstX(expression);
    const answer = SteffencensMethod(expression, firstX, 0.0001);
    await writeFile('output.txt', answer.toString());
}

Main();

// ( (x ** 5) / 2 - 4 ) * 10 --------- 1.5157165676643176
// x ** 2 - 2 --------- 1.4142176741715777