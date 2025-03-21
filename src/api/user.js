//来管理与用户相关的接口。
//这里是整个引入request.js文件；
// @/utils/request绝对路径；./utils/request是相对路径；
import request from '@/utils/request';
 
// 获取用户信息
//这里其实是直接登录到menu界面，一般是getlogin函数；
//这里etlogin只有一个参数；
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
// 1.确定请求路径
// 2.确定请求参数，这里无需参数（判断依据：浏览器-标头-旁边有个预览，即不需要参数）
// 3. 确定请求方式post/get;
export  function getCode(){
  return request({
    url:'/base/captcha',
    //标头旁边是预览，无需参数
    method:"POST" //根据控制台结果

  })
}

// 获取角色Api信息
export const getAllApis = () => {
  return request({
    url: '/api/getAllApis',
    method: 'POST',
  })
}


