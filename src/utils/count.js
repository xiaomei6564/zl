//计算、最大、最小、合计、平均值
function cacl(arr, callback) {
  var ret; 
  for (var i = 0; i < arr.length; i++) {
      ret = callback(arr[i], ret);
  }
  return ret;
}
Array.prototype.max = function () {
  return cacl(this, function (item, max) {
      if (!(max > item)) {
          return item;
      } else {
          return max;
      }
  });
}; 
Array.prototype.min = function () {
  return cacl(this, function (item, min) {
      if (!(min < item)) {
          return item;
      } else {
          return min;
      }
  });
};
Array.prototype.sum = function () {
  return cacl(this, function (item, sum) {
      if (typeof (sum) == 'undefined') {
          return item;
      } else {
          return sum += item;
      }
  });
};
Array.prototype.avg = function () {
  if (this.length == 0) {
      return 0;
  }
  return this.sum() / this.length;
};

//最大值
export  function maxValue ( arr ){
  return arr.max()
}
//最小值
export  function minValue ( arr ){
  return arr.min()
}
//计算合计
export  function sumValue ( arr ){
  return arr.sum()
}
//平均值
export function avgValue( arr ){
  console.log('arr',arr)
 return arr.avg()
}
 


