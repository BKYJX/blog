---
author: BKYJ_X
pubDatetime: 2026-10-25T23:36:00Z
title: 并查集
slug: dsu-zh-cn
featured: false
draft: false
tags:
  - IT
  - OI
  - C++
  - algorithms
  - Chinese
  - DSU
description: 并查集算法介绍
---
## 废话简介
并查集是一种树形数据结构，用于处理一些不相交集合（集）的合并（并）及查询（查）问题。 比如说，我们可以用并查集来判断一张图中有几个联通块、某个节点是否属于某个块、某个节点与某个节点是否在一个块中等。并查集主要由一个整型数组`pre[]`和两个函数`find()` `unite()`组成。

## 原理
`pre[i]`用于存放`i`的父节点，而`find()`函数用于查询某节点的根节点。因此，只要`a`, `b`两个节点的`find`查询结果相同（`find(a) == find(b)`）则这两个节点属于同一个联通块。
根据`find()`函数的原理，如果要用`unite()`函数将两个节点联通，仅需使`pre[find(b)] = find(a)` 即可。
**注意：`pre`数组初始化需使 $pre_i=i$，作为`find()`函数的递归边界。**

## `find()`函数与`unite()`函数模板
```cpp
bool find(int k){ // 查询一个节点的根节点
	if(find(k) == k){ // pre_i = i，递归终止，k是根节点序号
		return k;
	}
	return find(pre[k]); // 对pre_i的父节点进行查询
}
```

```cpp
void unite(int a, int b){ // 合并a所在的联通块与b所在的联通块
	a = find(a);
	b = find(b); // 对各自的根节点进行操作
	if(a == b) return; // a和b已联通，无需再操作
	pre[b] = a; // 联通，b不再是根节点
}
```

模板题：[洛谷P3367-【模板】并查集](https://www.luogu.com.cn/problem/P3367)
