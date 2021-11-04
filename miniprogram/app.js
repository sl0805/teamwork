//app.js
App({
  onLaunch: function () {
    //小程序启动后触发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }
    this.globalData = {
      p:0,//从加入对局进入的话，p为1；从创建对局进入的话，p为0
      uuid:'',//从加入对局进入的话，就获取输入框中的值；从创建对局进入的话，就获取返回信息中的uuid
      token:''
    }
  }
})
