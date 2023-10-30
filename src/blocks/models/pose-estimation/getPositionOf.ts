import Blockly from "blockly";

const bodyParts = [
  { id: "0", title: "nose" },
  { id: "1", title: "left eye (inner)" },
  { id: "2", title: "left eye" },
  { id: "3", title: "left eye (outer)" },
  { id: "4", title: "right eye (inner)" },
  { id: "5", title: "right eye" },
  { id: "6", title: "right eye (outer)" },
  { id: "7", title: "left ear" },
  { id: "8", title: "right ear" },
  { id: "9", title: "mouth (left)" },
  { id: "10", title: "mouth (right)" },
  { id: "11", title: "left shoulder" },
  { id: "12", title: "right shoulder" },
  { id: "13", title: "left elbow" },
  { id: "14", title: "right elbow" },
  { id: "15", title: "left wrist" },
  { id: "16", title: "right wrist" },
  { id: "17", title: "left pinky" },
  { id: "18", title: "right pinky" },
  { id: "19", title: "left index" },
  { id: "20", title: "right index" },
  { id: "21", title: "left thumb" },
  { id: "22", title: "right thumb" },
  { id: "23", title: "left hip" },
  { id: "24", title: "right hip" },
  { id: "25", title: "left knee" },
  { id: "26", title: "right knee" },
  { id: "27", title: "left ankle" },
  { id: "28", title: "right ankle" },
  { id: "29", title: "left heel" },
  { id: "30", title: "right heel" },
  { id: "31", title: "left foot index" },
  { id: "32", title: "right foot index" }
]
export let getPositionOf = {
  init: function () {
    this.appendDummyInput()
      .appendField("get position of ")
      .appendField(
        new Blockly.FieldDropdown(bodyParts.map(l => [l.title.toString(), l.id])),
        "BODY_PART"
      )
    this.appendValueInput("POSE")
      .appendField("in pose")
    this.setInputsInline(true);
    this.setOutput(true, "POSITION");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour(250);
  },

  transpile: function (block, generator) {
    let pose = generator.valueToCode(block, 'POSE', generator.ORDER_NONE);
    if (pose === "") return "";

    return [`cv.getPositionOf(${block.getFieldValue("BODY_PART")}, ${pose})`, generator.ORDER_NONE];
  },
};