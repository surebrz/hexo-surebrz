title: 试试typedef函数指针相关的东西
date: 2017-02-06 10:51:51
tags: [c++,语法]
categories: 笔记
---

作为回调

```c++
#include <iostream>
using namespace std;
class Clz{};
typedef void (Clz::*pot)();
class Sub : public Clz{
public:
    void test(){cout<<"test"<<endl;}
    pot pFun;
    void testCallback(){(this->*pFun)();}
};
int main() {
    // your code goes here
    Sub* sub = new Sub();
    sub->pFun = pot(&Sub::test);
    sub->testCallback();
    delete sub;
    return 0;
}
```