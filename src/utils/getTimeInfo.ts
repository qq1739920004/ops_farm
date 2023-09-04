export function getCurrentDateTime() {
  // 获取当前时间
  const now = new Date();

  // 格式化日期部分为 'YYYY.MM.DD' 格式
  const date = `${now.getFullYear()}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getDate().toString().padStart(2, '0')}`;

  // 获取当前星期
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const week = weekDays[now.getDay()];

  // 格式化时间部分为 'HH:mm:ss' 格式
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  // 构建结果对象
  const result = {
    date,
    week,
    time
  };

  return result;
}