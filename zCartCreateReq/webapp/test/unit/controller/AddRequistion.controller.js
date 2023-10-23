/*global QUnit*/

sap.ui.define([
	"CTL/zcartcreaterequistion/controller/AddRequistion.controller"
], function (Controller) {
	"use strict";

	QUnit.module("AddRequistion Controller");

	QUnit.test("I should test the AddRequistion controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});