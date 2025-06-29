const fs = require('fs');
const pdf = require('pdf-parse');



const dataBuffer = fs.readFileSync('/home/lonemohsin/Downloads/pdfcoffee.com_renegade-immortal-pdf-free.pdf');

pdf(dataBuffer).then(function(data) {
  console.log('Total Pages:', data.numpages);
  console.log('Info:', data.info);
  console.log('Text Preview:\n', data.text.slice(0, 5000)); // just first 1000 chars
  fs.writeFileSync('output.txt', data.text)
});
