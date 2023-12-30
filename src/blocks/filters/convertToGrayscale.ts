export const convertToGrayscale = {
  init: function () {
      this.appendValueInput("IMAGE")
          .setCheck("Image")
          .appendField("convert image");
      this.appendDummyInput()
          .appendField("to grayscale")
      this.setInputsInline(true);
      this.setOutput(true, "Image");
      this.setPreviousStatement(false, null);
      this.setNextStatement(false, null);
    this.setColour("%{BKY_FILTERS_HUE}");
  },

  transpile: function (block, generator) {
      const image = generator.valueToCode(block, 'IMAGE', generator.ORDER_NONE);
      if (image === "") return "";

      return [`cv.convertToGrayscale(${image})`, generator.ORDER_NONE];
  }
};