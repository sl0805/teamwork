Page({
  data: {
    player1_C:['empty'],
    player1_D:['empty'],
    player1_H:['empty'],
    player1_S:['empty'],
    player2_C:['empty'],
    player2_D:['empty'],
    player2_H:['empty'],
    player2_S:['empty'],
    placearea_pokers:['empty'],
    type:0,
    player:0,
    card:'',
    is_player1:false,
    is_player2:true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  //对手牌进行分类
  sort_card:function(p1_list){
    var i=0
    var p1_C=['empty']
    var p1_D=['empty']
    var p1_H=['empty']
    var p1_S=['empty']
    for(;i<p1_list.length;i++)
    {
      if(p1_list[i][0]=='C'){
        p1_C.push(p1_list[i])
      }
      else if(p1_list[i][0]=='D'){
        p1_D.push(p1_list[i])
      }
      else if(p1_list[i][0]=='H'){
        p1_H.push(p1_list[i])
      }
      else{
        p1_S.push(p1_list[i])
      }
    }
    if(this.data.player==1){
      this.setData({
        player1_C:p1_C,
        player1_D:p1_D,
        player1_H:p1_H,
        player1_S:p1_S
      })
    }
    else{
      this.setData({
        player2_C:p1_C,
        player2_D:p1_D,
        player2_H:p1_H,
        player2_S:p1_S
      })
    }
  },
  //获取放置区的牌
  getPlaceArea:function(placeArea){
    var list1=['empty']
    var i=0;
    for(;i<placeArea.length;i++){
      list1.push(placeArea[i])
    }
    this.setData({
      placearea_pokers:list1
    })
  },
  //获取从手牌中出的是哪张牌
  //通过界面，一个玩家总共有4个框，每个框有自己的id号
  //通过获取id号把对应花色牌的第一张打出去
  whatCard:function(e){
    if(e.currentTarget.id=='C1'){
        this.setData({
          card:this.data.player1_C[this.data.player1_C.length-1]
        })
    }
    else if(e.currentTarget.id=='C2'){
      this.setData({
        card:this.data.player2_C[this.data.player2_C.length-1]
      })
    }
    else if(e.currentTarget.id=='D1'){
        this.setData({
          card:this.data.player1_D[this.data.player1_D.length-1]
        })
    }
    else if(e.currentTarget.id=='D2'){
      this.setData({
        card:this.data.player2_D[this.data.player2_D.length-1]
      })
    }
    else if(e.currentTarget.id=="H1"){
        this.setData({
          card:this.data.player1_H[this.data.player1_H.length-1]
        })
    }
    else if(e.currentTarget.id=='H2'){
      this.setData({
        card:this.data.player2_H[this.data.player2_H.length-1]
      })
    }
    else if(e.currentTarget.id=='S1'){
      this.setData({
        card:this.data.player1_S[this.data.player1_S.length-1]
      })
    }
    else
      this.setData({
        card:this.data.player2_S[this.data.player2_S.length-1]
      })
  },
  //判断是否收牌
  is_in:function(flag){
    if(flag==1)
    console.log("p1收牌！");
    else if(flag==2)
    console.log("p2收牌！");
  },
  //判断是否结束
  is_over:function(flag){
    if(flag==1)
    console.log("p1胜！");
    else if(flag==2)
    console.log("p2胜！");
    else if(flag==3)
    console.log("平局")
  },
  //p1从牌组区出牌的按钮的点击事件
  player1_group:function(){
    this.setData({
      type:0,
      player:0
    })
    var that=this
    wx.request({
      url: 'http://localhost:5000/action',
      method:"POST",
      data:{
        player:this.data.player,
        type:this.data.type
      },
      success:function(res){
        var is1=that.data.is_player1
        var is2=that.data.is_player2
        that.setData({
          player:that.data.player*(-1)+1,
          is_player1:!is1,
          is_player2:!is2
        })
        that.sort_card(res.data.data[0].p1_pokers)
        that.getPlaceArea(res.data.data[0].placearea_pokers)
        that.is_in(res.data.data[0].recover)
        that.is_over(res.data.data[0].winner)
      }
    })
  },
  //p2从牌组区出牌的按钮的点击事件
  player2_group:function(){
    this.setData({
      type:0,
      player:1
    })
    var that=this
    wx.request({
      url: 'http://localhost:5000/action',
      method:"POST",
      data:{
        player:this.data.player,
        type:this.data.type
      },
      success:function(res){
        var is1=that.data.is_player1
        var is2=that.data.is_player2
        that.setData({
          player:that.data.player*(-1)+1,
          is_player1:!is1,
          is_player2:!is2
        })
        that.sort_card(res.data.data[0].p2_pokers)
        that.getPlaceArea(res.data.data[0].placearea_pokers)
        that.is_in(res.data.data[0].recover)
        that.is_over(res.data.data[0].winner)
      }
    })
  },
  //p1从手牌出牌的按钮的点击事件
  player1_outCard(){
    var that=this
    this.setData({
      type:1,
      player:0
    })
      wx.request({
        url: 'http://localhost:5000/action',
        method:"POST",
        data:{
          player:this.data.player,
          type:this.data.type,
          card:this.data.card
        },
        success:function(res){
          var is1=that.data.is_player1
          var is2=that.data.is_player2
          that.setData({
            player:that.data.player*(-1)+1,
            is_player1:!is1,
            is_player2:!is2
          })
        that.sort_card(res.data.data[0].p1_pokers)
        that.getPlaceArea(res.data.data[0].placearea_pokers)
        that.is_in(res.data.data[0].recover)
        that.is_over(res.data.data[0].winner)
      }
      })
  },
  //p2从手牌出牌的按钮的点击事件
  player2_outCard(){
    var that=this
    this.setData({
      type:1,
      player:1
    })
      wx.request({
        url: 'http://localhost:5000/action',
        method:"POST",
        data:{
          player:this.data.player,
          type:this.data.type,
          card:this.data.card
        },
        success:function(res){
          var is1=that.data.is_player1
          var is2=that.data.is_player2
          that.setData({
            player:that.data.player*(-1)+1,
            is_player1:!is1,
            is_player2:!is2
          })
        that.sort_card(res.data.data[0].p2_pokers)
        that.getPlaceArea(res.data.data[0].placearea_pokers)
        that.is_in(res.data.data[0].recover)
        that.is_over(res.data.data[0].winner)
      }
      })
  }
})
