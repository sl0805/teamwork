var app=getApp()
Page({
  data: { // 参与页面渲染的数据
    logs: [],
    student_id: '031902539',
    password: 'sun523865',
  },
  onLoad: function () { 
  },
  //返回到首页
  back:function(){
    wx.redirectTo({
      url: '../index/index',
    })
  },
  // 登录 
  login: function () {
      wx.request({
        url: 'http://172.17.173.97:8080/api/user/login',
        method: "POST",
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
       data:{
         student_id:this.data.student_id,
         password:this.data.password
       },
        success:function(res){
          //弹出窗口显示登录成功
          wx.showToast({
            title: "登录成功", // 提示的内容
            icon: "success", // 图标，默认success
            mask: false, // 是否显示透明蒙层，防止触摸穿透
            duration: 6000, // 提示的延迟时间，默认1500
            success: function () {
                //把token值存入全局变量中
                app.globalData.token=res.data.data.token
                wx.redirectTo({//登录成功后界面跳转到模式选择
                  url: '../enterRoom/enterRoom',
                })
                console.log(app.globalData.token)
            }
        })
        }
      })
}
})