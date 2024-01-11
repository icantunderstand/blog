---
title: 排序
date: 2020-11-02 07:30:00  
categories: 
---

## 冒泡排序
每一轮将当前未排序中最大数移动到最后(如果没有移动可以跳出循环进行优化)

    function bubbleSort(arr) {
      const len = arr.length;
      for(let i = 0; i < len - 1;i++) {
        // 记录是否经历过交换,没有交换就跳出循环
        let flag = false;
        for(let j = 0; j < len - i - 1;j++) {
          if(arr[j] > arr[j+1]) {
            const temp = arr[j+1];
            arr[j+1] = arr[j];
            arr[j] = temp;
            flag = true;
          }
        }
        if(!flag) {
          break;
        }
      }
    }

## 选择排序
默认将数组拆分为已排序和未排序部分,循环遍历将未排序部分最小元素插入到已排序末尾
选择排序的关键是 从后面未排序的部分找到一个最小的


    function selectSort(arr) {
      const len = arr.length;
      let i, j, minIndex, minValue, temp;
      for(i = 0; i < len -1;i++) {
        minIndex = i;
        minValue = arr[minIndex];
        for(j = i+1; j < len;j++) {
          // 记录最小元素的位置
          if(arr[j] < minValue) {
            minIndex = j;
            minValue = arr[minIndex];
          }
        }
        // 与当前元素替换
        temp = arr[i]
        arr[i] = minValue;
        arr[minIndex] = temp;
      }
    }

## 归并排序

归并排序是一种分治思路, 将排序数组进行拆分然后将以排序的子数组进行合并


    function mergeSort(arr) {
      if(arr.length === 1) {
        return arr;
      }
      const middle = Math.floor(arr.length / 2);
      const left = arr.slice(0,middle);
      const right = arr.slice(middle);
      return merge(mergeSort(left), mergeSort(right));
    }
    // 合并两个已排序数组
    function merge(left, right) {
      const result = [];
      while(left.length > 0 && right.length > 0) {
        if(left[0] < right[0]) {
          result.push(left.shift());
        } else {
          result.push(right.shift());
        }
      }
      return result.concat(left).concat(right);
    }


### 快速排序

#### 原理
https://www.runoob.com/w3cnote/quick-sort-2.html
快速排序也是一种分治思路.通过选定特定的元素,将数组划分为小于当前元素和大于当前元素的两部分,然后继续对划分的区间进行排序


    function parttion(arr, low, high) {
        let pivot = arr[low]
        while(low < high) {
            while(low < high && arr[high] > pivot) {
                high--
            }
            arr[low] = arr[high]
            while(low < high && arr[low] <= pivot) {
                low++
            }
            arr[high] = arr[low]
        }
        arr[low] = pivot
        return low
    }

    function quickSort(arr, low, high) {
        if(low < high) {
            let pivotIndex = parttion(arr, low, high)
            quickSort(arr, low, pivotIndex - 1)
            quickSort(arr, pivotIndex + 1, high)
        }
        
        return arr
    }

    console.log(quickSort([3,4,2,1,8], 0, 4))


### 堆排序

https://www.runoob.com/w3cnote/heap-sort.html
堆其实就是利用完全二叉树的结构来维护的一维数组

大顶堆: 每个结点的值都大于或等于其左右孩子结点的值
小顶堆: 每个结点的值都小于或等于其左右孩子结点的值

先把所有的非叶子节点构建成最大堆, 排序的时候拿第一个(最大的元素)与最后一个互换, 然后把后边的部分排序继续构建堆重复这个过程

    function buildMaxHeap(arr) {
      const len = arr.length;
      for(let i = Math.floor(len /2); i >= 0; i--) {
        heapify(arr, i, len);
      }
    }
    function swap(arr, i, j) {
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    function heapify(arr, i, len) {
      const left = 2*i +1;
      const right = 2*i +2;
      let largest = i
      if(left < len && arr[left] > arr[largest]) {
        largest = left;
      }
      if(right < len && arr[right] > arr[largest]) {
        largest = right;
      }
      if(largest !== i) {
        swap(arr, i, largest);
        heapify(arr, largest, len);
      }
    }
    function heapSort(arr) {
      buildMaxHeap(arr);
      let len = arr.length;
      for(let i = arr.length -1; i> 0;i--) {
        swap(arr, 0, len);
        len--;
        heapify(arr, 0, len)

      }
      return arr;
    }


### 插入排序
默认将数组拆分为已排序部分和未排序部分,循环遍历将未排序部分的第一个元素插入到已排序元素的合适位置 关键点是移动
插入排序的关键是 找到一个往前面插入

    function insertSort(arr) {
      let len = arr.length;
      for(let i = 1; i < len; i++) {
        const value = arr[i];
        let j = i-1;
        for(; j>= 0;j--) {
          // 元素移动
          if(arr[j] > value) {
            arr[j+1] = arr[j];
          } else {
            break;
          }
        }
        arr[j+1] = value;
      }
    }

### 二分查找

  // 实现二分查找 首先要保证数组的有序数组
   function binarySearch(list, target){
      let start = 0, end = list.length -1;
        while(start <= end){
            let mid = Math.floor((start + end) / 2);
            if(list[mid] > target){
                end = mid -1;
            }else if (list[mid] < target){
                start = mid + 1;
            }else{
                return mid
            }
        }
        return -1;
    }

## 树


### 给定一个二叉树  找出该树中给定的两个指定节点的最短距离


    function getTwoNodePath(root, p , q) {
      // 最近公共祖先
      let lowestCA = lowestCommonAncestor(root, p, q)
      // 分别求出公共祖先到两个节点的路经
      let pDis = [], qDis = []
      // 一个节点到另一个节点的路径之和
      getPath(lowestCA, p, pDis)
      getPath(lowestCA, q, qDis)
      // 返回路径之和
      return (pDis.length + qDis.length)
    }
    function getLowerestAncestor(root, p, q) {
      if(root === null || root === p || root === q) { return root }
      const left = getLowerestAncestor(root.left, p, q)
      const right = getLowerestAncestor(root.right, p, q)
      if(left === null) {
        return right
      }
      if(right === null) {
        return left
      }
      return root
    }
    function getPath(root, p, paths = []) {
      if(root === p) {
        return true
      }
      paths.push(root)
      let hasFound = false
      if(root.left !== null) {
        hasFound = getPath(root.left, p, paths)
      }
      if(!hasFound && root.right !== null) {
        hasFound = getPath(root.right, p, paths)
      }
      if(!hasFound) {
        paths.pop()
      }
      return hasFound
    }





## 相关资料
https://www.cnblogs.com/chengxiao/p/6129630.html