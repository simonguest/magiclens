export let rotateRight = {
  init: function () {
    this.appendValueInput("IMAGE")
      .setCheck("Image")
      .appendField("rotate image");
    this.appendDummyInput()
      .appendField("right 90 degrees")
    this.setInputsInline(true);
    this.setOutput(true, "Image");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour("%{BKY_FILTERS_HUE}");
  },

  transpile: function (block, generator) {
    let image = generator.valueToCode(block, 'IMAGE', generator.ORDER_NONE);
    if (image === "") return "";

    return [`cv.rotateRight(${image})`, generator.ORDER_NONE];
  }
};