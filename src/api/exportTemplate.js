import request from '@/utils/request'

// @Tags SysExportTemplate
// @Summary 创建导出模板
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.SysExportTemplate true "创建导出模板"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"创建成功"}"
// @Router /sysExportTemplate/createSysExportTemplate [post]

export const exportExcel = (params) => {
    return request({
      url: '/sysExportTemplate/exportExcel',
      method: 'get',
      params
    })
  }
  
  
  export const exportTemplate = (params) => {
    return request({
      url: '/sysExportTemplate/exportTemplate',
      method: 'get',
      params
    })
  }


  
export const createSysExportTemplate = (data) => {
  return request({
    url: '/sysExportTemplate/createSysExportTemplate',
    method: 'post',
    data
  })
}

export const deleteSysExportTemplate = (data) => {
  return request({
    url: '/sysExportTemplate/deleteSysExportTemplate',
    method: 'delete',
    data
  })
}

export const deleteSysExportTemplateByIds = (data) => {
  return request({
    url: '/sysExportTemplate/deleteSysExportTemplateByIds',
    method: 'delete',
    data
  })
}

export const updateSysExportTemplate = (data) => {
  return request({
    url: '/sysExportTemplate/updateSysExportTemplate',
    method: 'put',
    data
  })
}

export const findSysExportTemplate = (params) => {
  return request({
    url: '/sysExportTemplate/findSysExportTemplate',
    method: 'get',
    params
  })
}

export const getSysExportTemplateList = (params) => {
  return request({
    url: '/sysExportTemplate/getSysExportTemplateList',
    method: 'get',
    params
  })
}
