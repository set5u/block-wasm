import asc from "assemblyscript/asc";
addEventListener("message", ({ data }) => {
  asc.compileString(data).then((v) => {
    if (v.error) {
      postMessage(v.error.toString());
    } else {
      postMessage(v.binary, [v.binary!.buffer]);
    }
  });
});
postMessage(0);
