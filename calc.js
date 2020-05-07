/*
Instructions

Given a mathematical expression as a string you must return the result as a number.
Numbers

Number may be both whole numbers and/or decimal numbers. The same goes for the returned result.
Operators

You need to support the following mathematical operators:

    Multiplication *
    Division / (as true division)
    Addition +
    Subtraction -

Operators are always evaluated from left-to-right, and * and / must be evaluated before + and -.
Parentheses

You need to support multiple levels of nested parentheses, ex. (2 / (2 + 3.33) * 4) - -6
Whitespace

There may or may not be whitespace between numbers and operators.

An addition to this rule is that the minus sign (-) used for negating numbers and parentheses will never be separated by whitespace. I.e., all of the following are valid expressions.

1-1    // 0
1 -1   // 0
1- 1   // 0
1 - 1  // 0
1- -1  // 2
1 - -1 // 2

6 + -(4)   // 2
6 + -( -4) // 10

And the following are invalid expressions

1 - - 1    // Invalid
1- - 1     // Invalid
6 + - (4)  // Invalid
6 + -(- 4) // Invalid

Validation

You do not need to worry about validation - you will only receive valid mathematical expressions following the above rules.


var tests = [
  ['1+1', 2],
  ['1 - 1', 0],
  ['1* 1', 1],
  ['1 /1', 1],
  ['-123', -123],
  ['123', 123],
  ['2 /2+3 * 4.75- -6', 21.25],
  ['12* 123', 1476],
  ['2 / (2 + 3) * 4.33 - -6', 7.732],
];

tests.forEach(function (m) {
  Test.assertEquals(calc(m[0]), m[1]);
});


*/



function checkPrecedence(opsLst, tkOps) {
    if(opsLst.length > 0) {
        let precedence = {'-': 1, '+': 1, '(': 0, '*': 3, '/': 3};
        let top = opsLst[opsLst.length - 1];
        if(precedence[tkOps] <= precedence[top]) {
            return false;
        }
    }
    return true;
}

function compute(op, valLst) {
    let leftVal,rightVal;
    if(valLst.length >= 1) {
        rightVal = valLst.pop();
        leftVal = valLst.pop();
        if(op === '+') {
            valLst.push(leftVal + rightVal);
        } else if (op === '-') {
            valLst.push(leftVal - rightVal);
        } else if(op === '*') {
            valLst.push(leftVal * rightVal);
        } else if (op === '/') {
            if(rightVal === 0) {
                throw new Error("Division by zero not allowed");
            }
            valLst.push(leftVal / rightVal);
        } else {
            throw new Error("Unknown operational code");
        }
    } else {
        throw new Error("There is not enough operand to complete this task");
    }
    return valLst;
}
// Type of expression
var ADD = 1;
var SUB = 2;
var MULT = 3;
var DIV  = 4;

//Token types
var INTEGER = 1;
var FRACTION = 2;
var SPACE = 3;
var OPERATORS = 4;

var ops = "*/+-()";


function tokenizer(string) {
    let len = string.length ,i = 0 , rtnList = [];
    while( i < len) {
        if(string[i] === ' '){
            rtnList.push([SPACE, SPACE]);
        } else {
            if((string[i] >= '0') && (string[i] <= '9')) {
                let accNum = string[i], countDot = 0;
                i++;
                while((i < len) && ((string[i] >= '0') && (string[i] <= '9') || string[i] === '.') ){
                    accNum += string[i];
                    countDot = string[i] === '.'? countDot + 1 : countDot;
                    i++;
                }
                if(countDot){
                    if(countDot > 1){
                        let message = "Only one dot is allowed in fraction " + accNum;
                        throw new Error(message);
                    }
                    rtnList.push([FRACTION , parseFloat(accNum)]);
                } else {
                    if(accNum[0] === '0'){
                        let message = "Zero can't start integer " + accNum;
                        throw new Error(message);
                    }
                    rtnList.push([INTEGER, parseInt(accNum)]);
                }
                continue;               
            } else {
                if(ops.includes(string[i])) {
                    rtnList.push([OPERATORS, string[i]]);
                }
            }
        }
        i++;
    }
    return rtnList;
}

function checkPrecedenceAndCompute(opsList, token, valList){
    if(!checkPrecedence(opsList, token[1])) {                
        valList = compute(opsList[opsList.length - 1], valList);
        opsList.pop();
        while(!checkPrecedence(opsList, token[1])){
            valList = compute(opsList[opsList.length - 1], valList);
            opsList.pop();
        }
    }
    return [valList, opsList];
}

var calculateExpression = function (tokens) {
    // evaluate `expression` and return result
    let tokenLen = tokens.length, opsList = [], valList = [];
    let token, ops;

    for(let i = 0; i < tokenLen; i++){
        token = tokens[i];
        if((token[0] === INTEGER) || (token[0] === FRACTION)) {
            valList.push(token[1]);         
            if (((i + 1) < tokenLen) && ("-/*+".includes(tokens[i + 1][1]))) {  
                [valList, opsList] = checkPrecedenceAndCompute(opsList, tokens[i + 1], valList);
                opsList.push(tokens[i + 1][1]);
                i++;
            } 
        } else if("-/*+".includes(token[1])){

            if((token[1] !== '+') && (token[1] !== '-')) {
                [valList, opsList] = checkPrecedenceAndCompute(opsList, token, valList);
                opsList.push(token[1]);
            } else {        
                if (((i + 1) < tokenLen) && ((tokens[i + 1][0] === INTEGER) || (tokens[i + 1][0] === FRACTION))) {
                    
                    let lindex = i - 1;
                    let val;
                    while(lindex >= 0) {
                        if("-+/*".includes(tokens[lindex][1])) {
                            val = token[1] === '-'? -1 *  tokens[i + 1][1] : tokens[i + 1][1];
                            valList.push(val);
                            i++;
                            break;
                        }
                        if((tokens[lindex - 1][0] === INTEGER) || (tokens[lindex - 1][0] === FRACTION)) {                        
                            [valList, opsList] = checkPrecedenceAndCompute(opsList, token, valList);
                            opsList.push(token[1]);
                            break;
                        }
                        lindex--;
                    }
                    if(lindex === -1){
                        val = token[1] === '-'? -1 *  tokens[i + 1][1] : tokens[i + 1][1];
                        valList.push(val);
                        i++;
                    }
                } else if(((i + 1) < tokenLen) && (tokens[i + 1][1] === '(')){
                    lindex = i - 1;
                    let updated = false;
                    while(lindex >= 0 && !"-+/*".includes(tokens[lindex][1])){
                        if(tokens[lindex][1] === ')' || tokens[lindex][0] === INTEGER || tokens[lindex][0] ===  FRACTION){
                            [valList, opsList] = checkPrecedenceAndCompute(opsList, token, valList);
                            opsList.push(token[1]);
                            opsList.push('(');
                            updated = true;
                            i++;
                            break;
                        }
                        lindex--;
                    }
                    if(!updated && token[1] === '-') {
                        opsList.push('(');
                        opsList.push('#'); //Hack to be used to negate the 
                        i++; 
                    }             
                } else {
                    [valList, opsList] = checkPrecedenceAndCompute(opsList, token, valList);
                    opsList.push(token[1]);
                }
            }
        } else if(token[1] === '(') {
            opsList.push(token[1]);
        } else if(token[1] === ')') {   
            ops = opsList.pop();             
            while(opsList.length > 0 && ops !== '(') {
                if(ops === '#') {
                    valList[valList.length - 1] = valList[valList.length - 1] * -1;
                    ops = opsList.pop();
                    continue;
                }
                valList = compute(ops, valList);
                ops = opsList.pop();
                if(ops === '(') break;
            }
        } 
    }
    while(opsList.length > 0) {
        ops = opsList.pop();
        valList = compute(ops, valList);
    }
    return [valList, opsList];
  };


var calc = function(expression){
    try{
        let [valList, opsList] = calculateExpression(tokenizer(expression));
        if((opsList.length > 0 && valList.length > 1) || (isNaN(valList[0]))) {
            let message = "Invalid Math expression " + expression;
            throw new Error(message);
        }
        return valList[0];
    } catch(e){
        console.error(e.message);
    }
};
var foo2 = "123.45*(678.90 / (-2.5+ 11.5)-(80 -19) *33.25) / 20 + 11";
var foo1 = "(123.45*(678.90 / (-2.5+ 11.5)-(((80 -(19))) *33.25)) / 20) - (123.45*(678.90 / (-2.5+ 11.5)-(((80 -(19))) *33.25)) / 20) + (13 - 2)/ -(-11) ";
//console.log(tokenizer("(1 - 2) + -(-(-(-4)))"));
//console.log(tokenizer('2 / (2 + 3) * 4.33 - -6'));
//console.log(calc('1+1'));
//console.log(calc('5*3'));
console.log(calc('6 + -(- 4)'));
var tests = [
    ['1+1', 2],
    ['1 - 1', 0],
    ['1* 1', 1],
    ['1 /1', 1],
    ['-123', -123],
    ['123', 123],
    ['2 /2+3 * 4.75- -6', 21.25],
    ['12* 123', 1476],
    ['2 / (2 + 3) * 4.33 - -6', 7.732],
    ['1-1', 0],
    ['1 -1', 0],
    ['1- 1', 0],
    ['1 - 1', 0],
    ['1- -1', 2],
    ['1 - -1', 2],
    ['6 + -(4)', 2],
    ['6 + -( -4)', 10],
    ["12*-1", -12],
    ["(1 - 2) + -(-(-(-4)))", 3],
    ["1 - -(-(-(-4)))", -3],
    ["((2.33 / (2.9+3.5)*4) - -6)", 7.45625],
    [foo2, -12042.760875],
    [foo1, 1]

  ];
/*
1 - - 1    // Invalid
1- - 1     // Invalid
6 + - (4)  // Invalid
6 + -(- 4) // Invalid
  1-1    // 0
  1 -1   // 0
  1- 1   // 0
  1 - 1  // 0
  1- -1  // 2
  1 - -1 // 2
  6 + -(4)   // 2
6 + -( -4) // 10
Expected: "12*-1" to be -12 but got undefined - Expected: -12, instead got: undefined
Expected: "((80 - (19)))" to be 61 but got undefined - Expected: 61, instead got: undefined
Expected: "(1 - 2) + -(-(-(-4)))" to be 3 but got undefined - Expected: 3, instead got: undefined
 Expected: "1 - -(-(-(-4)))" to be -3 but got undefined - Expected: -3, instead got: undefined
 Expected: "(123.45*(678.90 / (-2.5+ 11.5)-(((80 -(19))) *33.25)) / 20) - (123.45*(678.90 / (-2.5+ 11.5)-(((80 -(19))) *33.25)) / 20) + (13 - 2)/ -(-11) " to be 1 but got undefined - Expected: 1, instead got: undefined
Expected: "((2.33 / (2.9+3.5)*4) - -6)" to be 7.45625 but got undefined - Expected: 7.45625, instead got: undefined
Expected: "123.45*(678.90 / (-2.5+ 11.5)-(80 -19) *33.25) / 20 + 11" to be -12042.760875 but got undefined - Expected: -12042.760875, instead got: undefined
  */

/*
  for(let i = 0; i < tests.length; i++){
      console.log(calc(tests[i][0]));
      console.log(tests[i][1])
  }
*/