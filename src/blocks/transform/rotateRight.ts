export let rotateRight = {
  init: function () {
      this.appendValueInput("OBJECT")
          .appendField("rotate");
      this.appendDummyInput()
          .appendField("right 90 degrees")
      this.setInputsInline(true);
      this.setOutput(true, "MATRIX");
      this.setPreviousStatement(false, null);
      this.setNextStatement(false, null);
      this.setColour(250);
  },

  transpile: function (block, generator) {
      let object = generator.valueToCode(block, 'OBJECT', generator.ORDER_NONE);
      if (object === "") return "";

      return [`cv.rotateRight(${object})`, generator.ORDER_NONE];
  }
};