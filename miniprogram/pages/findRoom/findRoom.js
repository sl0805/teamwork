var app=getApp()
Page({
  data: {
    roomList:[],
    page_num:'1'
  },
  onLoad:function(){
    var that=this
    wx.request({
      url: 'http://172.17.173.97:9000/api/game/index',
          method:'GET',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': app.globalData.token
          },
          data:{
            page_size:"10",
            page_num:"2"
          },
          success:function(res){
            that.setData({
              roomList:res.data.data.games
            })
            console.log(that.data.roomList)
          }
    })
  },
  back:function(){
    wx.redirectTo({
      url: '../enterRoom/enterRoom',
    })
  },
  pageInput:function(e){
    this.setData({
      page_num:e.detail.value
    })
  },
  inputPage:function(){
    var that=this
    wx.request({
      url: 'http://172.17.173.97:9000/api/game/index',
          method:'GET',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': app.globalData.token
          },
          data:{
            page_size:"10",
            page_num:that.data.page_num
          },
          success:function(res){
            that.setData({
              roomList:res.data.data.games
            })
          }
    })
  }
})