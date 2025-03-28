import { service, serviceForMock, request, requestForMock, mock } from '@/api/_service.js'
import * as tools from '@/api/_tools.js'



export function get_all_drug_rna_relation(data = {}) {
  // 真实请求，访问后台接口 localhost:8000/dj_api/get_rnas/
  return request({
    url: 'get_all_drug_rna_relation/',   // 后端接口
    method: 'post',
    timeout: 20000,  // 设置请求超时时间为 20 秒
    data: {
      // drug_sequence: data.drug_sequence,  // 传递 drug_sequence
      data: data.data
    }
  })
    .then(response => {

      if (response != null) {
        // 请求成功，返回数据
        return tools.responseSuccess({
          //   msg: response.data.msg,  // 成功信息
          data: response  // 返回的 RNA 数据
        })
      } else {
        // 请求失败或返回的 code 不是 0，返回错误信息
        console.log('hahaha')
        return tools.responseError({}, 'Sending failed. Please try again.')
      }
    })
    .catch(error => {
      // 请求发生错误时的处理
      console.error('An error has occurred with the request.', error);

      // 如果是超时错误
      if (error.code === 'ECONNABORTED') {
        return tools.responseError({}, 'Request timed out, please try again later');
      }

      return tools.responseError({}, 'Request failed. Please try again.');
    })




}
