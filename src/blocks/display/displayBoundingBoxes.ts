export let displayBoundingBoxes = {
  init: function () {
      this.appendValueInput("OBJECT")
          .appendField("display bounding boxes");
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(250);
  },

  transpile: function (block, generator) {
      let object = generator.valueToCode(block, 'OBJECT', generator.ORDER_NONE);
      if (object === "") return "";

      return `await cv.displayBoundingBoxes(${object});`;
  }
};