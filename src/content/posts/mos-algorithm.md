---
author: BKYJ_X
pubDatetime: 2026-07-04T23:37:00Z
title: 莫队算法
slug: my-new-post
featured: false
draft: false
tags:
  - IT
  - OI
  - C++
  - algorithms
  - Chinese
description: 莫队算法介绍
---

# 莫队算法 (Mo's Algorithm)

## 致谢
莫涛 MO Tao

## 废话简介

莫队算法是一种用于**离线处理区间查询问题**的高效算法，特别适用于可以快速扩展或收缩区间的查询操作。

## 核心思想

- **分块思想**: 将数组分成若干个大小为√n的块
- **双指针**: 使用左右两个指针维护当前处理的区间
- **最优排序**: 按特定顺序处理查询以最小化指针移动

## 算法原理（建议移步详细步骤解析）

### 1. 查询排序规则
- 按左端点所在块编号排序
- 块编号相同时按右端点排序（奇偶性优化）

### 2. 指针移动策略
- 逐个处理排序后的查询
- 通过扩展/收缩区间来更新答案

## 详细步骤解析（划重点！！！😃）

### 步骤1：初始化
假设我们有一个长度为n的数组arr[1...n]和m个查询。

### 步骤2：分块
将数组分成大小为S = √n的块，第i个元素属于第⌊(i-1)/S⌋块。

### 步骤3：排序查询
将所有查询(l, r)按以下规则排序：
- 首先按左端点所在块编号升序排序
- 若左端点在同一块内，则按右端点升序排序（若块编号为偶数）或降序排序（若块编号为奇数）

### 步骤4：处理查询

这是莫队算法的核心部分。我们维护一个当前区间[L, R]及其对应的答案，初始时L=1, R=0（空区间），答案为0。

对每个排序后的查询(qL, qR)进行如下操作：

#### 4.1 区间扩展与收缩的概念
- **扩展区间**：向区间添加元素
  - 左侧扩展：将arr[L-1]加入区间，然后L--
  - 右侧扩展：将arr[R+1]加入区间，然后R++
  
- **收缩区间**：从区间移除元素
  - 左侧收缩：将arr[L]从区间移除，然后L++
  - 右侧收缩：将arr[R]从区间移除，然后R--

#### 4.2 具体处理过程
对于每个查询(qL, qR)，需要将当前区间[L, R]调整为[qL, qR]：

1. **调整左边界**：
   - 如果当前L < qL（当前左边界太靠左），需要收缩左边界直到L=qL
     ```
     while(current_l < q.l) {
         // 移除arr[current_l]对答案的影响
         count[arr[current_l]]--;
         if(count[arr[current_l]] == 0) current_answer--;  // 如果该值不再存在，答案减1
         current_l++;  // 左边界右移
     }
     ```
   - 如果当前L > qL（当前左边界太靠右），需要扩展左边界直到L=qL
     ```
     while(current_l > q.l) {
         current_l--;  // 左边界左移
         // 添加arr[current_l]对答案的影响
         if(count[arr[current_l]] == 0) current_answer++;  // 如果该值之前不存在，答案加1
         count[arr[current_l]]++;
     }
     ```

2. **调整右边界**：
   - 如果当前R < qR（当前右边界太靠左），需要扩展右边界直到R=qR
     ```
     while(current_r < q.r) {
         current_r++;  // 右边界右移
         // 添加arr[current_r]对答案的影响
         if(count[arr[current_r]] == 0) current_answer++;  // 如果该值之前不存在，答案加1
         count[arr[current_r]]++;
     }
     ```
   - 如果当前R > qR（当前右边界太靠右），需要收缩右边界直到R=qR
     ```
     while(current_r > q.r) {
         // 移除arr[current_r]对答案的影响
         count[arr[current_r]]--;
         if(count[arr[current_r]] == 0) current_answer--;  // 如果该值不再存在，答案减1
         current_r--;  // 右边界左移
     }
     ```

#### 4.3 关键点
- 每次调整区间时，只需要考虑被添加或被移除的那个元素对答案的影响
- 这种增量式更新使得每次调整的复杂度很低
- 通过合理的查询排序，总的调整次数被控制在可接受范围内

## 时间复杂度分析

- 排序: O(m log m)
- 处理查询:
  - 左指针移动: 每个块内最多移动n次，共√n个块，所以O(n√n)
  - 右指针移动: 每个块内最多移动n次，共√n个块，所以O(n√n)
- 总体: O(m log m + n√n)

## 关键优化技巧

1. **奇偶排序优化**: 为了减少指针回退的代价，对同一块内的查询按右端点降序或升序排列
2. **数据结构选择**: 使用合适的数据结构（如哈希表、数组）来维护区间统计信息
3. **常数优化**: 减少不必要的内存访问和计算

## 典例：P2709
[P2709 【模板】莫队 / 小 B 的询问](https://www.luogu.com.cn/problem/P2709)
空降

上代码

```CPP
// 感谢莫涛贡献莫队算法
// Thanks, Mo Tao !!!
#include<cstdio>
#include<cmath>
#include<algorithm>
using namespace std;

#define ll long long

const ll maxn = 1e5 + 10;
ll n, m, k, s, l, r; // l & r 维护莫队左右指针
ll ans[maxn], cur_ans = 0; // cur_ans为当前l & r 之间的答案

struct part{
    ll l, r, id;
};

part a[maxn];
ll seq[maxn], cnt[maxn];
bool cmp(const part x, const part y){
    ll xb = (x.l - 1) / s;
    ll yb = (y.l - 1) / s;
    if(xb == yb){
        if(xb % 2 == 0) return x.r < y.r; // 偶数块升序
        else return x.r > y.r; // 奇数块降序
    }
    return xb < yb; // 按块号升序
}

void add(ll pos){// 添加位置pos处的元素到当前区间
    // 先减去原来该数值的贡献，再更新计数，最后加上新数值的贡献
    cur_ans -= (ll)cnt[seq[pos]] * cnt[seq[pos]];
    cnt[seq[pos]]++;
    cur_ans += (ll)cnt[seq[pos]] * cnt[seq[pos]];
}

void remove(ll pos){ // 从当前区间移除位置pos处的元素
    // 同29行懒得写了
    cur_ans -= (ll)cnt[seq[pos]] * cnt[seq[pos]];
    cnt[seq[pos]]--;
    cur_ans += (ll)cnt[seq[pos]] * cnt[seq[pos]];
}

int main(){
    scanf("%lld%lld%lld", &n, &m, &k);
    s = sqrt(n); // 莫队经典分块 计算块大小 sqrt(n)
    for(ll i = 1; i <= n; i++){
        scanf("%lld", &seq[i]);
    }
    for(ll i = 1; i <= m; i++){
        scanf("%lld%lld", &a[i].l, &a[i].r);
        a[i].id = i;
    }
    sort(a + 1, a + m + 1, cmp);
    l = 1, r = 0; // 莫队经典init
    for(ll i = 1; i <= m; i++){
        // 扩展右边界
        while(r < a[i].r){
            r++;
            add(r);
        }
        // 缩小右边界
        while(r > a[i].r){
            remove(r);
            r--;
        }
        // 缩小左边界
        while(l < a[i].l){
            remove(l);
            l++;
        }
        // 扩展左边界
        while(l > a[i].l){
            l--;
            add(l);
        }
        ans[a[i].id] = cur_ans;
    }
    
    for(ll i = 1; i <= m; i++){
        printf("%lld\n", ans[i]);
    }
    return 0;
}
```
