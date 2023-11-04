import Blockly from "blockly";

export let startWebcam = {
  getDevices: function () {
    if (window["devices"]) {
      return window["devices"].map((device) => {
        return [device.label.replace(/\s*\([0-9A-Fa-f]+:[0-9A-Fa-f]+\)\s*$/, ''), device.deviceId];
      });
    } else {
      return [["No webcam detected", "no-webcam"]];
    }
  },

  init: function () {
    this.appendDummyInput()
      .appendField("start webcam")
      .appendField(new Blockly.FieldDropdown(this.getDevices()), "DEVICE")
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("%{BKY_CAPTURE_HUE}");
  },

  transpile: function (block) {
    let device = block.getFieldValue("DEVICE");
    return `await cv.startWebcam("${device}");`;
  },
};