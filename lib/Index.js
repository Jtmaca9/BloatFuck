'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _readlineSync = require('readline-sync');

var _readlineSync2 = _interopRequireDefault(_readlineSync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PATH = process.argv[2];
var Memory = {};
var Buffer = '';
var pointer = 0;

_fs2.default.readFile('./Files/' + PATH, 'utf8', function (err, data) {
  if (err) throw err;
  console.log('Loaded: ' + PATH);
  parseBF(data);
  //memoryDump();
  //console.log('Final Buffer: ', Buffer);
});

function parseBF(data) {
  for (var i = 0; i < data.length; i++) {
    switch (data[i]) {
      case '+':
        if (Memory[pointer]) {
          if (parseInt(Memory[pointer])) {
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
        Memory[pointer] = _readlineSync2.default.question('> ');
        break;
      case '*':
        console.log(Buffer);
        break;
      case '#':
        Buffer = '';
        break;
      case '!':
        for (var key in Memory) {
          delete Memory[key];
        }break;
      case '@':
        i = -1;
        pointer = 0;
        break;
      case '=':
        if (Memory[Memory[pointer]]) parseBF(Memory[Memory[pointer]]);
        break;
      case '{':
        var maxFuncBlockValue = getBlockValues(data, i);
        saveFunction(grabBlock(data, i, maxFuncBlockValue), pointer);
        i += maxFuncBlockValue - 1;
        break;
      case '[':
        var maxLoopBlockValue = getBlockValues(data, i);
        loop(grabBlock(data, i, maxLoopBlockValue));
        i += maxLoopBlockValue - 1;
        break;
      case '$':
        memoryDump();
        break;
    }
  }
}

function getBlockValues(data, i) {
  var openers = 1;
  var j = 1;
  for (j; openers > 0; j++) {
    switch (data[i + j]) {
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
  var block = '';
  var val = i + 1;
  for (val; val < i + j - 1; val++) {
    block += data[val];
  }
  return block;
}

function loop(bf) {
  var value = pointer;
  while (Memory[value] != 0) {
    parseBF(bf);
  }
}

function saveFunction(bf, value) {
  Memory[value] = bf;
}

function memoryDump() {
  console.log('MEMORY');
  console.log('Pointer -> ', pointer);
  Object.keys(Memory).forEach(function (key, i) {
    return console.log(i + '. ' + Memory[key]);
  });
}