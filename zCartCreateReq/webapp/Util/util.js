sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function (JSONModel) {
	"use strict";

	return {

		reviewReqSoldtoEditModel: function (edit) {
			var editableModeJson = {
				editable: edit
			};
			return new JSONModel(editableModeJson);
			// this.getOwnerComponent().setModel(jsonEditMode,"ReviewRequsitionEditModel");
		},
		reviewReqFinalDestEditModel: function (edit) {
			var editableModeJson = {
				editable: edit
			};
			return new JSONModel(editableModeJson);
			// this.getOwnerComponent().setModel(jsonEditMode,"ReviewRequsitionEditModel");
		},
		materialsButtonEditModel: function (edit) {
			var editableModeMaterialsJson = {
				visible: edit
			};
			return new JSONModel(editableModeMaterialsJson);
		}
	
		

	};
});