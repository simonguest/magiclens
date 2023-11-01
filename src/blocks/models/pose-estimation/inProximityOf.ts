import Blockly from "blockly";

export let inProximityOf = {
  init: function () {
    this.appendValueInput("BODY_PART")
      .setCheck("POSITION")
      .appendField("if ")
    this.appendValueInput("LOCATION")
      .setCheck("POSITION")
      .appendField("is within")
      .appendField(new Blockly.FieldNumber(50, 0, 1024), "DISTANCE")
      .appendField("pixels of")
    this.setInputsInline(true);
    this.setOutput(true, "Boolean");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour(250);
  },

  transpile: function (block, generator) {
    let bodyPart = generator.valueToCode(block, 'BODY_PART', generator.ORDER_NONE);
    if (bodyPart === "") return "";
    let location = generator.valueToCode(block, 'LOCATION', generator.ORDER_NONE);
    if (location === "") return "";

    return [`cv.inProximityOf(${bodyPart}, ${location}, ${block.getFieldValue('DISTANCE')})`, generator.ORDER_NONE];
  },
};