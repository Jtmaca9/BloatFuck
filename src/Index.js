import fs from 'fs';
import readlineSync from 'readline-sync';

const PATH = process.argv[2];
let Memory = {};
let Buffer = '';
let pointer = 0;

fs.readFile(`./Files/${PATH}`, 'utf8', function(err, data) {
  if (err) throw err;
  console.log(`Loaded: ${PATH}`);
  parseBF(data);
});

function parseBF(data) {
  for (let i = 0; i < data.length; i++) {
    switch (data[i]) {
      case '+':
        if (Memory[pointer]) {
          if(parseInt(Memory[pointer])) {
             Memory[pointer]++;
           } else {
             Memory[pointer] = 1;
           }
        } else {
          Memory[pointer] = 1;
        }
        break;
      case '-':
        if (Memory[pointer]) {
          Memory[pointer]--;
        } else {
          Memory[pointer] = -1;
        }
        break;
      case '<':
        if (pointer > 0) pointer--;
        break;
      case '>':
        pointer++;
        if (!Memory[pointer]) Memory[pointer] = 0;
        break;
      case '.':
        Buffer += String.fromCharCode(Memory[pointer]);
        break;
      case ':':
        Buffer += Memory[pointer];
        break;
      case ',':
        Memory[pointer] = readlineSync.question('> ');
        break;
      case '*':
        console.log(Buffer);
        break;
      case '#':
        Buffer = '';
        break;
      case '!':
        for (let key in Memory) delete Memory[key];
        break;
      case '@':
        i = -1;
        pointer = 0;
        break;
      case '=':
        if(Memory[Memory[pointer]]) parseBF(Memory[Memory[pointer]]);
        break;
      case '{':
        let maxFuncBlockValue = getBlockValues(data, i);
        saveFunction(grabBlock(data, i, maxFuncBlockValue), pointer);
        i += (maxFuncBlockValue-1);
        break;
      case '[':
        let maxLoopBlockValue = getBlockValues(data, i);
        loop(grabBlock(data, i, maxLoopBlockValue));
        i += (maxLoopBlockValue-1);
        break;
      case '$':
        memoryDump();
        break;
    }
  }
}

function getBlockValues(data, i) {
  let openers = 1;
  let j = 1;
  for (j; openers > 0; j++) {
    switch (data[i+j]) {
      case '[':
      case '{':
        openers++;
        break;
      case ']':
      case '}':
        openers--;
        break;
    }
  }
  return j;
}

function grabBlock(data, i, j) {
  let block = '';
  let val = i+1;
  for (val; val < (i+j-1); val++) {
   block += data[val];
  }
  return block;
}

function loop(bf) {
  const value = pointer;
  while (Memory[value] != 0) parseBF(bf);
}

function saveFunction(bf, value) {
  Memory[value] = bf;
}

function memoryDump() {
  console.log('MEMORY');
  console.log('Pointer -> ', pointer);
  Object.keys(Memory).forEach((key, i) => console.log(i + '. ' + Memory[key]));
}
