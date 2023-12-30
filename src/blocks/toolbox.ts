// Should be typed to ToolboxInfo, but bug in blockly ts definitions doesn't handle custom fields.
import { ToolboxInfo } from "blockly/core/utils/toolbox";

export const toolbox: ToolboxInfo = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Image Capture",
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
          type: "webcam_image",
        },
        {
          kind: "block",
          type: "sample_image",
        },
        {
          kind: "block",
          type: "background",
        }
      ],
    },
    {
      kind: "category",
      name: "Filters",
      contents: [
        {
          kind: "block",
          type: "convert_to_grayscale"
        },
        {
          kind: "block",
          type: "rotate_right"
        },
        {
          kind: "block",
          type: "rotate_left"
        },
        {
          kind: "block",
          type: "rotate_180"
        },
        {
          kind: "block",
          type: "flip_horizontal"
        },
        {
          kind: "block",
          type: "flip_vertical"
        },
        {
          kind: "block",
          type: "invert"
        },
        {
          kind: "block",
          type: "blur"
        }
      ]
    },
    {
      kind: "category",
      name: "ML Models",
      expanded: true,
      contents: [
        {
          kind: "category",
          name: "Object Detection",
          contents: [
            {
              kind: "block",
              type: "detect_objects",
            },
            {
              kind: "block",
              type: "efficientdet_lite0"
            },
            {
              kind: "block",
              type: "efficientdet_lite2"
            },
            {
              kind: "block",
              type: "ssdmobilenet-v2"
            },
            {
              kind: "block",
              type: "draw_bounding_boxes"
            },
            {
              kind: "block",
              type: "objects_contain"
            }
          ]
        },
        {
          kind: "category",
          name: "Image Segmentation",
          contents: [
            {
              kind: "block",
              type: "segment",
            },
            {
              kind: "block",
              type: "selfiesegmenter"
            },
            {
              kind: "block",
              type: "selfiemulticlass"
            },
            {
              kind: "block",
              type: "hairsegmenter"
            },
            {
              kind: "block",
              type: "color_segment"
            },
            {
              kind: "block",
              type: "replace_segment_with_image"
            }
          ]
        },
        {
          kind: "category",
          name: "Pose Estimation",
          contents: [
            {
              kind: "block",
              type: "detect_pose",
            },
            {
              kind: "block",
              type: "poselandmarker_lite",
            },
            {
              kind: "block",
              type: "poselandmarker_full",
            },
            {
              kind: "block",
              type: "poselandmarker_heavy",
            },
            {
              kind: "block",
              type: "draw_pose",
            },
            {
              kind: "block",
              type: "get_position_of"
            },
            {
              kind: "block",
              type: "in_proximity_of"
            }
          ]
        }
      ]
    },
    {
      kind: "category",
      name: "Display",
      contents: [
        {
          kind: "block",
          type: "add_image_to_frame",
        },
        {
          kind: "block",
          type: "display_frame",
        },
        {
          kind: "block",
          type: "draw_text_at"
        },
        {
          kind: "block",
          type: "draw_emoji_at"
        },
        {
          kind: "block",
          type: "position",
          inputs: {
            X: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 512,
                },
              },
            },
            Y: {
              shadow: {
                type: "math_number",
                fields: {
                  NUM: 512,
                },
              },
            },
          },
        },
        {
          kind: "block",
          type: "prefixed_position",
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
        {
          kind: "block",
          type: "controls_whileUntil"
        }
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
        {
          kind: "block",
          type: "logic_operation",
        },
        {
          kind: "block",
          type: "logic_boolean",
        }
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
      ],
    },
    {
      kind: "category",
      name: "Text",
      contents: [
        {
          kind: "block",
          type: "text",
        },
        {
          kind: "block",
          type: "text_join",
        }
      ]
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
