import i18n from 'sino-i18n-v3';
export function getCurrentDateTime() {
  // 获取当前时间
  const now = new Date();

  // 格式化日期部分为 'YYYY.MM.DD' 格式
  const date = `${now.getFullYear()}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getDate().toString().padStart(2, '0')}`;

  // 获取当前星期i18n.global.t(errorCode[code])
  const weekDays = [i18n.global.t('perception.Sunday'), i18n.global.t('perception.Monday'), i18n.global.t('perception.Tuesday'), i18n.global.t('perception.Wednesday'), i18n.global.t('perception.Thursday'),i18n.global.t('perception.Friday'), i18n.global.t('perception.Saturday')];
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
//获取当天0点和当前时间
export function getCurrentTimeAndMidnight(): {st:string, et:string} {
  const currentDate = new Date();
  
  const midnightTime = new Date(currentDate);
  midnightTime.setHours(0, 0, 0, 0);
  
  currentDate.setMinutes(0, 0, 0);
  
  const midnightTimeString = `${midnightTime.getFullYear()}-${String(midnightTime.getMonth() + 1).padStart(2, '0')}-${String(midnightTime.getDate()).padStart(2, '0')} 00:00:00`;
  const currentTimeString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')} ${String(currentDate.getHours()).padStart(2, '0')}:00:00`;

  return {st:midnightTimeString, et:currentTimeString};
}