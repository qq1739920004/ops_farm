import './Polyfill'

// 高版本chrome > 80 中 格式化后存在时间与日期无空格的bug；
function timeTrans(tiemStamp) {
    return new Date(tiemStamp).toLocaleString('chinese', {hour12: false}).split('/').join('-');
}

function dateTimeTrans(timestamp) {
    try {
        if(!timestamp) return '/'
        let dateObj = timestamp ? new Date(timestamp) : new Date();
        let dateString = dateObj.toLocaleDateString().split('/').map( i => i.padStart(2, 0)).join('-');
        let timeString = dateObj.toTimeString().slice(0, 8);
        return dateString + ' ' + timeString;
    } catch (error) {
        console.log(error);
        return '/';
    }
}

export { dateTimeTrans }

