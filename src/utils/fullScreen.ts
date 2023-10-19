export function fullScreen(){
  if (!document.fullscreenElement) {
    // 进入全屏
    document.documentElement.requestFullscreen().catch(err => {
      alert(`全屏失败: ${err.message} (${err.name})`);
    });
  } else {
    // 退出全屏
    document.exitFullscreen();
  }
}