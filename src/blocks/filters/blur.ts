export let blur = {
  init: function () {
    this.appendValueInput("IMAGE")
      .setCheck("Image")
      .appendField("blur image");
    this.setInputsInline(true);
    this.setOutput(true, "Image");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour("%{BKY_FILTERS_HUE}");
  },

  transpile: function (block, generator) {
    let image = generator.valueToCode(block, 'IMAGE', generator.ORDER_NONE);
    if (image === "") return "";

    return [`cv.blur(${image}, 20)`, generator.ORDER_NONE];
  }
};