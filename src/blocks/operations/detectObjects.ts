export let detectObjects = {
    init: function () {
        this.appendValueInput("OBJECT")
            .appendField("detect objects in ");
        this.appendValueInput("MODEL")
            .setCheck("MODEL")
            .appendField("using model");
        this.setInputsInline(false);
        this.setOutput(true, "OBJECTS");
        this.setPreviousStatement(false, null);
        this.setNextStatement(false, null);
        this.setColour(250);
    },

    transpile: function (block, generator) {
        let object = generator.valueToCode(block, 'OBJECT', generator.ORDER_NONE);
        let model = generator.valueToCode(block, 'MODEL', generator.ORDER_NONE);

        if (object === "") return "";
        if (model === "") return "";

        return [`await cv.detectObjects(${object}, ${model})`, generator.ORDER_NONE];
    }
};