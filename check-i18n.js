// 用于检查国际化key是否完整的脚本
const fs = require('fs');
const path = require('path');

// 读取三个语言文件
const zh = require('./src/lang/language/zh.ts');
const en = require('./src/lang/language/en.ts');
const jp = require('./src/lang/language/jp.ts');

// 递归获取所有key
function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (let key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const zhKeys = new Set(getAllKeys(zh.default || zh));
const enKeys = new Set(getAllKeys(en.default || en));
const jpKeys = new Set(getAllKeys(jp.default || jp));

console.log('=== 中文有但英文缺失的key ===');
const missingInEn = [...zhKeys].filter(key => !enKeys.has(key));
missingInEn.forEach(key => console.log(key));

console.log('\n=== 中文有但日文缺失的key ===');
const missingInJp = [...zhKeys].filter(key => !jpKeys.has(key));
missingInJp.forEach(key => console.log(key));

console.log('\n=== 统计 ===');
console.log(`中文key总数: ${zhKeys.size}`);
console.log(`英文key总数: ${enKeys.size}`);
console.log(`日文key总数: ${jpKeys.size}`);
console.log(`英文缺失数: ${missingInEn.length}`);
console.log(`日文缺失数: ${missingInJp.length}`);
