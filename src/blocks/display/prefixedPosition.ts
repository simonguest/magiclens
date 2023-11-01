import Blockly from "blockly";

const modelTypes = [
  {
    id: "{ x: 100, y: 100 }", title: "top left"
  },
  {
    id: "{ x: 512, y: 100 }", title: "top center"
  },
  {
    id: "{ x: 100, y: 1024 - 100 }", title: "bottom left"
  }
  ]

export let prefixedPosition = {
  init: function () {
    this.appendDummyInput()
      .appendField("position")
      .appendField(
        new Blockly.FieldDropdown(modelTypes.map(l => [l.title, l.id])),
        "POSITION"
      )
    this.setInputsInline(true);
    this.setOutput(true, "POSITION");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour(100);
  },

  transpile: function (block, generator) {
    let model = `(${block.getFieldValue("POSITION")})`;
    return [model, generator.ORDER_NONE];
  },
};