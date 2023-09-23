export let convertToGray = {
  init: function () {
      this.appendValueInput("OBJECT")
          .appendField("convert");
      this.appendDummyInput()
          .appendField("to gray")
      this.setInputsInline(true);
      this.setOutput(true, "MATRIX");
      this.setPreviousStatement(false, null);
      this.setNextStatement(false, null);
      this.setColour(250);
  },

  transpile: function (block, generator) {
      let object = generator.valueToCode(block, 'OBJECT', generator.ORDER_NONE);
      if (object === "") return "";

      return [`cv.convertMatToGray(${object})`, generator.ORDER_NONE];
  }
};