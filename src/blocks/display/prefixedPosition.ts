import Blockly from "blockly";

const modelTypes = [
  {
    id: "{ x: 50, y: 50 }", title: "top left"
  },
  {
    id: "{ x: 256, y: 50 }", title: "top center"
  },
  {
    id: "{ x: 512 - 50, y: 50 }", title: "top right"
  },
  {
    id: "{ x: 50, y: 256 }", title: "center left"
  },
  {
    id: "{ x: 256, y: 256 }", title: "center"
  },
  {
    id: "{ x: 512 - 50, y: 256 }", title: "center right"
  },
  {
    id: "{ x: 50, y: 512 - 50 }", title: "bottom left"
  },
  {
    id: "{ x: 256, y: 512 - 50 }", title: "bottom center"
  },
  {
    id: "{ x: 512 - 50, y: 512 - 50 }", title: "bottom right"
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
    this.setOutput(true, "Position");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour("%{BKY_POSITION_HUE}");
  },

  transpile: function (block, generator) {
    let position = `(${block.getFieldValue("POSITION")})`;
    return [position, generator.ORDER_NONE];
  },
};