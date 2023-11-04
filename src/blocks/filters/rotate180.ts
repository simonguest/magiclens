export let rotate180 = {
  init: function () {
    this.appendValueInput("IMAGE")
      .setCheck("Image")
      .appendField("rotate image");
    this.appendDummyInput()
      .appendField("180 degrees")
    this.setInputsInline(true);
    this.setOutput(true, "Image");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour("%{BKY_FILTERS_HUE}");
  },

  transpile: function (block, generator) {
    let image = generator.valueToCode(block, 'IMAGE', generator.ORDER_NONE);
    if (image === "") return "";

    return [`cv.rotate180(${image})`, generator.ORDER_NONE];
  }
};