export const rotateLeft = {
  init: function () {
    this.appendValueInput("IMAGE")
      .setCheck("Image")
      .appendField("rotate image");
    this.appendDummyInput()
      .appendField("left 90 degrees")
    this.setInputsInline(true);
    this.setOutput(true, "Image");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour("%{BKY_FILTERS_HUE}");
  },

  transpile: function (block, generator) {
    const image = generator.valueToCode(block, 'IMAGE', generator.ORDER_NONE);
    if (image === "") return "";

    return [`cv.rotateLeft(${image})`, generator.ORDER_NONE];
  }
};