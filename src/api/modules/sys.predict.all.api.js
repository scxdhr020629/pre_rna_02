
import { service, serviceForMock, request, requestForMock, mock } from '@/api/_service.js'
import * as tools from '@/api/_tools.js'



export function get_all_rnas(data = {}) {
  // 真实请求，访问后台接口 localhost:8000/dj_api/get_rnas/
  return request({
    url: 'get_all_rnas/',   // 后端接口
    method: 'post',
    timeout: 60000,  // 设置请求超时时间为 20 秒
    data: {
      // drug_sequence: data.drug_sequence,  // 传递 drug_sequence
      data: data.data
    }
  })
    .then(response => {

      console.log('hello scx')
      // console.log(data.recipient_list)
      console.log(response)
      // 这里的response 是后端接口里得data
      //也就是说后端接口一定格式如下
      // code
      //msg
      // data 这个data就是现在获取到的response
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









export default ({ request, tools }) => ({
  /**
   * @description 讲一个sequence列表数据传入到后端 进行rna预测
   * @param {Object} data 请求携带的信息,[{"sequence":"CC(C)OC1=C(NC2=NC=C(Cl)C(N2)=NC2=CC=CC=C2S(=O)(=O)C(C)C)C=C(C)C(=C1)C1CCNCC1"},{"sequence":"COC(=O)C1=CCCN(C)C1"}]
   */
  get_all_rnas(data = {}) {
    // 真实请求，访问后台接口 localhost:8000/dj_api/get_rnas/
    return request({
      url: 'get_all_rnas/',   // 后端接口
      method: 'post',
      timeout: 60000,  // 设置请求超时时间为 秒
      data: {
        // drug_sequence: data.drug_sequence,  // 传递 drug_sequence
        data: data.data
      }
    })
      .then(response => {

        console.log('hello scx')
        // console.log(data.recipient_list)
        console.log(response)
        // 这里的response 是后端接口里得data
        //也就是说后端接口一定格式如下
        // code
        //msg
        // data 这个data就是现在获取到的response
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
})
