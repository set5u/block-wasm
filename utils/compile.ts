import CWorker from "./compileW?worker";

export const compile = (src: string) => {
  return new Promise<string | ArrayBuffer>((resolve) => {
    const ci = new CWorker();
    ci.addEventListener("message", ({ data }) => {
      if (data === 0) {
        ci.postMessage(src);
        return;
      }
      ci.terminate();
      resolve(data as string | ArrayBuffer);
    });
  });
};
