import { mount } from '@vue/test-utils';
import bottomIcon from '../src/components/bottomIcon.vue';
import { describe, it, expect,  beforeEach} from '@jest/globals'; // 导入 Jest 全局函数

  // describe 是用来组织和分组相关的测试用例，通常针对一个特定的组件、函数或模块。
describe('bottomIcon.vue', () => {
  let wrapper;

  //  Jest 提供的一个钩子函数 (hook function)。它定义了一个在每个 it 测试用例运行之前都会执行的函数。
  // 为每个测试用例创建一个新的 bottomIcon 组件实例并将其挂载。确保每个测试用例都在一个干净的、相同的组件实例上运行，避免了测试之间的相互影响。
  //  mount 的作用是将 bottomIcon 组件挂载到一个虚拟的 DOM 结构中s
  beforeEach(() => {
    wrapper = mount(bottomIcon);
  });

  // it 是用来定义一个具体的测试用例，它测试被测单元的一个特定行为或预期结果，并使用断言 (expect()) 来验证结果。
  // 每个 it 块都针对 bottomIcon 组件的一个特定方面进行了测试：文本内容：链接和属性：CSS 类名 内联样式s
  it('renders the "Powered by" text', () => {
    expect(wrapper.text()).toContain('Powered by');
  });

  it('renders the Gin-Vue-Admin link with correct href', () => {
    const link = wrapper.find('a[href="https://github.com/flipped-aurora/gin-vue-admin"]');
    expect(link.exists()).toBe(true);
    expect(link.text()).toBe('Gin-Vue-Admin');
  });

  it('renders the "Copyright" text', () => {
    expect(wrapper.text()).toContain('Copyright');
  });

  it('renders the flipped-aurora team link with correct href', () => {
    const link = wrapper.find('a[href="https://github.com/flipped-aurora"]');
    expect(link.exists()).toBe(true);
    expect(link.text()).toBe('flipped-aurora 团队');
  });

  it('applies the bottomline class', () => {
    const wrapper = mount(bottomIcon)
    expect(wrapper.classes()).toContain('bottomline') // 改为检查实际存在的类名
  })

  it('renders the correct inline styles', () => {
    const poweredByDiv = wrapper.find('div[style*="margin-right: 3px"]');
    expect(poweredByDiv.exists()).toBe(true);

    const copyrightDiv = wrapper.find('div[style*="margin-left: 3px"]');
    expect(copyrightDiv.exists()).toBe(true);
  });
});