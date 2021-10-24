// pages/chooseMode/chooseMode.js
var app=getApp()
Page({
  data: {

  },
  //模式1
  mode1:function(){
    wx.request({
      url: 'http://localhost:8888/initcardsetpokers',
      method:"POST",
      data:{},
      success:function(res){
        wx.redirectTo({
          url: '../playGame_1/playGame_1',
        })
      }
    })
  },
  mode2:function(){
    var that=this
    wx.request({
      url: 'http://172.17.173.97:9000/api/game',
      method:'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': app.globalData.token
      },
      success:function(res){
        console.log(res.data)
        app.globalData.uuid=res.data.data.uuid
        wx.showModal({
          title:'创建成功',
          content:'您的房间号为'+app.globalData.uuid,
          success(res){
            if(res.confirm){
              app.globalData.p=0
              wx.redirectTo({
                url: '../playGame_2/playGame_2'
              })
            }
          }
        })
      }
    })
  },
  //模式3（未完成）
  mode3:function(){
    wx.redirectTo({
      url: '../playGame_3/playGame_3',
    })
  },
  onLoad: function (options) {

  },
  back:function(){
    wx.redirectTo({
      url: '../enterRoom/enterRoom',
    })
  }
})