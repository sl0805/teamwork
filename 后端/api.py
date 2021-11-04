import json
from flask import Flask
from flask import request, jsonify, Blueprint
import time
import random
import datetime
from action import extract_from_hand, init_card_set, placementarea_pokers, check_placementarea, calculate_for_winner, \
    extract_from_cardset, p1_pokers, p2_pokers, trusteeship
from oline_action import online_check_placementarea, adjust_pokers, online_trusteeship, online_init_card_set, \
    online_placementarea_pokers, online_p1_pokers, online_p2_pokers, online_cardset_pokers, online_calculate_for_winner

uuid = ' '
app = Flask(__name__)

# 本地对战发送登录请求，用以初始化化牌组,返回uuid
@app.route("/initcardsetpokers", methods=["POST"])
def initlocal():
    req_data = request.get_json()
    msg = req_data.get("msg")
    init_card_set()
    uuid=datetime.datetime.now()
    load = []
    data = {'uuid': uuid}
    load.append(data)
    return jsonify(code=200, data=load, msg="操作成功")

'''
# 用户查询战绩
@app.route("/searchrecord", methods=["POST"])
def searchrecord():
    req_data = request.get_json()
    student_id = req_data.get("student_id")  # 学号
    all = User.query.filter(User.student_id == student_id).all()
    load = []
    for u in all:
        local_win = u.local_win
        local_lose = u.local_lose
        local_deuce = u.local_deuce
        hc_win = u.hc_win
        hc_lose = u.hc_lose
        hc_deuce = u.hc_deuce
        online_win = u.online_win
        online_lose = u.online_lose
        online_deuce = u.online_deuce
        data = {"local_win": local_win,
                "local_lose": local_lose, "local_deuce": local_deuce, "hc_win": hc_win,
                "hc_lose": hc_lose, "hc_deuce": hc_deuce, "online_win": online_win, "online_lose": online_lose,
                "online_deuce": online_deuce
                }
        load.append(data)
    return jsonify(code=200, inforlist=load, msg="操作成功")
'''

# 执行操作
@app.route("/action", methods=["POST"])
def action():
    req_data = request.get_json()
    player = req_data.get("player")  # 用户 p1=0,p2=1
    type = req_data.get("type")  # 操作类型 type默认为0：0为翻开卡组的牌，1为从手牌打出
    card = req_data.get("card")  # 当type参数为1时需要填写，例如：S1 或 D10 或 HQ 或 C7 等（格式为花色缩写+1~K标编号，花色见备注 黑桃:S红桃:H梅花:C方块:D
    if type == 0:
        card = extract_from_cardset(player)
    else:
        extract_from_hand(player, card)
    # 检验放置的牌是否花色相同，并完成牌归入想要操作者的牌里
    recover = check_placementarea(player)  # p1收走：1 p2:2 无：0
    # 检测牌局是否结束
    winner = calculate_for_winner()  # p1win:1 ; p2win:2 ; 平局：3 ;游戏未结束：0
    print("放置区:", placementarea_pokers)
    print("p1:", p1_pokers)
    print("p2:", p2_pokers)
    word =str(player) + ' ' + str(type) + ' ' + card
    load = []
    data = {"last_code": word, "recover": recover, "winner": winner, "p1_pokers":p1_pokers, "p2_pokers":p2_pokers,"placearea_pokers":placementarea_pokers}
    load.append(data)
    return jsonify(code=200, data=load, msg="操作成功")

# 本地托管功能和实现人机对战的那个机的出牌
@app.route("/trusteeship_api", methods=["POST"])
def trusteeship_api():
    req_data = request.get_json()
    player = req_data.get("player")  # 用户 p1=0,p2=1
    return_list=trusteeship(player)
    # 检验放置的牌是否花色相同，并完成牌归入想要操作者的牌里
    recover = check_placementarea(player)  # p1收走：1 p2:2 无：0
    # 检测牌局是否结束
    winner = calculate_for_winner()  # p1win:1 ; p2win:2 ; 平局：3 ;游戏未结束：0
    print("放置区:", placementarea_pokers)
    print("p1:", p1_pokers)
    print("p2:", p2_pokers)
    word =str(player) + ' ' + str(return_list[1]) + ' ' + return_list[0]
    load = []
    data = {"last_code": word, "recover": recover, "winner": winner, "p1_pokers":p1_pokers, "p2_pokers":p2_pokers,"placearea_pokers":placementarea_pokers}
    load.append(data)
    return jsonify(code=200, data=load, msg="操作成功")

# 初始化在线对战
@app.route("/onlineinitcardsetpokers", methods=["POST"])
def initonline():
    req_data = request.get_json()
    msg = req_data.get("msg")
    online_init_card_set()
    print("卡牌区:", online_cardset_pokers)
    uuid=datetime.datetime.now()
    load = []
    data = {'uuid': uuid}
    load.append(data)
    return jsonify(code=200, data=load, msg="操作成功")

# 获取在线牌局变化, 返回吃牌情况和牌局情况
@app.route("/online_adjust_pokers", methods=["POST"])
def online_adjust_pokers():
    req_data = request.get_json()
    last_msg = req_data.get("last_msg")  # 用户 p1=0,p2=1
    player = last_msg[0]
    type = last_msg[2]
    card = last_msg[4] + last_msg[5]
    adjust_pokers(last_msg)
    # 检验放置的牌是否花色相同，并完成牌归入想要操作者的牌里
    recover = online_check_placementarea(player)  # p1收走：1 p2:2 无：0
    # 检测牌局是否结束
    winner = online_calculate_for_winner()  # p1win:1 ; p2win:2 ; 平局：3 ;游戏未结束：0
    print("卡牌区:", online_cardset_pokers)
    print("放置区:", online_placementarea_pokers)
    print("p1:", online_p1_pokers)
    print("p2:", online_p2_pokers)
    load = []
    data = { "recover": recover, "winner": winner, "p1_pokers":online_p1_pokers, "p2_pokers":online_p2_pokers,"placearea_pokers":online_placementarea_pokers}
    load.append(data)
    return jsonify(code=200, data=load, msg="操作成功")

# 在线托管功能实现
@app.route("/online_trusteeship_api", methods=["POST"])
def online_trusteeship_api():
    req_data = request.get_json()
    player = req_data.get("player")  # 用户 p1=0,p2=1
    return_list=online_trusteeship(player)
    # 检验放置的牌是否花色相同，并完成牌归入想要操作者的牌里
    recover = online_check_placementarea(player)  # p1收走：1 p2:2 无：0
    # 检测牌局是否结束
    winner = online_calculate_for_winner()  # p1win:1 ; p2win:2 ; 平局：3 ;游戏未结束：0
    print("放置区:", online_placementarea_pokers)
    print("p1:", online_p1_pokers)
    print("p2:", online_p2_pokers)
    load = []
    if return_list[0]=='00':
        data={"type":0}
    else:
        data={"type":1,"card":return_list[0]}
    load.append(data)
    return jsonify(code=200, data=load, msg="操作成功")

if __name__ == '__main__':
    #app.run(debug=True, port=8888, host='0.0.0.0')
    app.run()
