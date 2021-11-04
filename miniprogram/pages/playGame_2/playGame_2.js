var app=getApp()
Page({
  data: {
    //将自己的卡牌依花色分类
    player1_C:['empty'],
    player1_D:['empty'],
    player1_H:['empty'],
    player1_S:['empty'],
    //两个玩家的总牌
    player1:['empty'],
    player2:['empty'],
    all:52,//牌组区剩余牌数
    placearea_pokers:['empty'],//放置区的牌
    type:0,//是从牌组取牌还是手牌取牌，0：牌组，1：手牌
    card:'',//从手牌取的是哪张牌
    is_player:true,//当前是不是自己出牌，true：不是，false：是；若不是自己出牌，则要循环等待直到另一个玩家出完牌
  },

  onLoad: function (options) {
    console.log(app.globalData.p)
    if(app.globalData.p==0){
      this.setData({
        is_player:false
      })
    }
      this.isMeOrNot()
      this.get_last()
  },
  //是否轮到我出牌
  isMeOrNot:function(){
    var that=this
    wx.request({
      url: "http://172.17.173.97:9000/api/game/"+app.globalData.uuid+"/last",
      method:'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': app.globalData.token
      },
      success:function(res){
        console.log(res.data.data)
        var num=0
        /*if(res.data.data.last_code[0]=='1')
        num=1
        else
        num=0*/
        if(res.data.code!=200||(res.data.code==200&&res.data.data.last_msg=="对局刚开始")||(res.data.code==200&&res.data.data.last_msg!="对局刚开始"&&(app.globalData.p+res.data.data.last_code[0]-'0')!=1))
        that.isMeOrNot()
      }
    })
  },
  //获取上一步的操作，主要用于另一个玩家牌的监测
  get_last:function(){
    var that=this
    wx.request({
      url: "http://172.17.173.97:9000/api/game/"+app.globalData.uuid+"/last",
      method:'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': app.globalData.token
      },
      success:function(res){
        if(res.data.code==200&&res.data.data.last_msg!="对局刚开始"&&(app.globalData.p+res.data.data.last_code[0]-'0')!=1){//上轮不是我，即上轮是对方
          var l=res.data.data.last_code.split(' ')
          if(l[1]=='0'&&l[0]==app.globalData.p){//从牌组取牌
            that.setData({
              all:that.data.all-1
            })
            var flag=that.take_card1(l[2])
            if(flag){
              that.setData({
                //在末尾加一张牌
                player2:that.data.player2.splice(-1,0,that.data.card)
              })
            }
          }
          else{//从手牌中取牌
            var flag=that.take_card1(l[2])
            var i=0
            if(!flag){
              for(i=0;i<that.data.player2.length;i++){//从另一个玩家的手牌中出的牌是哪张
                if(that.data.player2[i]==l[2]){
                  break
                }
              }
              that.setData({
                //删除另一个玩家的手牌中的对应牌
                player2:that.data.player2.splice(i,1)
              })
            }
          }
          that.setData({
            is_player:!that.data.is_player//如果是你出（turn：true）则这次你出（is_player：false）
          })
        }
      }
    })
  },
  //判断是否收牌，并执行收牌操作
  take_card:function(out_card){
    var that=this
    if(out_card==this.data.placearea_pokers[this.data.placearea_pokers.length-1]){//收牌
      this.setData({
        player1:this.data.player1.concat(this.data.placearea_pokers),
        placearea_pokers:[]
      })
      return true
    }
    else{//不收牌
      this.setData({
        //在末尾加一张牌
        placearea_pokers:this.data.placearea_pokers.splice(-1,0,out_card)
      })
      return false
    }
  },
  //另一个玩家是否收牌，用于获取另一个玩家的牌
  take_card1:function(out_card){
    var that=this
    if(out_card==this.data.placearea_pokers[this.data.placearea_pokers.length-1]){
      this.setData({
        player2:this.data.player2.concat(this.data.placearea_pokers),
        placearea_pokers:[]
      })
      return true
    }
    else{
      that.setData({
        //在末尾加一张牌
        placearea_pokers:this.data.placearea_pokers.splice(-1,0,out_card)
      })
      return false
    }
  },
  //我从牌组区中抽牌
  player_group:function(){
    var that=this
    this.setData({
      type:0
    })
    var that=this
    wx.request({
      url: 'http://172.17.173.97:9000/api/game/'+app.globalData.uuid,
      method:"PUT",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': app.globalData.token
      },
      data:{
        type:this.data.type
      },
      success:function(res){
        if(res.data.code==200){
          that.setData({
            card:res.data.data.last_code,
            all:that.data.all-1
          })
          //分解得到真正的牌
          console.log(that.data.card)
          that.get_msg(that.data.card)
          //flag用于判断是否收牌,true为收牌
          var flag=that.take_card(that.data.card)
          if(flag){
            that.setData({
              //在末尾加一张牌
              player1:that.data.player1.splice(-1,0,that.data.card)
            })
          }
          //判断是否结束
          var eFlag=that.is_end()
          if(eFlag)
          console.log("游戏结束")
          that.sort_card(that.data.player1)
          that.setData({
            is_player:!that.data.is_player
          })
          that.isMeOrNot()
          that.get_last()
        }
      }
    })
  },
    //从后端传来的数据中拆解出具体是什么牌
    get_msg:function(msg){
      var l1=msg.split(' ')
      this.setData({
        card:l1[2]
      })
    },
    //判断是否结束，即牌组区牌数是否为0
  is_end:function(){
    if(this.data.all==0)
    return true
    else
    return false
  },
      //给自己的手牌进行分类
  sort_card:function(p1_list){
    var that=this
    var i=0
    //分成4个数组
    var p1_C=['empty']
    var p1_D=['empty']
    var p1_H=['empty']
    var p1_S=['empty']
    //循环遍历数组分类，放在数组的最后
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
    //这样才能让data里面的值达到同步变化的效果
      this.setData({
        player1_C:p1_C,
        player1_D:p1_D,
        player1_H:p1_H,
        player1_S:p1_S
      })
  },
  //获取从手牌取出的牌是什么，只要知道p1就好了
  whatCard:function(e){
    if(e.currentTarget.id=='C1'){
        this.setData({
          card:this.data.player1_C[this.data.player1_C.length-1]
        })
    }
    else if(e.currentTarget.id=='D1'){
        this.setData({
          card:this.data.player1_D[this.data.player1_D.length-1]
        })
    }
    else if(e.currentTarget.id=="H1"){
        this.setData({
          card:this.data.player1_H[this.data.player1_H.length-1]
        })
    }
    else{
      this.setData({
        card:this.data.player1_S[this.data.player1_S.length-1]
      })
    }
  },
  //从手牌中取牌
  player_outCard(){
    var that=this
    if(this.data.card!='empty'){
      this.setData({
        type:1
      })
        wx.request({
          url: 'http://172.17.173.97:9000/api/game/'+app.globalData.uuid,
          method:"PUT",
          data:{
            type:this.data.type,
            card:this.data.card
          },
          success:function(res){
            if(res.data.code==200){
            that.setData({
              card:res.data.data.last_code
            })
            that.get_msg(that.data.card)
            var flag=that.take_card(that.data.card)
            if(!flag)
              that.setData({
                //从末尾删去一张牌
                player1:that.data.player1.splice(0,-1)
              })
            that.sort_card(that.data.player1)
            that.setData({
              is_player:!that.data.is_player
            })
          //判断是否结束
          var eFlag=that.is_end()
          if(eFlag)
          console.log("游戏结束")
          that.sort_card(that.data.player1)
          that.setData({
            is_player:!that.data.is_player
          })
          that.isMeOrNot()
          that.get_last()
        }
      }
        })
    }
    else{
      console.log("该花色为空！")
    }
  }
})