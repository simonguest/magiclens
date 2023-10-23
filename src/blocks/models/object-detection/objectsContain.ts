import labels from "./labels"
import Blockly from "blockly";

export let objectsContain = {
  init: function () {
    this.appendValueInput("OBJECT")
      .appendField("objects");
    this.appendDummyInput()
      .appendField("contain")
      .appendField(
        new Blockly.FieldDropdown(labels.map(l => [l, l])),
        "LABEL"
      )
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour(250);
  },

  transpile: function (block, generator) {
    let object = generator.valueToCode(block, 'OBJECT', generator.ORDER_NONE);
    let label = block.getFieldValue("LABEL");

    if (object === "") return "";
    if (label === "") return "";

    return [`cv.objectsContain(${object}, "${label}")`, generator.ORDER_NONE];
  }
};