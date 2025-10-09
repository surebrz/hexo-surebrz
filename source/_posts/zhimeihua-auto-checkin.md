title: zhimeihua-auto-checkin
date: 2025-09-19 20:12:46
tags: [python, 青龙面板]
categories: Python
---

简单的致美化自动签到脚本，用法见脚本内容

<!--more-->

```python
'''
new Env('致美化自动签到')
cron: 0 9 * * *

受大佬 @BNDou 的仓库项目启发改编
源码来自 GitHub 仓库：https://github.com/BNDou/Auto_Check_In
提取“签到”方法封装到下文中的“Zhimeihua”类中

Author: surevision
Date: 2025-09-04 12:18:14
LastEditTime: 22025-09-04- 12:18:14
FilePath: checkIn_Zhimeihua.py
Description: 
抓包流程：
    提取致美化请求中 cookie 的 b2_token 内容，配置到环境变量 cookie_zhimeihua 中，多个用换行或者 && 分割
'''
import os
import re
import sys

import requests

# 测试用环境变量
# os.environ['cookie_zhimeihua'] = ''

# try:  # 异常捕捉
#     from utils.notify import send  # 导入消息通知模块
# except Exception as err:  # 异常捕捉
#     print('%s\n❌加载通知服务失败~' % err)


# 获取环境变量
def get_env():
    # 判断 cookie_zhimeihua是否存在于环境变量
    if "cookie_zhimeihua" in os.environ:
        # 读取系统变量以 \n 或 && 分割变量
        cookie_list = re.split('\n|&&', os.environ.get('cookie_zhimeihua'))
    else:
        # 标准日志输出
        print('❌未添加cookie_zhimeihua变量')
        # send('致美化自动签到', '❌未添加cookie_zhimeihua变量')
        # 脚本退出
        sys.exit(0)

    return cookie_list


class Zhimeihua:
    '''
    Zhimeihua类封装了签到方法
    '''
    def __init__(self, user_data):
        '''
        初始化方法
        :param user_data: 用户信息，用于后续的请求
        '''
        self.param = user_data
        self.headers = {
            "authority": "zhutix.com",
            "method": "POST", 
            "path": "",
            "scheme": "https", 
            "accept": "application/json, text/plain, */*", 
            "accept-encoding": "gzip, deflate, br, zstd", 
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6", 
            "authorization":f"Bearer {user_data['b2_token']}", 
            "dnt": "1", 
            "origin": "https://zhutix.com", 
            "priority": "u=1, i", 
            "referer": "https://zhutix.com/mission/today",
            "sec-ch-ua": 'Not;A=Brand";v="99", "Microsoft Edge";v="139", "Chromium";v="139"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin"
        }

    def get_growth_info(self):
        '''
        获取用户当前的签到信息
        :return: 返回一个字典，包含用户当前的签到信息
        '''
        url = "https://zhutix.com/wp-json/b2/v1/getUserMission"
        querystring = {
            "count": 10,
            "paged": 1
        }
        self.headers["path"] = "/wp-json/b2/v1/getUserMission"
        response = requests.post(url=url, params=querystring, headers=self.headers).json()
        # print(response)
        if response.get("mission"):
            return response["mission"]
        else:
            return False

    def get_growth_sign(self):
        '''
        获取用户当前的签到信息
        :return: 返回一个字典，包含用户当前的签到信息
        '''
        url = "https://zhutix.com/wp-json/b2/v1/userMission"
        querystring = {
        }
        data = {}
        self.headers["path"] = "/wp-json/b2/v1/userMission"
        response = requests.post(url=url, json=data, params=querystring, headers=self.headers).json()
        if response:
            if type(response) == str:
                return True, response
            if response.get("credit"):
                return True, response["credit"]
        else:
            return False, response

    def do_sign(self):
        '''
        执行签到任务
        :return: 返回一个字符串，包含签到结果
        '''
        log = ""
        # 每日领空间
        growth_info = self.get_growth_info()
        if growth_info:
            log += (
                f" 用户编号{growth_info['current_user']}\n"
                f" 锋币数量：{growth_info['my_credit']}\n"
                f" 签到累计天数：{growth_info['always']}\n"
            )
            if float(growth_info['credit']) > 0:
                log += (
                    f" 今日已签到，获得锋币：{growth_info['credit']}\n"
                )
            else:
                sign, sign_return = self.get_growth_sign()
                if sign:
                    log += (
                        f"✅ 执行签到: 今日签到 + {sign_return} 锋币，"
                    )
                else:
                    log += f"❌ 签到异常: {sign_return}\n"
        else:
            log += f"❌ 签到异常: 获取信息失败\n"

        return log

def main():
    '''
    主函数
    :return: 返回一个字符串，包含签到结果
    '''
    msg = ""
    global cookie_zhimeihua
    cookie_zhimeihua = get_env()

    print("✅ 检测到共", len(cookie_zhimeihua), "个致美化账号\n")

    i = 0
    while i < len(cookie_zhimeihua):
        # 获取user_data参数
        user_data = {}  # 用户信息
        for a in cookie_zhimeihua:
            if not a == '':
                user_data.update({"b2_token": a})
        # print(user_data)
        
        # 开始任务
        log = f"🙍🏻‍♂️ 第{i + 1}个账号"
        msg += log
        # 登录
        log = Zhimeihua(user_data).do_sign()
        msg += log + "\n"

        i += 1

    print(msg)

    # try:
    #     send('致美化签到', msg)
    # except Exception as err:
    #     print('%s\n❌ 错误，请查看运行日志！' % err)

    return msg[:-1]


if __name__ == "__main__":
    print("----------致美化开始签到----------")
    main()
    print("----------致美化签到完毕----------")

```


