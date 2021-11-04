var app=getApp()
Page({
  data: {
    
  },
  //跳转到规则界面
  rules:function(){
    wx.redirectTo({
      url: '../ruleDecription/ruleDecription',
    })
  },
  //跳转到登录界面
  startGame:function(){
    wx.redirectTo({
      url: '../login/login',
    })
  }
})