// // /tests/compiler.spec.js
// const formily_flowise_compiler = require('../index.js');
// const fs = require('fs');
// const path = require('path');

// console.log('formily_flowise_compiler', formily_flowise_compiler);

// // Helper function to read JSON files
// const readJSON = (filePath) => {
//   return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
// };

// // Sample test
// describe('Simple Math Test', () => {
//   it('should return 9 for 4 + 5', () => {
//     const sum = 4 + 5;
//     expect(sum).toBe(9);
//   });
// });

// describe('formily_flowise_compiler', () => {
//   const testCases = [
//     { input: 'formily_input1.json', output: 'flowise_output1.json' },
//     { input: 'formily_input2.json', output: 'flowise_output2.json' },
//     { input: 'formily_select1.json', output: 'flowise_select1.json' },
//     { input: 'formily_select2.json', output: 'flowise_select2.json' },
//     { input: 'formily_mix1.json', output: 'flowise_mix1.json' },
//     { input: 'formily_space.json', output: 'flowise_space.json' },
//     { input: 'formily_validators.json', output: 'flowise_validators.json' },
//   ];

//   testCases.forEach(({ input, output }) => {
//     it(`should correctly compile ${input} to ${output}`, () => {
//       const inputPath = path.resolve(__dirname, 'formily', input);
//       const outputPath = path.resolve(__dirname, 'flowise', output);

//       const formilyInput = readJSON(inputPath);
//       const expectedOutput = readJSON(outputPath);

//       const compiledOutput = formily_flowise_compiler(formilyInput);

//       expect(compiledOutput).toEqual(expectedOutput);
//     });
//   });
// });
