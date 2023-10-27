import { Directive, DirectiveBinding } from 'vue'
//  el-select 懒加载
const loadMore: Directive = {
    beforeMount(el: any, binding: DirectiveBinding) {
        const selectDom = document.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        function loadMores(this: any) {
            const isBase = this.scrollHeight - this.scrollTop <= this.clientHeight
            if (isBase) {
                binding.value && binding.value()
            }
        }
        el.selectDomInfo = selectDom
        el.userLoadMore = loadMores
        selectDom?.addEventListener('scroll', loadMores)
    },
    beforeUnmount(el: any) {
        if (el.userLoadMore) {
            el.selectDomInfo.removeEventListener('scroll', el.userLoadMore)
            delete el.selectDomInfo
            delete el.userLoadMore
        }
    }
}
export default loadMore