import random
import datetime

online_pokers1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
online_pokers_color = ['H', 'S', 'C', 'D']  # 黑桃:S;红桃:H;梅花:C;方块:D SQ:黑桃Q
online_cardset_pokers = []
online_placementarea_pokers = []
online_p1_pokers = []
online_p2_pokers = []

# 初始化牌组,作用在托管功能上
def online_init_card_set():
    for i in online_pokers_color:  # 初始化牌组
        for j in online_pokers1:
            card = i + j
            online_cardset_pokers.append(card)

#从牌组里抽牌
def online_add_placearea_pokers(card):
    online_cardset_pokers.pop(online_cardset_pokers.index(card))
    online_placementarea_pokers.append(card)

# 从手牌里抽取牌
def online_extract_from_hand(player, card):
    if player == 0:
        online_placementarea_pokers.append(online_p1_pokers.pop(online_p1_pokers.index(card)))
    else:
        online_placementarea_pokers.append(online_p2_pokers.pop(online_p2_pokers.index(card)))
    #check_placementarea(player)

# 检验放置的牌是否花色相同，并完成牌归入想要操作者的牌里
def online_check_placementarea(player):
    last = len(online_placementarea_pokers)
    if last > 1 and online_placementarea_pokers[last - 1][0] == online_placementarea_pokers[last - 2][0]:
        if player == 0:
            while (len(online_placementarea_pokers) > 0):
                i=online_placementarea_pokers.pop()
                online_p1_pokers.append(i)
            return 1
        else:
            while (len(online_placementarea_pokers) > 0):
                i = online_placementarea_pokers.pop()
                online_p2_pokers.append(i)
            return 2
    return 0


# 由牌组已空,触发计算胜者
def online_calculate_for_winner():
    print(len(online_cardset_pokers))
    if(len(online_cardset_pokers)==0):
        if len(online_p1_pokers) > len(online_p2_pokers):
            return 1
        elif len(online_p1_pokers) == len(online_p2_pokers):
            return 2
        else:
            return 3
    else:
        return 0


# 获取在线操作信息更新，纸牌分布
def adjust_pokers(last_msg):
    player=last_msg[0]
    type=last_msg[2]
    card=last_msg[4]+last_msg[5]
    if type==1:
        online_extract_from_hand(player,card)
    else:
        online_add_placearea_pokers(card)

# 托管功能
def online_trusteeship(player):
    type=0
    p2_len = len(online_p2_pokers)
    p1_len = len(online_p1_pokers)
    placementarea_pokers_len = len(online_placementarea_pokers)
    cardset_pokers_len = len(online_cardset_pokers)
    if player==0:
        if p1_len==0|p1_len<(p2_len+placementarea_pokers_len):
            card='00'
        else:
            for i in online_p1_pokers:
                if i != online_placementarea_pokers[placementarea_pokers_len]:
                    card = i
                    break
            type=1
        return card

        return [card,type]


if __name__ == '__main__':
   adjust_pokers("0 0 C8")



