export let detectObjects = {
  init: function () {
      this.appendValueInput("OBJECT")
          .appendField("detect objects in ");
      this.setInputsInline(true);
      this.setOutput(true, "OBJECTS");
      this.setPreviousStatement(false, null);
      this.setNextStatement(false, null);
      this.setColour(250);
  },

  transpile: function (block, generator) {
      let object = generator.valueToCode(block, 'OBJECT', generator.ORDER_NONE);
      if (object === "") return "";

      return [`await cv.detectObjects(${object})`, generator.ORDER_NONE];
  }
};