export default ({ request, tools }) => ({
    /**
     * @description 发送邮件
     * @param {Object} data 请求携带的信息，包含 `subject`,`message`,`recipient_list`
     */
    send_email (data = {}) {
      // 真实请求，访问后台接口 localhost:8000/dj_api/get_rnas/
      return request({
        url: 'email/send/',  // 后端接口
        method: 'post',
        timeout: 10000,  // 设置请求超时时间为 1 秒
        data: {
            // drug_sequence: data.drug_sequence,  // 传递 drug_sequence
            subject:data.subject,
            message:data.message,
            recipient_list:data.recipient_list
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
            if (response!=null ) {
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
  