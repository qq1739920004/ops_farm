import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SvgIcon from './index.vue'

describe('SvgIcon 组件测试', () => {
  it('组件应存在', () => {
    expect(SvgIcon).toBeDefined()
  })

  it('应渲染 svg 元素', () => {
    const wrapper = mount(SvgIcon, {
      props: {
        icon: 'test-icon',
        prefix: 'icon'
      }
    })
    
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.find('svg').classes()).toContain('svg-icon')
  })

  it('应正确计算 symbolId', () => {
    const wrapper = mount(SvgIcon, {
      props: {
        icon: 'work',
        prefix: 'icon'
      }
    })
    
    const useElement = wrapper.find('use')
    expect(useElement.exists()).toBe(true)
    // xlink:href 在渲染后可能变为 href
    const href = useElement.attributes('href') || useElement.attributes('xlink:href')
    expect(href).toBe('#icon-work')
  })

  it('应应用 size 属性', () => {
    const wrapper = mount(SvgIcon, {
      props: {
        icon: 'test',
        size: '2em'
      }
    })
    
    const svg = wrapper.find('svg')
    const style = svg.attributes('style')
    expect(style).toContain('2em')
  })

  it('应应用 color 属性', () => {
    const wrapper = mount(SvgIcon, {
      props: {
        icon: 'test',
        color: '#ff0000'
      }
    })
    
    const useElement = wrapper.find('use')
    const fill = useElement.attributes('fill') || useElement.attributes(':fill')
    expect(fill).toContain('#ff0000')
  })

  it('应使用默认的 prefix', () => {
    const wrapper = mount(SvgIcon, {
      props: {
        icon: 'default-test'
      }
    })
    
    const useElement = wrapper.find('use')
    const href = useElement.attributes('href') || useElement.attributes('xlink:href')
    expect(href).toBe('#icon-default-test')
  })

  it('应使用默认的 color', () => {
    const wrapper = mount(SvgIcon, {
      props: {
        icon: 'test'
      }
    })
    
    const useElement = wrapper.find('use')
    const fill = useElement.attributes('fill') || useElement.attributes(':fill')
    expect(fill).toContain('#33b838')
  })

  it('应使用默认的 size', () => {
    const wrapper = mount(SvgIcon, {
      props: {
        icon: 'test'
      }
    })
    
    const svg = wrapper.find('svg')
    const style = svg.attributes('style')
    expect(style).toContain('1em')
  })

  it('应渲染 use 元素', () => {
    const wrapper = mount(SvgIcon, {
      props: {
        icon: 'any-icon'
      }
    })
    
    expect(wrapper.find('svg use').exists()).toBe(true)
  })
})
