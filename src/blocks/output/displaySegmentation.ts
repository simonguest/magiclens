export let displaySegmentation = {
  init: function () {
      this.appendValueInput("OBJECT")
          .appendField("display segmentation");
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(250);
  },

  transpile: function (block, generator) {
      let object = generator.valueToCode(block, 'OBJECT', generator.ORDER_NONE);
      if (object === "") return "";

      return `cv.displaySegmentation(${object});`;
  }
};