---
author: BKYJ_X
pubDatetime: 2026-11-13T14:34:00Z
title: LCA(Lowest Common Ancestor)
slug: lca-en-us
featured: false
draft: false
tags:
  - IT
  - OI
  - C++
  - algorithms
  - English
  - LCA
  - tree
description: Introduction to LCA
---

# LCA

LCA (Lowest Common Ancestor) aims to find the deepest common ancestor of two vertices.

## Naive Algorithm
1. First, let the deeper node jump upward until both nodes are at the same depth.
2. Then both nodes jump upward together until they meet.

Time complexity: O(n)

## Binary Lifting

**Main idea: binary decomposition of jumps.**
We want to jump upward from a node and quickly reach an ancestor; jumping step by step is too slow, so we precompute "where we can get to by jumping $2^0, 2^1, \dots, 2^n$ steps" and decompose the total number of steps to jump into binary, jumping block by block.

`up[k][u]`: the node reached by jumping $2^k$ steps upward from node u.

- $k=0$: $2^0=1$ step, `up[0][u]` = the direct parent of u (parent node)
- $k>0$: jumping $2^k$ steps = first jump $2^{k-1}$ steps, then jump $2^{k-1}$ steps again

### `up[k][u] = up[k-1][up[k-1][u]]`
⬆️ The binary lifting recurrence

Preprocessing order: compute $k=0$ first, then compute $(k=1,2,\dots,\log n)$ from small to large.
Generally, setting k=20 is enough ✅
At the same time, also preprocess: `dep[u]`: the depth of u (set the root's depth to 1 or 0, just be consistent)

### Pitfalls

1. The root's `up[0][root] = root` (it cannot be 0, otherwise it goes out of bounds)
2. Loop k from large to small, not from small to large!
3. The depth definition must be consistent; don't set the root to 0 at one moment and 1 at another


### Template

```cpp
const int LOG = 20; // log(n)
const int maxn = 100005;
int up[LOG][maxn];
int dep[maxn];
vector<int> g[maxn]; // global adjacency list

void dfs(int u, int fa){ // dfs preprocessing
    up[0][u] = fa;
    dep[u] = dep[fa] + 1;
    for(int v : g[u]){
        if(v != fa) dfs(v, u);
    }
}

void prework(int root, int n){ // overall initialization function
    dep[root] = 0;
    dfs(root, root);
    for(int k = 1; k < LOG; k++){
        for(int i = 1; i <= n; i++){
            up[k][i] = up[k-1][up[k-1][i]];
        }
    }
}

int lca(int u, int v){ // overall LCA function
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

## Template Problem [Luogu P3379](https://www.luogu.com.cn/problem/P3379)
AC code: (with [submission record](https://www.luogu.com.cn/record/309696384))

```cpp
#include<cstdio>
#include<vector>
#include<algorithm>
using namespace std;

const int LOG = 25 ; // log(n)
const int maxn = 5 * 1e5 + 10;
int up[LOG][maxn], dep[maxn], n, m, s;
vector<int> g[maxn];

void dfs(int u, int fa){ // dfs preprocessing
    up[0][u] = fa;
    dep[u] = dep[fa] + 1;
    for(int v : g[u]){
        if(v != fa) dfs(v, u);
    }
}

void prework(int root, int n){ // overall initialization function
    dep[root] = 0;
    dfs(root, root);
    for(int k = 1; k < LOG; k++){
        for(int i = 1; i <= n; i++){
            up[k][i] = up[k-1][up[k-1][i]];
        }
    }
}

int lca(int u, int v){ // overall LCA function
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