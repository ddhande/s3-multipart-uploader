export const pLimit = (concurrency: number) => {
    type Task = {
      fn: () => Promise<any>;
      resolve: (value?: any) => void;
      reject: (reason?: any) => void;
    };
  
    const tasks: Task[] = [];
    let active = 0;
  
    const runNext = () => {
      if (tasks.length === 0 || active >= concurrency) return;
  
      active++;
      const { fn, resolve, reject } = tasks.shift()!;
      fn()
        .then(resolve)
        .catch(reject)
        .finally(() => {
          active--;
          runNext();
        });
    };
  
    return (fn: () => Promise<any>) =>
      new Promise((resolve, reject) => {
        tasks.push({ fn, resolve, reject });
        runNext();
      });
  };
  