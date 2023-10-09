import { main } from "../src/services/hello";

const proccess = async () => {
  const result = await main({} as any, {} as any);
  console.log(result);
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};

proccess();
