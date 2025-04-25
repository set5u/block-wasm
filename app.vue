<template>
  <Title>Block Wasm</Title>
  <div>
    <div>Compiler status: {{ status }}</div>
    <textarea
      v-model="src"
      style="width: 100%; height: 25vh"
      disabled
    ></textarea>
    <div ref="blocks" style="width: 100%; height: 50vh"></div>
    <button @click="run">RUN</button>
    <div>Output:</div>
    <div v-for="o in output">{{ o }}</div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, reactive, ref } from "vue";
  import { compile } from "~/utils/compile";
  import { instantiate } from "~/utils/ins";
  import * as Blockly from "blockly";

  import "~/utils/bInit";
  import { types } from "~/utils/bInit";
  Blockly.utils.colour.setHsvSaturation(0.6);
  Blockly.utils.colour.setHsvValue(0.7);
  const blocks = ref<HTMLDivElement>();
  const src = ref(`export function main(): void {
        print("HelloWorld")
    }
    `);
  const output: string[] = reactive([]);
  const status = ref("Awaiting...");
  const run = async () => {
    output.length = 0;
    status.value = "Compiling...";
    const bin = await compile(
      '@external("./print.ts", "print")\ndeclare function print(s: string): void;' +
        src.value
    );
    if (typeof bin === "string") {
      status.value = bin;
      return;
    }
    status.value = "Running...";
    const { main } = await instantiate(await WebAssembly.compile(bin), {
      "./print.ts": {
        print(v: string) {
          output.push(v);
        },
      },
    });
    main();
    status.value = "Done";
  };
  onMounted(() => {
    if (!blocks.value) {
      return;
    }
    const workspace = Blockly.inject(blocks.value, {
      // renderer: "zelos",
      toolbox: {
        kind: "categoryToolbox",
        contents: [
          {
            kind: "category",
            name: "system",
            contents: [
              {
                kind: "block",
                type: "print",
                inputs: {
                  VALUE: { shadow: { type: "string" } },
                },
              },
            ],
          },
          ...["i32", "i64", "f32", "f64"].map((v, i) => ({
            kind: "category",
            name: v,
            colour: `${i * 30}`,
            contents: [
              {
                kind: "button",
                text: `Create variable of ${v}`,
                callbackKey: `createVal${v}`,
              },
              { kind: "block", type: `get${v}` },
              {
                kind: "block",
                type: `set${v}`,
                inputs: {
                  VALUE: { shadow: { type: v } },
                },
              },
              { kind: "block", type: v },
              ...["+", "-", "*", "/", "^", "%"].map((m) => ({
                kind: "block",
                type: `2${v}`,
                fields: { OP: m },
                inputs: {
                  A: { shadow: { type: v } },
                  B: { shadow: { type: v } },
                },
              })),
            ],
          })),
          {
            kind: "category",
            name: "string",
            colour: "150",
            contents: [
              {
                kind: "button",
                text: `Create variable of string`,
                callbackKey: `createValstring`,
              },
              { kind: "block", type: `getstring` },
              {
                kind: "block",
                type: `setstring`,
                inputs: {
                  VALUE: { shadow: { type: "string" } },
                },
              },
              { kind: "block", type: "string" },
            ],
          },
          {
            kind: "category",
            name: "type",
            colour: "180",
            contents: types.map((v) => ({
              kind: "block",
              type: "type",
              fields: { VALUE: v },
            })),
          },
        ],
      },
    });
    types.forEach((v) =>
      workspace.registerButtonCallback(`createVal${v}`, (button) => {
        Blockly.Variables.createVariableButtonHandler(
          button.getTargetWorkspace(),
          () => {},
          v
        );
      })
    );
    onUnmounted(() => {
      workspace.dispose();
    });
  });
</script>
