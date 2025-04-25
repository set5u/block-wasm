import * as Blockly from "blockly";
export const types = ["i32", "i64", "f32", "f64", "string"];
const val = (v: string, i: number) => [
  {
    type: `get${v}`,
    message0: "%1",
    args0: [
      {
        type: "field_variable",
        name: "VAR",
        variable: "val",
        variableTypes: [v],
        defaultType: v,
      },
    ],
    colour: `${i * 30}`,
    output: v,
  },
  {
    type: `set${v}`,
    message0: "set %1 to %2",
    args0: [
      {
        type: "field_variable",
        name: "VAR",
        variable: "val",
        variableTypes: [v],
        defaultType: v,
      },
      { type: "input_value", name: "VALUE", check: v },
    ],
    colour: `${i * 30}`,
    output: v,
    nextStatement: null,
    previousStatement: null,
  },
];
Blockly.common.defineBlocksWithJsonArray([
  {
    type: "print",
    message0: "print %1",
    args0: [{ type: "input_value", name: "VALUE", check: "string" }],
    nextStatement: null,
    previousStatement: null,
  },
  {
    type: "string",
    message0: "%1",
    args0: [{ type: "field_input", name: "VALUE", value: "" }],
    colour: "150",
    output: "string",
  },
  ...val("string", 5),
  {
    type: "type",
    message0: "%1",
    args0: [
      {
        type: "field_dropdown",
        name: "VALUE",
        options: [
          ["i32", "i32"],
          ["i64", "i64"],
          ["f32", "f32"],
          ["f64", "f64"],
          ["string", "string"],
        ],
      },
    ],
    colour: "180",
    output: "type",
  },
  ...["i32", "i64", "f32", "f64"]
    .map((v, i) => [
      {
        type: v,
        message0: "%1",
        args0: [
          {
            type: "field_number",
            name: "VALUE",
            value: 0,
            precision: v.startsWith("i") ? 1 : 0,
          },
        ],
        colour: `${i * 30}`,
        output: v,
      },
      ...val(v, i),
      {
        type: `2${v}`,
        inputsInline: true,
        message0: `%1 %3 %2`,
        args0: [
          {
            type: "input_value",
            name: "A",
            check: v,
          },
          {
            type: "input_value",
            name: "B",
            check: v,
          },
          {
            type: "field_dropdown",
            name: "OP",
            options: [
              ["+", "+"],
              ["-", "-"],
              ["*", "*"],
              ["/", "/"],
              ["^", "^"],
              ["%", "%"],
            ],
          },
        ],
        colour: `${i * 30}`,
        output: v,
      },
    ])
    .flat(2),
]);
