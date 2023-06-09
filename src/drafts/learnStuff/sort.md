---
title: 排序
date: 2020-11-02 07:30:00  
categories: 
---

## 冒泡排序
每一轮将当前未排序中最大数移动到最后(如果没有移动可以跳出循环进行优化)

    function bubbleSort(arr) {
      const len = arr.length;
      for(let i = 0; i < len;i++) {
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
快速排序也是一种分治思路.通过选定特定的元素,将数组划分为小于当前元素和大于当前元素的两部分,然后继续对划分的区间进行排序


    function quicksort(int left,int right, a) {
      int i,j,t,temp;
      if(left>right) {
        return;
      }
      temp=a[left]; //temp中存的就是基准数
      i=left;
      j=right;
      while(i!=j)
      {
        //顺序很重要，要先从右边开始找 找到比游标小的
        while(a[j]>=temp && i<j)
        j--;
        //再找右边的
        while(a[i]<=temp && i<j) 找到比游标大的
        i++;
        //交换两个数在数组中的位置
        if(i<j) {
          t=a[i];
          a[i]=a[j];
          a[j]=t;
        }
      }
      //最终将基准数归位
      a[left]=a[i];
      a[i]=temp;
      quicksort(left,i-1, a);//继续处理左边的，这里是一个递归的过程
      quicksort(i+1,right, a);//继续处理右边的 ，这里是一个递归的过程
    }

### 堆排序

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
      const len = arr.length;
      for(let i = arr.length -1; i> 0;i--) {
        swap(arr, 0, len);
        len--;
        heapify(arr, 0, len)

      }
      return arr;
    }

#### 数组中最小的k个元素

    let getLowestNumbers = function(arr, k) {
      // 从 arr 中取出前 k 个数，构建一个大顶堆
      let heap = [], i = 0
      while(i < k) {
        heap.push(arr[i++]) 
      }
      buildHeap(heap, k)
      
      // 从 k 位开始遍历数组
      for(let i = k; i < arr.length; i++) {
          if(heap[0] > arr[i]) {
              // 替换并堆化
              heap[0] = arr[i]
              heapify(heap, k, 0)
          }
      }
      return heap
    };

    // 原地建堆，从后往前，自上而下式建大顶堆
    let buildHeap = (arr, k) => {
        if(k === 1) return
        // 从最后一个非叶子节点开始，自上而下式堆化
        for(let i = Math.floor(k/2); i>=1 ; i--) {
            heapify(arr, k, i)
        }
    }

    // 堆化
    let heapify = (arr, k, i) => {
        // 自上而下式堆化
        while(true) {
            let maxIndex = i
            if(2*i <= k && arr[2*i] > arr[i]) {
                maxIndex = 2*i
            }
            if(2*i+1 <= k && arr[2*i+1] > arr[maxIndex]) {
                maxIndex = 2*i+1
            }
            if(maxIndex !== i) {
                swap(arr, i, maxIndex)
                i = maxIndex
            } else {
                break
            }
        }
    }

    // 交换
    let swap = (arr, i , j) => {
        let temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
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
   function findIndex(list, target){
      let start = 0, end = list.length -1;
        let index = -1;
        while(start !=end && start < end){
            let mid = start + Math.floor((end - start ) / 2);
            if(list[mid] > target){
                end = mid -1;
            }else if (list[mid] < target){
                start = mid + 1;
            }else{
                index = mid;
                end = mid -1;
            }
        }
        return index;
    }

## 树

### 树的深度遍历


    // 递归实现
    function deepTravel(root, result = []) {
      result.push(root.value);
      if(root.left || root.right) {
        if(root.left) {
          result.concat(deepTravel(root.left, result));
        }
        if(root.right) {
          result.concat(deepTravel(root.right, result));
        }
      }
      return result;
    }

    // 非递归实现  **使用栈后入先出**  这个是二叉数的前序遍历
    function deepTravel(tree) {
      const result = []
      const stack = []
      stack.push(tree)
      while(stack.length) {
        const first = stack.pop()
        result.push(first.value)
        if(first.right) {
          stack.push(first.right)
        }
        if(first.left) {
          stack.push(first.left)
        }
      }
    }

    // 非递归实现 二叉数的中序遍历
    function deepTravelMiddle(tree) {
      let result = []
      let node = tree
      let stack = []
      while(node || stack.length) {
        while(node) {
          stack.push(node)
          node = node.left
        }
        node = stack.pop()
        result.push(node.value)
        node = node.right
      }
      return result
    }

    // 非递归实现  二叉数的后序遍历
    // 后序遍历  需要把这三个遍历方式熟悉
    const postorderTraversal = (root) => {
      const list = [];
      const stack = [];
      
      // 当根节点不为空的时候，将根节点入栈
      if(root) stack.push(root)
      while(stack.length > 0) {
          const node = stack.pop()
          // 根左右=>右左根
          list.unshift(node.val)
          
          // 先进栈左子树后右子树
          // 出栈的顺序就变更为先右后左
          // 右先头插法入list
          // 左再头插法入list
          // 实现右左根=>左右根
          if(node.left !== null) {
              stack.push(node.left)
          }
          if(node.right !== null) {
              stack.push(node.right)
          }
      }
      return list
  }

### 树的广度遍历

    //  广度遍历要使用队列
    function Queue() {
      this.nums = [];
    }
    Queue.prototype.enqueue = function(value) {
      this.nums.push(value);
    }
    Queue.prototype.dequeue = function() {
      return this.nums.shift();
    }
    Queue.prototype.length = function() {
      return this.nums.length;
    }
    function wideTravel(root) {
      const queue = new Queue();
      queue.enqueue(root);
      const result = [];
      while(queue.length > 0) {
        const node = queue.dequeue();
        result.push(node.value);
        if(node.left) {
          queue.enqueue(node.left);
        }
        if(node.right) {
          queue.enqueue(node.right);
        }
      }
      return result;
    }

### 获取二叉数的深度

    // 递归实现
    function getTreeDepth(tree) {
      if(tree === null) {
        return 0;
      }
      const leftDepth = getTreeDepth(tree.left);
      const rightDepth = getTreeDepth(tree.right);
      return (leftDepth >= rightDepth ? leftDepth : rightDepth) + 1;
    }
    // 非递归实现
    function getDepth(tree) {
      const queue = [];
      queue.push(tree);
      let depth = 0;
      while(queue.length) {
        depth++;
        const tempNodes = queue.length;
        for(let i = 0; i< tempNodes;i++) {
          const node = queue.shift();
          if(node.left) {
            queue.push(node.left);
          }
          if(node.right) {
            queue.push(node.right);
          }
        }
      }
      return depth;
    }

### 获取二叉数每层最右侧节点的值

    // 递归版本 通过层级去做
    function findTreeRight(node, level, res = []) {
      if(!node) {
        return 
      }
      if(res.length === level) {
        res.push(node.value)
      }
      findTreeRight(node.right, level+1, res)
      findTreeRight(node.left, level+1, res)
    }

    // 非递归版本 就是广度遍历 但是只存最后一个

    function findTreeRight(tree) {
      const queue = []
      const result = []
      if(!tree) {
        return 
      }
      queue.push(tree) 
      while(queue.length) {
        const tempNodes = queue.length
        let value = null
        for(let i = 0; i < tempNodes;i++) {
          const node = queue.shift()
          value = node.value
          if(node.left) {  queue.push(node.left) }
          if(node.right) {  queue.push(node.right) }
        }
        result.push(value)
      }
      return result 
    }

### 获取二叉树根节点到叶子节点的路径


    var binaryTreePaths = function(root) {
      if (root === null) return [];
      if (root.left === null && root.right === null) {
        return [root.val.toString()];
      }
      var left = binaryTreePaths(root.left),
          right = binaryTreePaths(root.right);
      return left.concat(right).map(x => root.val + '->' + x);
    }

### 判断二叉树上路径上值的和是否有对应的值

    function hasPathSum(tree, sum) {
      if(tree === null) {
        return false
      }
      if(tree.left === null && tree.right === null) {
        return tree.value === sum
      }
      const rest = sum - tree.value
      return hasPathSum(tree.left, rest) || hasPathSum(tree.right, rest)
    }

### 查找二叉树指定节点的公共祖先


    function findLowestAncestorNode(root, p, q) {
      if(root === null || root === p || root === q) { return root }
      const left = findLowestAncestorNode(root.left, p, q)
      const right = findLowestAncestorNode(root.right, p, q)
      // 如果左边没有 就在右边
      if(left === null) {
        return right
      }
      if(right === null) {
        return left
      }
      return root
    }

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

## js 大数相乘

  function multi(a, b) {
    const stra = String(a)
    const strb = String(b)
    const resultLength = stra.length + strb.length
    const result = new Array(resultLength).fill(0)
    for(let i = 0; i < stra.length;i++) {
      for(let j = 0; j < strb.length;j++) {
        result[i+j+1] += Number(stra[i]) * Number(strb[j])
      }
    }
    for(let i = resultLength - 1;i >= 0; i--) {
      let carry = Math.trunc(result[i] / 10)
      if(carry) {
        result[i - 1] += carry 
      } 
      result[i] = result[i] % 10
    }
    while(result[0] === 0) {
      result.shift()
    }
    return result.join('') || '0'
  }

## 实现一个连加函数

  function curry(fn) {
      return function (x) {
        return function g(x, y) {
          if(y == void 0) {
            return x
          } else {
            return g.bind(this, fn(x,y))
          }
        }.bind(this, x)
      }
    }
    function add(x, y) {
      return x + y
    }
    const curryAdd = curry(add)
    console.log(curryAdd(1)(2)(3)())

### 获取给定字符串的全排列

  function getFullStr(str) {
    const result = []
    if(str.length == 0) {
      return result
    }
    if(str.length === 1) {
      return result[str[0]]
    }
    for(let i = 0 ; i < str.length;i++) {
      const currChar = str[i]
      const restCharStr = str.substring(0,i) + str.substring(i + 1)
      const getRestFullStr = getFullStr(str).map(item => currChar + item)
      if(getRestFullStr.length === 0) {
        getRestFullStr.push(currChar)
      }
      result = result.concat(getRestFullStr)
    }
    return result
  }

## 顺时针打印矩阵

    var spiralOrder = function(matrix) {
      if (matrix === undefined || matrix.length === 0) return [];
      let res = [];
      let left = 0, right = matrix[0].length-1, up = 0, down = matrix.length-1;
      while (true) {
          for (let i = left;i <= right;i++) {
              res.push(matrix[up][i]);
          }
          if (++up > down) break;
          for (let i = up;i <= down;i++) {
              res.push(matrix[i][right]);
          }
          if (--right < left) break;
          for (let i = right;i >= left;i--) {
              res.push(matrix[down][i]);
          }
          if (--down < up) break;
          for (let i = down;i >= up;i--) {
              res.push(matrix[i][left]);
          }
          if (++left > right) break;
      }
      return res;
    };

## 动态规划

### 爬楼梯问题
有n阶楼梯，每次可以爬一阶或者2阶，求有多少中爬法

我们使用动态规划求解问题时，需要遵循以下几个重要步骤：
* 定义子问题
* 实现需要反复执行解决的子子问题部分
* 识别并求解出边界条件

    // 爬楼梯问题 每次可以爬一步或者两步  在爬n阶台阶的时候有多少种方案
    function climpStairs(n) {
      const dp = [1,1]
      for(let i = 2; i <= n;i++) {
        dp[i] = dp[i-1] + dp[i-2]
      }
      return dp[n]
    }

    // 求数组的最大子序和(买入股票的最佳时机 是一样的问题)
    // 最大子序和 = Math.max(第i个数，前i-1的最大子序和)
    function getSum(nums) {
      let max = nums[0],pre = 0
      for(const num of nums) {
        if(num > 0 ) {
          pre += num 
        } else {
          pre = num
        }
        max = Math.max(max, pre)
      }
      return max
    }
    // 买入股票的最佳时机
    [3,4,5,6,7,2,8] => 6 2买入 8卖出
    function bestTime(nums) {
      let max = 0
      let acc = 0
      for(let i = 1; i< nums.length;i++) {
        acc += nums[i] - nums[i-1]
        if(acc < 0) {
          acc = 0
        }
        if(acc > max) {
          max = acc
        }
      }
      return max
    }


## 扑克洗牌

    int randInt(int min, int max);

    // 第一种写法
    void shuffle(int[] arr) {
        int n = arr.length();
        /******** 区别只有这两行 ********/
        for (int i = 0 ; i < n; i++) {
            // 从 i 到最后随机选一个元素
            int rand = randInt(i, n - 1);
            /*************************/
            swap(arr[i], arr[rand]);
        }
    }

## 数组的最长上升子序列

  public int lengthOfLIS(int[] nums) {
    int[] dp = new int[nums.length];
    // base case：dp 数组全都初始化为 1
    Arrays.fill(dp, 1);
    for (int i = 0; i < nums.length; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[i] > nums[j]) 
                dp[i] = Math.max(dp[i], dp[j] + 1);
        }
    }
    
    int res = 0;
    for (int i = 0; i < dp.length; i++) {
        res = Math.max(res, dp[i]);
    }
    return res;
  }

## 实现将list转换成tree结构

    const oldData = [
    
      {id:1,name:'boss',parentId:0},
    
      {id:2,name:'lily',parentId:1},
    
      {id:3,name:'jack',parentId:1},
    
      {id:4,name:'john',parentId:2},
    
      {id:5,name:'boss2',parentId:0},
    ]

  function listToTree(oldArr){
    oldArr.forEach(element => {
        let parentId = element.parentId;
        if(parentId !== 0){
            oldArr.forEach(ele => {
                if(ele.id == parentId){ //当内层循环的ID== 外层循环的parendId时，（说明有children），需要往该内层id里建个children并push对应的数组；
                    if(!ele.children){
                        ele.children = [];
                    }
                    ele.children.push(element);
                }
            });
        }
    });
    console.log(oldArr)  //此时的数组是在原基础上补充了children;
    oldArr = oldArr.filter(ele => ele.parentId === 0); //这一步是过滤，按树展开，将多余的数组剔除；
    console.log(oldArr)
    return oldArr;
    }

## 相关资料
https://www.cnblogs.com/chengxiao/p/6129630.html