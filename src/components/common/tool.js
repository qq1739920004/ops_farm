function formatDate(val) {
    let date = new Date(val);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  }
  function formatDateTime(val) {
    let date = new Date(val);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    let d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
  }
  // 度分秒转换
function toLngLat(result) {
  if (result != '' && !isNaN(parseInt(result))) {
      var str1 = result.toString().split('.');
      var du1 = str1[0];
      var tp = '0.' + str1[1]
      tp = String(tp * 60);		// 这里进行了强制类型转换
      var str2 = tp.split('.');
      var fen = str2[0];
      tp = '0.' + str2[1];
      tp = tp * 60;
      var miao = tp;

      return (du1 + '°' + PrefixInteger(parseInt(fen, 10), 2) + '′' + miao.toFixed(5) + '″');
  } else {
      return '';
  }
}
function PrefixInteger(num, n) {
  return (Array(n).join(0) + num).slice(-n);
}
// 获取当前月有多少天
function mGetDate() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var d = new Date(year, month, 0);
  return d.getDate();
}
function getDayHour() {
  let dayHour = [];
  for (let i = 0; i <= 23; i++) {
      if (i == 23) {
          dayHour.push(i + '(时)');
      } else {
          dayHour.push(i.toString());
      }
  }
  return dayHour;
}
function getMonthDay() {
  let monthDay = [];
  let currentMonthDays = mGetDate();
  for (let i = 1; i <= currentMonthDays; i++) {
      if (i == currentMonthDays) {
          monthDay.push(i + '(日)');
      } else {
          monthDay.push(i.toString());
      }
  }
  return monthDay
}
  export { formatDate, toLngLat, mGetDate, getDayHour, getMonthDay, formatDateTime }
