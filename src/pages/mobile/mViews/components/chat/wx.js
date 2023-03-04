import { assign } from 'lodash'
import {
  mRequest
} from '@/api/request'

export async function getWxSdk() {
  const { wx } = window
  const path = window.location.pathname
  const locationHref = window.location.href
  const originPath = window.location.origin

  const data = {
    locationHref,
    path,
    origin: originPath
  }
  const res = await mRequest({
    url: `/wx/config/path`,
    method: 'post',
    data
  })
  if (res && res.config) {
    return new Promise((resolve, reject) => {
      const config = assign({
        jsApiList: [
          'chooseImage',
          'uploadImage',
          'previewImage',
          'downloadImage',
          'startRecord',
          'stopRecord',
          'onVoiceRecordEnd',
          'playVoice',
          'pauseVoice',
          'stopVoice',
          'onVoicePlayEnd',
          'uploadVoice',
          'downloadVoice',
          'getLocation'
        ]
      }, res.config)

      console.log('注册的配置是', config)
      wx.config(config)

      wx.ready((r) => {
        console.log('微信sdk权限验证成功', r)
        resolve(wx)
      })

      wx.checkJsApi({
        jsApiList: [
          'startRecord',
          'stopRecord',
          'onVoiceRecordEnd',
          'uploadVoice',
          'playVoice',
          'stopVoice',
          'onVoicePlayEnd'
        ], // 需要检测的 JS 接口列表，所有 JS 接口列表见附录2,
        success: function(res) {
        // 以键值对的形式返回，可用的 api 值true，不可用为false
        // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
          console.log('支持的列表', res)
        }
      })

      wx.error((r) => {
        console.error('微信sdk权限验证失败', r)
        window.alert(JSON.stringify(r))
        reject(r)
      })
    })
  }
  return null
}

export default {}
