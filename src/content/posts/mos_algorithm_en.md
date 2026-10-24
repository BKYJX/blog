---
author: BKYJ_X
pubDatetime: 2026-07-04T23:37:00Z
title: Mo's Algorithm
slug: mos-algorithm-en-us
featured: false
draft: false
tags:
  - IT
  - OI
  - C++
  - algorithms
  - English
description: Introduction to Mo's algorithm
---

# Mo's Algorithm

## Acknowledgment
Mo Tao （莫涛）

## Brief Introduction

Mo's algorithm is an efficient algorithm for **offline processing of interval query problems**, particularly suitable for query operations that can quickly extend or shrink intervals.

## Core Ideas

- **Block idea**: Divide the array into several blocks of size √n
- **Two pointers**: Use left and right pointers to maintain the currently processed interval
- **Optimal sorting**: Process queries in a specific order to minimize pointer movement

## Algorithm Principle (Suggested to move to Detailed Step Analysis)

### 1. Query Sorting Rules
- Sort by block number of left endpoint
- When block numbers are the same, sort by right endpoint (odd-even optimization)

### 2. Pointer Movement Strategy
- Process sorted queries one by one
- Update answers by extending/shrinking intervals

## Detailed Step Analysis (Key Points!!! 😃)

### Step 1: Initialization
Assume we have an array arr[1...n] of length n and m queries.

### Step 2: Blocking
Divide the array into blocks of size S = √n, where the i-th element belongs to block ⌊(i-1)/S⌋.

### Step 3: Sort Queries
Sort all queries (l, r) according to the following rules:
- First sort by the block number of the left endpoint in ascending order
- If left endpoints are in the same block, sort by the right endpoint in ascending order (if block number is even) or descending order (if block number is odd)

### Step 4: Process Queries

This is the core part of Mo's algorithm. We maintain a current interval [L, R] and its corresponding answer, initially L=1, R=0 (empty interval), answer is 0.

For each sorted query (qL, qR), perform the following operations:

#### 4.1 Concept of Interval Extension and Contraction
- **Extend interval**: Add elements to the interval
  - Left extension: Add arr[L-1] to the interval, then L--
  - Right extension: Add arr[R+1] to the interval, then R++
  
- **Contract interval**: Remove elements from the interval
  - Left contraction: Remove arr[L] from the interval, then L++
  - Right contraction: Remove arr[R] from the interval, then R--

#### 4.2 Specific Processing Process
For each query (qL, qR), adjust the current interval [L, R] to [qL, qR]:

1. **Adjust left boundary**:
   - If current L < qL (current left boundary is too far left), contract the left boundary until L=qL
     ```cpp
     while(current_l < q.l) {
         // Remove the effect of arr[current_l] on the answer
         count[arr[current_l]]--;
         if(count[arr[current_l]] == 0) current_answer--;  // If the value no longer exists, decrease answer
         current_l++;  // Move left boundary right
     }
     ```
   - If current L > qL (current left boundary is too far right), extend the left boundary until L=qL
     ```cpp
     while(current_l > q.l) {
         current_l--;  // Move left boundary left
         // Add the effect of arr[current_l] on the answer
         if(count[arr[current_l]] == 0) current_answer++;  // If the value didn't exist before, increase answer
         count[arr[current_l]]++;
     }
     ```

2. **Adjust right boundary**:
   - If current R < qR (current right boundary is too far left), extend the right boundary until R=qR
     ```cpp
     while(current_r < q.r) {
         current_r++;  // Move right boundary right
         // Add the effect of arr[current_r] on the answer
         if(count[arr[current_r]] == 0) current_answer++;  // If the value didn't exist before, increase answer
         count[arr[current_r]]++;
     }
     ```
   - If current R > qR (current right boundary is too far right), contract the right boundary until R=qR
     ```cpp
     while(current_r > q.r) {
         // Remove the effect of arr[current_r] on the answer
         count[arr[current_r]]--;
         if(count[arr[current_r]] == 0) current_answer--;  // If the value no longer exists, decrease answer
         current_r--;  // Move right boundary left
     }
     ```

#### 4.3 Key Points
- Each time adjusting the interval, only consider the impact of the added or removed element on the answer
- This incremental update makes each adjustment's complexity very low
- Through reasonable query sorting, the total number of adjustments is kept within an acceptable range

## Time Complexity Analysis

- Sorting: O(m log m)
- Processing queries:
  - Left pointer movement: Up to n movements per block, √n blocks total, so O(n√n)
  - Right pointer movement: Up to n movements per block, √n blocks total, so O(n√n)
- Overall: O(m log m + n√n)

## Key Optimization Techniques

1. **Odd-even sorting optimization**: To reduce the cost of pointer backtracking, arrange queries in the same block in descending or ascending order by right endpoint
2. **Data structure selection**: Use appropriate data structures (such as hash tables, arrays) to maintain interval statistics
3. **Constant optimization**: Reduce unnecessary memory access and computation

## Classic Example: P2709
[P2709 Template] Mo's Algorithm (https://www.luogu.com.cn/problem/P2709)

Code:

```cpp
// Thanks, Mo Tao !!! 
#include<cstdio>
#include<cmath>
#include<algorithm>
using namespace std;

#define ll long long

const ll maxn = 1e5 + 10;
ll n, m, k, s, l, r; // l & r maintain Mo's left and right pointers
ll ans[maxn], cur_ans = 0; // cur_ans is the current answer between l & r

struct part{
    ll l, r, id;
};

part a[maxn];
ll seq[maxn], cnt[maxn];
bool cmp(const part x, const part y){
    ll xb = (x.l - 1) / s;
    ll yb = (y.l - 1) / s;
    if(xb == yb){
        if(xb % 2 == 0) return x.r < y.r; // Even block ascending
        else return x.r > y.r; // Odd block descending
    }
    return xb < yb; // Ascending by block number
}

void add(ll pos){// Add element at position pos to current interval
    // First subtract the contribution of the original value, then update count, finally add the contribution of the new value
    cur_ans -= (ll)cnt[seq[pos]] * cnt[seq[pos]];
    cnt[seq[pos]]++;
    cur_ans += (ll)cnt[seq[pos]] * cnt[seq[pos]];
}

void remove(ll pos){ // Remove element at position pos from current interval
    // Same as line 29, skipping details
    cur_ans -= (ll)cnt[seq[pos]] * cnt[seq[pos]];
    cnt[seq[pos]]--;
    cur_ans += (ll)cnt[seq[pos]] * cnt[seq[pos]];
}

int main(){
    scanf("%lld%lld%lld", &n, &m, &k);
    s = sqrt(n); // Classic Mo's blocking, calculate block size sqrt(n)
    for(ll i = 1; i <= n; i++){
        scanf("%lld", &seq[i]);
    }
    for(ll i = 1; i <= m; i++){
        scanf("%lld%lld", &a[i].l, &a[i].r);
        a[i].id = i;
    }
    sort(a + 1, a + m + 1, cmp);
    l = 1, r = 0; // Classic Mo's initialization
    for(ll i = 1; i <= m; i++){
        // Extend right boundary
        while(r < a[i].r){
            r++;
            add(r);
        }
        // Shrink right boundary
        while(r > a[i].r){
            remove(r);
            r--;
        }
        // Shrink left boundary
        while(l < a[i].l){
            remove(l);
            l++;
        }
        // Extend left boundary
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
