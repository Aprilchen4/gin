//来管理与用户相关的接口。
//这里是整个引入request.js文件；
// @/utils/request绝对路径；./utils/request是相对路径；
import request from '@/utils/request';
 
// 获取用户信息
//这里其实是直接登录到menu界面，一般是getlogin函数；
//这里etlogin只有一个参数；


// 1.确定请求路径
// 2.确定请求参数，这里无需参数（判断依据：浏览器-标头-旁边有个预览，即不需要参数）
// 3. 确定请求方式post/get;
export function getlogin(data){
  console.log("hhh");
    return request({
        url:'/base/login', //源于官方项目的浏览器url，后端定义；
        method: 'POST', //post一般需要传参数
        data,           // 使用 POST 方法
    });
}

export function getMenu(){//这里没有参数，所以调用时不要加参数
    return request({
        url:'/menu/getMenu',
        method: 'POST', //post一般需要传参数，无载荷，无参数
    });
}


export function getAuthority(){//这里没有参数，所以调用时不要加参数
    return request({
        url:'/authority/getAuthorityList',
        method: 'POST', //post一般需要传参数，无载荷，无参数
    });
}

export function createAuthority(data){
    return request({
        url:'/authority/createAuthority',
        method: 'POST', //post一般需要传参数，无载荷，无参数
        data
    });
}

// 拷贝角色
export function copyAuthority(data){
  return request({
      url:'/authority/copyAuthority',
      method: 'POST', //post一般需要传参数，无载荷，无参数
      data
  });
}

// 编辑角色/变更首页按钮
export function updateAuthority(data){
  return request({
      url:'/authority/updateAuthority',
      method: 'PUT', //注意这里请求方法不一样了
      data
  });
}

// 删除角色
export function deleteAuthority(data){
  return request({
      url:'/authority/deleteAuthority',
      method: 'POST', //post一般需要传参数，无载荷，无参数
      data
  });
}

export  function getCode(){
  return request({
    url:'/base/captcha',
    //标头旁边是预览，无需参数
    method:"POST" //根据控制台结果

  })
}

// 获取角色菜单信息
export const getBaseMenuTree = () => {
  return request({
    url: '/menu/getBaseMenuTree',
    method: 'POST',
  })
}

// 角色菜单选中信息
export const getMenuAuthority = (data) => {
  return request({
    url: '/menu/getMenuAuthority',
    method: 'POST',
    data
  })
}

// 提交选中菜单信息
export const addMenuAuthority = (data) => {
  return request({
    url: '/menu/addMenuAuthority',
    method: 'POST',
    data
  })
}
// 获取角色Api信息
export const getAllApis = () => {
  return request({
    url: '/api/getAllApis',
    method: 'POST',
  })
}

// 获取角色Api选中信息
export const getPolicyPathByAuthorityId = (data) => {
  return request({
    url: '/casbin/getPolicyPathByAuthorityId',
    method: 'POST',
    data
  })
}

// 提交角色Api选中信息
export const updateCasbin = (data) => {
  return request({
    url: '/casbin/updateCasbin',
    method: 'POST',
    data
  })
}

// 设置角色资源权限
export const setDataAuthority = (data) => {
  return request({
    url: '/authority/setDataAuthority',
    method: 'POST',
    data
  })
}

// 获取菜单页面数据，绑定table
export const getMenuList = () => {
  return request({
    url: '/menu/getMenuList',
    method: 'POST',
  })
}

// 获取菜单操作对应数据
export const getBaseMenuById = (data) => {
  return request({
    url: '/menu/getBaseMenuById',
    method: 'POST',
    data
  })
}

// 新增根菜单
export const addBaseMenu = (data) => {
  return request({
    url: '/menu/addBaseMenu',
    method: 'POST',
    data
  })
}

// 编辑菜单
export const updateBaseMenu = (data) => {
  return request({
    url: '/menu/updateBaseMenu',
    method: 'POST',
    data
  })
}

// 删除菜单
export const deleteBaseMenu = (data) => {
  return request({
    url: '/menu/deleteBaseMenu',
    method: 'POST',
    data
  })
}

// api管理相关请求
export const getApiList = (data) => {
  return request({
    url: '/api/getApiList',
    method: 'POST',
    data
  })
}

export const getApiGroups = () => {
  return request({
    url: '/api/getApiGroups',
    method: 'GET',
  })
}

export const syncApi = () => {
  return request({
    url: '/api/syncApi',
    method: 'GET',
  })
}

// 自动填充按钮
export const llmAuto = (data) => {
  return request({
    url: '/autoCode/llmAuto',
    method: 'POST',
    data
  })
}

// 单条新增
export const createApi = (data) => {
  return request({
    url: '/api/createApi',
    method: 'POST',
    data
  })
}

// 忽略
export const ignoreApi = (data) => {
  return request({
    url: '/api/ignoreApi',
    method: 'POST',
    data
  })
}

// 同步抽屉确定
export const enterSyncApi = (data) => {
  return request({
    url: '/api/enterSyncApi',
    method: 'POST',
    data
  })
}

// 主表格编辑
export const getApiById = (data) => {
  return request({
    url: '/api/getApiById',
    method: 'POST',
    data
  })
}


// 主表格删除
export const deleteApi = (data) => {
  return request({
    url: '/api/deleteApi',
    method: 'POST',
    data
  })
}

export const updateApi = (data) => {
  return request({
    url: '/api/updateApi',
    method: 'POST',
    data
  })
}

// 刷新缓存
export const freshCasbin = () => {
  return request({
    url: '/api/freshCasbin',
    method: 'GET',
  })
}


export const deleteApisByIds = (data) => {
  return request({
    url: '/api/deleteApisByIds',
    method: 'DELETE',
    data
  })
}

// 用户管理
export const getUserList = (data) => {
  return request({
    url: '/user/getUserList',
    method: 'POST',
    data
  })
}

// 点击抽屉上传
export const getFileList = (data) => {
  return request({
    url: '/fileUploadAndDownload/getFileList',
    method: 'POST',
    data
  })
}


export const getCategoryList = () => {
  return request({
    url: '/attachmentCategory/getCategoryList',
    method: 'GET',
  })
}

// 用户新增抽屉 确定按钮
export const adminRegister = (data) => {
  return request({
    url: '/user/admin_register',
    method: 'POST',
    data
  })
}

// 表格删除
export const deleteUser = (data) => {
  return request({
    url: '/user/deleteUser',
    method: 'DELETE',
    data
  })
}

// 用户表格编辑
export const setUserInfo = (data) => {
  return request({
    url: '/user/setUserInfo',
    method: 'PUT',
    data
  })
}

// 用户重置密码
export const resetPassword = (data) => {
  return request({
    url: '/user/resetPassword',
    method: 'POST',
    data
  })
}

// 上传图片到服务器
export const upload = (data) => {
  return request({
    url: '/fileUploadAndDownload/upload',
    method: 'POST',
    data
  })
}

// 删除上传用户照片
export const deleteFile = (data) => {
  return request({
    url: '/fileUploadAndDownload/deleteFile',
    method: 'POST',
    data
  })
}

// 字典页面进入请求
export const getSysDictionaryList = () => {
  return request({
    url: '/sysDictionary/getSysDictionaryList',
    method: 'GET'
  });
  
}


// 字典字符串请求
// 调用：const response = await getDictionaryList(1, 10, 'some-id');
export const getSysDictionaryDetailList = (page, pageSize, sysDictionaryID) => {
  return request({
    url: `/sysDictionaryDetail/getSysDictionaryDetailList?page=${page}&pageSize=${pageSize}&sysDictionaryID=${sysDictionaryID}`,
    method: 'GET'
  });
};

// 字典表格变更
export const findSysDictionaryDetail = (id) => {
  return request({
    url: `/sysDictionaryDetail/findSysDictionaryDetail?ID=${id}`,
    method: 'GET'
  });
};

// 编辑左侧字典
export const findSysDictionary = (id, status) => {
  return request({
    url: `/sysDictionary/findSysDictionary?ID=${id}&status=${status}`,
    method: 'GET'
  });
};

// 字典
export const createSysDictionary = (data) => {
  return request({
    url: '/sysDictionary/createSysDictionary',
    method: 'POST',
    data
  });
};

// 字典
export const updateSysDictionary = (data) => {
  return request({
    url: '/sysDictionary/updateSysDictionary',
    method: 'PUT',
    data
  });
};


export const deleteSysDictionary = (data) => {
  return request({
    url: '/sysDictionary/deleteSysDictionary',
    method: 'DELETE',
    data
  });
}


export const createSysDictionaryDetail = (data) => {
  return request({
    url: '/sysDictionaryDetail/createSysDictionaryDetail',
    method: 'POST',
    data
  });
};


export const updateSysDictionaryDetail = (data) => {
  return request({
    url: '/sysDictionaryDetail/updateSysDictionaryDetail',
    method: 'PUT',
    data 
  })
}


export const deleteSysDictionaryDetail = (data) => {
  return request({
    url: '/sysDictionaryDetail/deleteSysDictionaryDetail',
    method: 'DELETE',
    data
  })
}

// 操作历史
export const getSysOperationRecordList = (page,pageSize,params) => {
  return request({
    url: `/sysOperationRecord/getSysOperationRecordList?page=${page}&pageSize=${pageSize}${params}`,
    method: 'GET',
  })
}

// 操作历史删除选中表格项
export const deleteSysOperationRecordByIds = (data) => {
  return request({
    url: '/sysOperationRecord/deleteSysOperationRecordByIds',
    method: 'DELETE',
    data
  })
}

export const deleteSysOperationRecord = (data) => {
  return request({
    url: '/sysOperationRecord/deleteSysOperationRecord',
    method: 'DELETE',
    data
  })
}