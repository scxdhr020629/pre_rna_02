import { service, serviceForMock, request, requestForMock, mock } from '@/api/_service.js'
import * as tools from '@/api/_tools.js'
export function get_drug_rna_relation(data = {}) {

  return request({
    url: 'get_drug_rna_relation/',  // 后端接口
    method: 'post',
    timeout: 15000,  // 设置请求超时时间为 10 秒
    data: {
      drug_sequence: data.drug_sequence,  // 传递 drug_sequence
      rna_sequence: data.rna_sequence  // 传递 drug_sequence
    }
  })
    .then(response => {
        
        console.log('hello scx')
        console.log(response)
      
        if (response!=null ) {
        // 请求成功，返回数据
        return tools.responseSuccess({
        //   msg: response.data.msg,  // 成功信息
          data: response  // 返回的 RNA 数据
        })
      } else {
        // 请求失败或返回的 code 不是 0，返回错误信息
        console.log('hahaha')
        return tools.responseError({}, '查询失败，请重试')
      }
    })
    .catch(error => {
      // 请求发生错误时的处理
      console.error('请求发生错误:', error);
      
      // 如果是超时错误
      if (error.code === 'ECONNABORTED') {
        return tools.responseError({}, '请求超时，请稍后再试');
      }

      return tools.responseError({}, '请求失败，请重试');
    })

}





