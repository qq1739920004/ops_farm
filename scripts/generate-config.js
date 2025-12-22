const fs = require('fs');
const path = require('path');

// 生成配置文件的脚本
function generateConfig(outputDir, envVars) {
  const configTemplate = `
window.APP_CONFIG = {


  // 重要提示：如果需要将API请求指向特定服务器，请将相对路径改为完整URL
  // 例如：将 '/gateway' 改为 'http://140.207.166.210:9030/gateway' 或 'https://cloud.sinognss.com/gateway'
  // /gateway与http://140.207.166.210:9030/gateway效果一致，如果只写/gateway那就自动使用当前服务器地址
  
  // 主要API接口地址
  VITE_APP_BASE_API: '${envVars.VITE_APP_BASE_API || '/gateway'}',
  
  
  // 无网关API地址
  VITE_APP_nogate_API: '${envVars.VITE_APP_nogate_API || ''}',
  
  // WebSocket连接地址（车辆实时轨迹）
  VITE_APP_BASE_WS: '${envVars.VITE_APP_BASE_WS || 'ws://140.207.166.210:9034/websocket'}',
  
  // 模式配置
  // 1: 只显示智慧农场菜单，1以外的值: 所有菜单
  VITE_APP_Model: '${envVars.VITE_APP_Model || '1'}'
};`;

  const configPath = path.join(outputDir, 'config.js');
  
  // 确保目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // 写入配置文件
  fs.writeFileSync(configPath, configTemplate, 'utf8');
  console.log(`✓ 配置文件已生成: ${configPath}`);
}

module.exports = { generateConfig };
