exports.convertArrayKeyToString =
    (array) => array.reduce((final, value) => `${final},${value.toString()}`);
