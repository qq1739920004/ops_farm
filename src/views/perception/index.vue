<template>
    <div class='container'>
       <!-- 面向经销展示内容区 -->
       <div class="screen" ref="screen">
        <div class="top">top</div>
        <div class="left">left</div>
        <div class="middle">middle</div>
        <div class="right">right</div>

       </div>
    </div>
</template>

<script setup lang='ts'>
import {ref,onMounted} from 'vue'
let screen =ref()
    onMounted(()=>{
        screen.value.style.transform=`scale(${getScale()}) translate(-50%,-50%)`
        console.log('guazai')
    })

    // 定义大屏缩放比例
    function getScale(w=1720,h=897){
        const ww=window.innerWidth/w
        const wh=window.innerHeight/h
        return ww<wh?ww:wh
    }
    // 监听屏幕变化
    window.onresize=()=>{
        screen.value.style.transform=`scale(${getScale()}) translate(-50%,-50%)`
    }
</script>

<style lang="scss" scoped>  
.container{
    width: calc(100vw - 210px) ;
    height: 100vh;
    background: url(../perception/image/scene.png);
    background-color: rgba(2, 28, 14, 1);
    background-size: cover;
    .screen{
        position: fixed;
        left: 60%;
        top: 50%;
        width: 1720px;
        height: 897px;
 transform-origin: left top;
        background-color: pink;
        .top{
            width: 100%;
            height: 40px;
        }
    }

}

    
</style>