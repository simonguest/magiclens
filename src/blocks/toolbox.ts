export let toolbox = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Webcam",
      contents: [
        {
          kind: "block",
          type: "start_webcam",
        },
        {
          kind: "block",
          type: "stop_webcam",
        },
        {
          kind: "block",
          type: "capture_webcam_image",
        },
      ],
    },
    {
      kind: "category",
      name: "Sample Images",
      contents: [
        {
          kind: "block",
          type: "input_load_sample_image",
        }
      ],
    },
    {
      kind: "category",
      name: "Transform",
      contents: [
        {
          kind: "block",
          type: "convert_to_gray"
        },
        {
          kind: "block",
          type: "rotate_right"
        }
      ]
    },
    {
      kind: "category",
      name: "Models",
      contents: [
        {
          kind: "block",
          type: "detect_objects"
        }
      ]
    },
    {
      kind: "category",
      name: "Output",
      contents: [
        {
          kind: "block",
          type: "display",
        },
        {
          kind: "block",
          type: "display_bounding_boxes",
        },
        {
          kind: "block",
          type: "display_segmentation",
        }
      ],
    },
    {
      kind: "category",
      name: "Loops",
      contents: [
        {
          kind: "block",
          type: "controls_repeat_ext",
          inputs: {
            TIMES: {
              block: {
                type: "math_number",
                fields: {
                  NUM: 1,
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "controls_for",
          inputs: {
            FROM: {
              block: {
                type: "math_number",
                fields: {
                  NUM: 1,
                },
              },
            },
            TO: {
              block: {
                type: "math_number",
                fields: {
                  NUM: 10,
                },
              },
            },
            BY: {
              block: {
                type: "math_number",
                fields: {
                  NUM: 1,
                },
              },
            },
          },
        },
      ],
    },
    {
      kind: "category",
      name: "Logic",
      contents: [
        {
          kind: "block",
          type: "logic_compare",
        },
        {
          kind: "block",
          type: "controls_if",
        },
      ],
    },
    {
      kind: "category",
      name: "Math",
      contents: [
        {
          kind: "block",
          type: "math_number",
        },
        {
          kind: "block",
          type: "math_arithmetic",
          inputs: {
            A: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 1,
                },
              },
            },
            B: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 1,
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "math_modulo",
          inputs: {
            DIVIDEND: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 100,
                },
              },
            },
            DIVISOR: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 5,
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "math_random_int",
          inputs: {
            FROM: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 1,
                },
              },
            },
            TO: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 100,
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "math_single",
          inputs: {
            NUM: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 9,
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "math_trig",
          inputs: {
            NUM: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 45,
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "math_constant",
        },
        {
          kind: "block",
          type: "math_number_property",
          inputs: {
            NUMBER_TO_CHECK: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 10,
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "math_round",
          inputs: {
            NUM: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 1.3,
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "math_constrain",
          inputs: {
            VALUE: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 50,
                },
              },
            },
            LOW: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 5,
                },
              },
            },
            HIGH: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 100,
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "debug",
        },
      ],
    },
    {
      kind: "category",
      name: "Variables",
      custom: "VARIABLE",
    },
    {
      kind: "category",
      name: "Functions",
      custom: "PROCEDURE",
    },
  ],
};
