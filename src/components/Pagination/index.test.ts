import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Pagination from './index.vue'

// Mock Element Plus 组件
vi.mock('element-plus', () => ({
  ElPagination: {
    name: 'ElPagination',
    template: '<div class="el-pagination-mock" @click="$emit(\'size-change\', 20)"><slot></slot></div>',
    props: ['currentPage', 'pageSize', 'total', 'pageSizes', 'layout', 'disabled']
  }
}))

describe('Pagination 组件测试', () => {
  const mountComponent = (props = {}) => {
    return mount(Pagination, {
      props: {
        total: 100,
        currentPage: 1,
        pageSize: 10,
        disabled: false,
        ...props
      }
    })
  }

  it('应正确渲染默认 props', () => {
    const wrapper = mountComponent()
    
    expect(wrapper.find('.Pagination_component').exists()).toBe(true)
    expect(wrapper.find('.pagination').exists()).toBe(true)
  })

  it('应接收并显示 total 属性', () => {
    const wrapper = mountComponent({ total: 500 })
    const vm = wrapper.vm as any
    
    expect(vm.total).toBe(500)
  })

  it('应接收并显示 currentPage 属性', () => {
    const wrapper = mountComponent({ currentPage: 5 })
    const vm = wrapper.vm as any
    
    expect(vm.currentPage).toBe(5)
  })

  it('应接收并显示 pageSize 属性', () => {
    const wrapper = mountComponent({ pageSize: 50 })
    const vm = wrapper.vm as any
    
    expect(vm.pageSize).toBe(50)
  })

  it('应支持 disabled 属性', () => {
    const wrapper = mountComponent({ disabled: true })
    const vm = wrapper.vm as any
    
    expect(vm.disabled).toBe(true)
  })

  describe('事件处理', () => {
    it('handleSizeChange 应触发 pageChange 事件', () => {
      const wrapper = mountComponent({ currentPage: 2, pageSize: 10 })
      const vm = wrapper.vm as any
      
      // 调用 handleSizeChange 方法
      vm.handleSizeChange(30)
      
      expect(wrapper.emitted('pageChange')).toBeTruthy()
      expect(wrapper.emitted('pageChange')![0]).toEqual([{
        currentPage: 2,
        pageSize: 30
      }])
    })

    it('handleCurrentChange 应触发 pageChange 事件', () => {
      const wrapper = mountComponent({ currentPage: 1, pageSize: 20 })
      const vm = wrapper.vm as any
      
      // 调用 handleCurrentChange 方法
      vm.handleCurrentChange(3)
      
      expect(wrapper.emitted('pageChange')).toBeTruthy()
      expect(wrapper.emitted('pageChange')![0]).toEqual([{
        currentPage: 3,
        pageSize: 20
      }])
    })

    it('页码变化时应保留当前 pageSize', () => {
      const wrapper = mountComponent({ pageSize: 50 })
      const vm = wrapper.vm as any
      
      vm.handleCurrentChange(5)
      
      expect(wrapper.emitted('pageChange')![0][0].pageSize).toBe(50)
    })

    it('pageSize 变化时应保留当前页码', () => {
      const wrapper = mountComponent({ currentPage: 3 })
      const vm = wrapper.vm as any
      
      vm.handleSizeChange(100)
      
      expect(wrapper.emitted('pageChange')![0][0].currentPage).toBe(3)
    })
  })

  describe('默认值测试', () => {
    it('未传递 props 时应使用默认值', () => {
      const wrapper = mount(Pagination)
      const vm = wrapper.vm as any
      
      expect(vm.total).toBe(0)
      expect(vm.currentPage).toBe(1)
      expect(vm.pageSize).toBe(10)
      expect(vm.disabled).toBe(false)
    })
  })
})
