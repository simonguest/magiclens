export let convertToGray = {
  init: function () {
      this.appendValueInput("IMAGE")
          .setCheck("Image")
          .appendField("convert image");
      this.appendDummyInput()
          .appendField("to gray")
      this.setInputsInline(true);
      this.setOutput(true, "IMAGE");
      this.setPreviousStatement(false, null);
      this.setNextStatement(false, null);
    this.setColour("%{BKY_FILTERS_HUE}");
  },

  transpile: function (block, generator) {
      let image = generator.valueToCode(block, 'IMAGE', generator.ORDER_NONE);
      if (image === "") return "";

      return [`cv.convertToGray(${image})`, generator.ORDER_NONE];
  }
};