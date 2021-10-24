import random
import datetime
pokers1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
pokers_color = ['H', 'S', 'C', 'D']  # 黑桃:S;红桃:H;梅花:C;方块:D SQ:黑桃Q
cardset_pokers = []
placementarea_pokers = []
p1_pokers = []
p2_pokers = []
recover_pokers=[]

# 初始化牌组并洗牌
def init_card_set():
    for i in pokers_color:  # 初始化牌组
        for j in pokers1:
            card = i + j
            cardset_pokers.append(card)
    random.shuffle(cardset_pokers)  # 洗牌


# 从牌组里随机抽取牌
def extract_from_cardset(player):
    if len(cardset_pokers) > 0:
        card = cardset_pokers.pop()
        placementarea_pokers.append(card)
        check_placementarea(player)
        card=card
        return card
    else:
        card='none'
        return card
    '''else:
        calculate_for_winner(player)'''


# 从手牌里抽取牌
def extract_from_hand(player, card):
    if player == 0:
        placementarea_pokers.append(p1_pokers.pop(p1_pokers.index(card)))
    else:
        placementarea_pokers.append(p2_pokers.pop(p2_pokers.index(card)))
    #check_placementarea(player)


# 检验放置的牌是否花色相同，并完成牌归入想要操作者的牌里
def check_placementarea(player):
    last = len(placementarea_pokers)
    if last > 1 and placementarea_pokers[last - 1][0] == placementarea_pokers[last - 2][0]:
        if player == 0:
            while (len(placementarea_pokers) > 0):
                i=placementarea_pokers.pop()
                p1_pokers.append(i)
            return 1
        else:
            while (len(placementarea_pokers) > 0):
                i = placementarea_pokers.pop()
                p2_pokers.append(i)
            return 2
    return 0


# 由牌组已空,触发计算胜者
def calculate_for_winner():
    if(len(cardset_pokers)==0):
        if len(p1_pokers) > len(p2_pokers):
            return 1
        elif len(p1_pokers) == len(p2_pokers):
            return 2
        else:
            return 3
    else:
        return 0

# 托管功能
def trusteeship(player):
    type=0
    p2_len = len(p2_pokers)
    p1_len = len(p1_pokers)
    placementarea_pokers_len = len(placementarea_pokers)
    cardset_pokers_len = len(cardset_pokers)
    if player==0:
        if p1_len==0|p1_len<(p2_len+placementarea_pokers_len):
            card=extract_from_cardset(0)
        else:
            for i in p1_pokers:
                if i != placementarea_pokers[placementarea_pokers_len]:
                    card = i
                    break
            extract_from_hand(0, card)
            type=1
        return card
    else:
        if p2_len==0|p2_len<(p1_len+placementarea_pokers_len):
            card=extract_from_cardset(1)
        else:
            for i in p1_pokers:
                if i != placementarea_pokers[placementarea_pokers_len]:
                    card = i
                    break
            extract_from_hand(1, card)
            type=1
        return [card,type]


'''
if __name__ == '__main__':
    player = -1
    init_card_set()
    i = 52
    
    验证牌组抽牌和检验胜者
    while i > 0:
        player=-player
        extract_from_cardset(player)
        print("放置区:", placementarea_pokers)
        print("p1:", p1_pokers)
        print("p2:", p2_pokers)
        i = i - 1
    
    验证从操作者手中出牌
    p1_pokers=['SQ','HQ']
    card='SQ'
    extract_from_hand(0,card)
    print("放置区:", placementarea_pokers)
    print("p1:", p1_pokers)
    
'''

