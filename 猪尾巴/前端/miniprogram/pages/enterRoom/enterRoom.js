var app=getApp()
Page({
  data: { // 参与页面渲染的数据
    logs: [],
    show_input:true,
    uuid:''
  },
  onLoad: function () {
    
  },
  //加入房间后的文本框输入值获取
  uuidInput:function(e){
    this.setData({
      uuid:e.detail.value
    })
  },
  //创建房间
  createRoom:function(){
    wx.redirectTo({
      url: '../chooseMode/chooseMode',
    })
  },
  //弹框点击取消
  cancel:function(){
    this.setData({
      show_input:true
    })
  },
  //点击加入房间
  enterRoom:function(){
    this.setData({
      show_input:false
    })
  },
  //弹窗点击确认
  /*enter:function(){
    app.globalData.uuid=this.data.uuid
    wx.request({
      url: 'http://172.17.173.97:9000/api/game/'+app.globalData.uuid,
          method:'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': app.globalData.token
          },
          success:function(){
            app.globalData.p=0
            wx.redirectTo({
              url: '../playGame_2/playGame_2'
            })
          }
    })
  },*/
  //查询房间
  find:function(){
    wx.request({
      url: 'http://172.17.173.97:9000/api/game/index',
          method:'GET',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': app.globalData.token
          },
          data:{
            page_size:'10',
            page_num:'2'
          },
          success:function(res){
            console.log(res.data)
          }
    })
  },
  //弹窗点击确定
  enterBtn:function(){
    app.globalData.uuid=this.data.uuid
    wx.request({
      url: 'http://172.17.173.97:9000/api/game/'+app.globalData.uuid,
          method:'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': app.globalData.token
          },
          success:function(){
            app.globalData.p=1
            wx.redirectTo({
              url: '../playGame_2/playGame_2'
            })
          }
    })
  },
  back:function(){
    wx.redirectTo({
      url: '../login/login',
    })
  },
})