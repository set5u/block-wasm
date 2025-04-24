import * as Blockly from "blockly";

const val = (v: string, i: number) => [
  {
    type: `get${v}`,
    message0: "%1",
    args0: [
      {
        type: "field_variable",
        name: "VAR",
        variable: "%{BKY_VARIABLES_DEFAULT_NAME}",
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
        variable: "%{BKY_VARIABLES_DEFAULT_NAME}",
        variableTypes: [v],
        defaultType: v,
      },
      { type: "input_value", name: "VALUE", check: v },
    ],
    colour: `${i * 30}`,
    output: v,
    inputsInline: true,
    nextStatement: null,
    previousStatement: null,
  },
];
Blockly.common.defineBlocksWithJsonArray([
  {
    type: "print",
    message0: "print %1",
    args0: [{ type: "input_value", name: "VALUE", value: "" }],
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
            ],
          },
        ],
        colour: `${i * 30}`,
        output: v,
      },
    ])
    .flat(2),
]);
