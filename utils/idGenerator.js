const shortid = require('shortid');

const generateBase62Id = () => shortid.generate();

module.exports = generateBase62Id;