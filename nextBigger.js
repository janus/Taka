function nextBigger(num) {
    if(Number.isInteger(num)) {
        if (num <= 11) {
            return -1;
        }
        let numToString = num.toString(), arrayOfStringMain = numToString.split('');
        let arrayLen  = arrayOfStringMain.length - 1 ,minimumNextBigger = -1 ,nextBiggerNumber;
        let llen = arrayLen, k = 0 ,newNextBigger = -1;
        while(k <= llen ) {
            let arrayOfString = [...arrayOfStringMain];   
            let len = arrayLen ,m = 0;
            minimumNextBigger =  -1;
            for(let i = len; (i  - k ) >= 1; i--) {
                if((i - k === 1) && (arrayOfString[i - k] === '0')){
                    break;
                }
                if(arrayOfString[i - k] > arrayOfString[i - k - 1]){     
                    [arrayOfString[i - k], arrayOfString[i  - k - 1]] = [arrayOfString[i  - k - 1], arrayOfString[i - k]];
                    nextBiggerNumber = parseInt(arrayOfString.join(''));
                    if(nextBiggerNumber > num) {
                        if((minimumNextBigger === -1) || (nextBiggerNumber < minimumNextBigger)) {
                            minimumNextBigger = nextBiggerNumber;
                        }                
                    } 
                    m++;
                    break;
                } else {
                    m++;
                    [arrayOfString[i - k], arrayOfString[i  - k - 1]] = [arrayOfString[i - k - 1], arrayOfString[i - k]];
                }
            }
            while(len >= 0){
                for(let i = llen; i >= 1; i--){
                    if((i  <=  (llen - m - 1)) || ((i === 1) && (arrayOfString[i] === '0'))) break;
                    if(arrayOfString[i] > arrayOfString[i - 1]){
                        [arrayOfString[i], arrayOfString[i - 1]] = [arrayOfString[i - 1], arrayOfString[i]];
                        nextBiggerNumber = parseInt(arrayOfString.join(''));
                        if(nextBiggerNumber > num) {
                            if((minimumNextBigger === -1) || (nextBiggerNumber < minimumNextBigger)) {
                                minimumNextBigger = nextBiggerNumber;
                            }                
                        } 
                        break;
                    } else {
                        [arrayOfString[i], arrayOfString[i - 1]] = [arrayOfString[i - 1], arrayOfString[i]];
                        nextBiggerNumber = parseInt(arrayOfString.join(''));
                        if(nextBiggerNumber > num) {
                            if((minimumNextBigger === -1) || (nextBiggerNumber < minimumNextBigger)) {
                                minimumNextBigger = nextBiggerNumber;
                            }                
                        } 
                    }
                }
                len--;
            }
            if(minimumNextBigger !== -1) {
                if((newNextBigger === -1)|| (minimumNextBigger < newNextBigger)) {
                    newNextBigger = minimumNextBigger;
                } 
            }
            k++;
        }
        return newNextBigger;
    }
    return -1;
}


console.log(nextBigger(12))
console.log(nextBigger(513))
console.log(nextBigger(2017))
console.log(nextBigger(2583))
console.log(nextBigger(4031))
console.log(nextBigger(2643))
console.log(nextBigger(765976))
console.log(nextBigger(765976))
console.log(nextBigger(4031))
console.log(nextBigger(2643))
console.log(nextBigger(12))
console.log(nextBigger(513))
console.log(nextBigger(144))
console.log(nextBigger(280))
console.log(nextBigger(1157943))
console.log(nextBigger(6496520729552))