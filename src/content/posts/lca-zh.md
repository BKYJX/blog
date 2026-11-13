---
author: BKYJ_X
pubDatetime: 2026-11-13T14:34:00Z
title: 最近公共祖先（LCA）
slug: lca-zh-cn
featured: false
draft: false
tags:
  - IT
  - OI
  - C++
  - algorithms
  - Chinese
  - LCA
  - tree
description: LCA介绍
---

# LCA

LCA（Lowest Common Ancestor），最近公共祖先，旨在寻找两顶点深度最深的公共祖先。

## 朴素算法
1. 先让深度较深的节点向上跳到同一深度
2. 两节点一起向上跳直到相遇

暴力出奇迹！！复杂度：O(n)

## 倍增算法 Binary Lifting

**核心思想：二进制拆分跳跃。**
我们想从一个点往上跳，快速跳到祖先；一步一步跳太慢，就预先存好「跳$2^0, 2^1, …, 2^n$步」能到哪里，把要跳的总步数拆成二进制，一块一块跳。

`up[k][u]`：从点 u 向上跳$2^k$步到达的节点。

- $k=0$：$2^0=1$步，`up[0][u]` = u 的直接父亲（父节点）
- $k>0$：跳 $2^k$ 步 = 先跳 $2^{k-1}$ 步，再跳 $2^{k-1}$ 步

### `up[k][u] = up[k-1][up[k-1][u]]`
⬆️ 倍增递推式

预处理顺序：先算 $k=0$，再从小到大算 $(k=1,2,\dots,\log n)$。
一般开到 k=20 即可✅
同时还要预处理：`dep[u]`：u 的深度（根的深度设为 1 或 0，统一就行）

### 坑

1. 根的 `up[0][root] = root`（不能是 0，不然越界）
2. 循环 k 从大往小枚举，不是从小到大！
3. 深度定义要统一，不要一会根是 0 一会根是 1


### 模板

```cpp
const int LOG = 20; // log(n)
const int maxn = 100005;
int up[LOG][maxn];
int dep[maxn];
vector<int> g[maxn]; // 全局邻接表

void dfs(int u, int fa){ // dfs 预处理
    up[0][u] = fa;
    dep[u] = dep[fa] + 1;
    for(int v : g[u]){
        if(v != fa) dfs(v, u);
    }
}

void prework(int root, int n){ // 总初始化函数
    dep[root] = 0;
    dfs(root, root);
    for(int k = 1; k < LOG; k++){
        for(int i = 1; i <= n; i++){
            up[k][i] = up[k-1][up[k-1][i]];
        }
    }
}

int lca(int u, int v){ // LCA总函数
    if(dep[u] < dep[v]) swap(u, v);
    for(int k = LOG - 1; k >= 0; k--){
        if(dep[up[k][u]] >= dep[v]) u = up[k][u];
    }
    if (u == v) return u;
    for(int k = LOG - 1; k >= 0; k--){
        if(up[k][u] != up[k][v]) u = up[k][u], v = up[k][v];
    }
    return up[0][u];
}
```

## 模板题 [Luogu P3379](https://www.luogu.com.cn/problem/P3379)
AC代码：（附[评测记录](https://www.luogu.com.cn/record/309696384)）

```cpp
#include<cstdio>
#include<vector>
#include<algorithm>
using namespace std;

const int LOG = 25 ; // log(n)
const int maxn = 5 * 1e5 + 10;
int up[LOG][maxn], dep[maxn], n, m, s;
vector<int> g[maxn];

void dfs(int u, int fa){ // dfs 预处理
    up[0][u] = fa;
    dep[u] = dep[fa] + 1;
    for(int v : g[u]){
        if(v != fa) dfs(v, u);
    }
}

void prework(int root, int n){ // 总初始化函数
    dep[root] = 0;
    dfs(root, root);
    for(int k = 1; k < LOG; k++){
        for(int i = 1; i <= n; i++){
            up[k][i] = up[k-1][up[k-1][i]];
        }
    }
}

int lca(int u, int v){ // LCA总函数
    if(dep[u] < dep[v]) swap(u, v);
    for(int k = LOG - 1; k >= 0; k--){
        if(dep[up[k][u]] >= dep[v]) u = up[k][u];
    }
    if (u == v) return u;
    for(int k = LOG - 1; k >= 0; k--){
        if(up[k][u] != up[k][v]) u = up[k][u], v = up[k][v];
    }
    return up[0][u];
}

int main(){
    scanf("%d%d%d", &n, &m, &s);
    for(int i = 1; i <= n - 1; i++){
        int x, y;
        scanf("%d%d", &x, &y);
        g[x].push_back(y);
        g[y].push_back(x);
    }
    prework(s, n);
    for(int i = 1; i <= m; i++){
        int a, b;
        scanf("%d%d", &a, &b);
        printf("%d\n", lca(a, b));
    }
    return 0;
}
```