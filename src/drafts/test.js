const { func } = require("prop-types");

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


