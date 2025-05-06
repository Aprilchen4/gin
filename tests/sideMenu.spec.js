import { mount } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import sideMenu from '../src/components/sideMenu.vue';
import { emitter } from '../src/utils/eventBus';
import mitt from 'mitt';
import { useRouter } from 'vue-router';
import { store, router } from './setup'; // 导入你的 store 和 router 实例
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'; // 导入 Jest 全局函数

// 模拟 menuItems.vue
const MenuItems = {
  name: 'MenuItems',
  props: ['navMenus'],
  template: '<div><slot /></div>'
};

// 模拟 sideData (如果 sideMenu 组件需要)
const sideData = {
  values: [
    {
      menuId: '1',
      path: 'dashboard',
      name: 'Dashboard',
      component: 'views/Dashboard.vue',
      meta: { title: 'Dashboard' },
      children: []
    },
    {
      menuId: '2',
      path: 'settings',
      name: 'Settings',
      component: 'views/Settings.vue',
      meta: { title: 'Settings' },
      children: []
    }
  ]
};

describe('sideMenu.vue', () => {
  let wrapper;

  beforeEach(async () => {
    await router.isReady(); // 确保 router 准备就绪
    wrapper = mount(sideMenu, {
      global: {
        plugins: [store, router, ElementPlus],
        components: { MenuItems },
        mocks: { $router: router }
      },
      props: { sideData } // 如果 sideMenu 组件接收 sideData prop
    });
  });

  afterEach(() => {
    emitter.all.clear();
  });

  it('renders active menu item', async () => {
    const activeIndex = '1';
    const wrapper = mount(sideMenu, {
      global: {
        plugins: [store, router, ElementPlus],
        components: { MenuItems },
        mocks: { $router: router }
      },
      props: { activeMenu: activeIndex, sideData }
    });

    const activeItem = wrapper.find('.active-menu'); // 替换为你的实际 active 类名
    expect(activeItem.exists()).toBe(true);
  });

  it('renders menu items', () => {
    expect(wrapper.find('.el-menu').exists()).toBe(true);
    expect(wrapper.findComponent(MenuItems).exists()).toBe(true);
  });

  it('updates active menu on select', async () => {
    const menuItems = wrapper.findAll('.menu-item'); // 替换为你的实际菜单项类名
    if (menuItems.length > 1) {
      await menuItems[1].trigger('click');
      expect(store.state.activeMenu).toBe('2'); // 假设点击第二个菜单项会更新 store 中的 activeMenu
    }
  });

  it('emits event on menu select', async () => {
    const spy = jest.spyOn(emitter, 'emit');
    const menuItems = wrapper.findAll('.menu-item'); // 替换为你的实际菜单项类名
    if (menuItems.length > 0) {
      await menuItems[0].trigger('click');
      expect(spy).toHaveBeenCalledWith('routeMessageEvent', 'dashboard'); // 根据你的组件逻辑和 sideData
    }
  });

  jest.mock('vue-router', () => ({
    useRouter: jest.fn(() => ({
      push: jest.fn()
    }))
  }));

  it('navigates on menu select', async () => {
    const push = useRouter().push;
    const menuItems = wrapper.findAll('.menu-item'); // 替换为你的实际菜单项类名
    if (menuItems.length > 0) {
      await menuItems[0].trigger('click');
      expect(push).toHaveBeenCalledWith('/ginmenu/dashboard'); // 根据你的组件逻辑和 sideData
    }
  });

  it('updates breadcrumb on select', async () => {
    const menuItems = wrapper.findAll('.menu-item'); // 替换为你的实际菜单项类名
    if (menuItems.length > 0) {
      await menuItems[0].trigger('click');
      expect(store.state.breadCrumb).toBe('Dashboard'); // 根据你的组件逻辑和 sideData
    }
  });

  it('handles emitter event', async () => {
    const mockEmitter = mitt();
    const wrapper = mount(sideMenu, {
      global: {
        plugins: [store, router, ElementPlus],
        components: { MenuItems },
        mocks: { $router: router },
        provide: { emitter: mockEmitter }
      },
      props: { sideData }
    });

    // 触发事件
    mockEmitter.emit('messageEvent', { activeMenu: '2', tabName: 'Settings' });
    await wrapper.vm.$nextTick();

    // 验证处理逻辑 (根据你的组件实现修改断言)
    expect(store.state.activeMenu).toBe('2');
    expect(store.state.tabName).toBe('Settings');
  });
});

