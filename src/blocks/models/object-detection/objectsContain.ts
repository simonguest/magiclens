import labels from "./labels"
import Blockly from "blockly";

export let objectsContain = {
  init: function () {
    this.appendValueInput("OBJECTS")
      .setCheck("Objects")
      .appendField("objects");
    this.appendDummyInput()
      .appendField("contain")
      .appendField(
        new Blockly.FieldDropdown(labels.sort().map(l => [l, l])),
        "LABEL"
      )
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour("%{BKY_LOGIC_HUE}");
  },

  transpile: function (block, generator) {
    let objects = generator.valueToCode(block, 'OBJECTS', generator.ORDER_NONE);
    let label = block.getFieldValue("LABEL");

    if (objects === "") return "";
    if (label === "") return "";

    return [`cv.objectsContain(${objects}, "${label}")`, generator.ORDER_NONE];
  }
};