export const bisectLeft = (target: number, arr: number[]) => {
  let low = 0;
  let high = arr.length - 1;
  while (low < high) {
    const mid = low + Math.floor((high - low) / 2);
    if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return low;
};
