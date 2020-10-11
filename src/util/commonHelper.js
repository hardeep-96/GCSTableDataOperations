export const debounce = (fn, delay) => {
    let timeOutID;
    return function (...args) {
      if (timeOutID) clearTimeout(timeOutID);
      timeOutID = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };