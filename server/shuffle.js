// function that "shuffles"/re-orders an array
// example:
// [1,2,3,4]
// // // => [3,1,4,2]
// [1,2,3,4]
// // // => [3,2,4,1]
// ...
module.exports = array => {
  var ctr = array.length,
    temp,
    index;
  while (ctr > 0) {
    index = Math.floor(Math.random() * ctr);
    ctr--;
    temp = array[ctr];
    array[ctr] = array[index];
    array[index] = temp;
  }
  return array;
};
