/*global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/thirdparty/sinon-4",
	"sap/ui/fl/write/_internal/fieldExtensibility/cap/dialog/CustomFieldCAPDialog",
	"sap/m/MessageToast"
], function(
	jQuery,
	sinon,
	CustomFieldCAPDialog,
	MessageToast
) {
	"use strict";
	var sandbox = sinon.createSandbox();
	var oSampleEntityTypeInfo = {
		boundEntitySet: {
			$Type: "SampleType"
		},
		entityTypes: [
			"SampleType", "SomeOtherType"
		]
	};
	var oDefaultDefinition = {
		element: {
			name: "NewField",
			type: "cds.String"
		},
		extend: "SampleType"
	};

	function waitForDialog(oCAPDialog) {
		return new Promise(function(resolve) {
			sandbox.stub(oCAPDialog, "setProperty")
				.callThrough()
				.withArgs("_dialog")
				.callsFake(function(sPropertyName, oDialog) {
					oCAPDialog.setProperty.wrappedMethod.apply(this, arguments);
					oDialog.attachEventOnce("afterOpen", function () {
						resolve(oDialog);
					});
				});
		});
	}

	QUnit.module("Custom field dialog", {
		beforeEach: function() {
			this.oCAPDialog = new CustomFieldCAPDialog();
		},
		afterEach: function() {
			this.oCAPDialog.destroy();
			sandbox.restore();
		}
	}, function() {
		QUnit.test("when the dialog is opened", function(assert) {
			var oDialogPromise = waitForDialog(this.oCAPDialog)
				.then(function() {
					var oEditor = this.oCAPDialog._oEditor;
					return oEditor.ready()
						.then(function() {
							assert.ok(oEditor.isReady(), "then the editor is initialized");
							assert.deepEqual(
								oEditor.getJson(),
								oDefaultDefinition,
								"then the default definition is loaded"
							);
						});
				}.bind(this));
			this.oCAPDialog.open(oSampleEntityTypeInfo);
			return oDialogPromise;
		});

		QUnit.test("when the dialog is opened twice", function(assert) {
			var oDialogPromise = waitForDialog(this.oCAPDialog)
				.then(function() {
					var oEditor = this.oCAPDialog._oEditor;
					return oEditor.ready()
						.then(function() {
							oEditor.setJson({
								element: {
									name: "TestField",
									type: "cds.String"
								},
								extend: "SampleType"
							});
							this.oCAPDialog.onCancel();
							this.oCAPDialog.open(oSampleEntityTypeInfo);
							assert.deepEqual(oEditor.getJson(),
								oDefaultDefinition,
								"then the editor data is reset"
							);
						}.bind(this));
				}.bind(this));
			this.oCAPDialog.open(oSampleEntityTypeInfo);
			return oDialogPromise;
		});
	});

	function findAddFieldRequest(aRequests) {
		return aRequests.find(function(oRequest) {
			return oRequest.url.endsWith("/addExtension");
		});
	}

	QUnit.module("Custom field creation", {
		beforeEach: function() {
			this.oCAPDialog = new CustomFieldCAPDialog();
			var oDialogPromise = waitForDialog(this.oCAPDialog);
			this.oCAPDialog.open(oSampleEntityTypeInfo);
			this.aRequests = [];
			var oFakeXHR = sandbox.useFakeXMLHttpRequest();
			oFakeXHR.useFilters = true;
			oFakeXHR.addFilter(function(sMethod, sUrl) {
				return !sUrl.endsWith("/addExtension");
			});
			oFakeXHR.onCreate = function(xhr) {
				this.aRequests.push(xhr);
			}.bind(this);

			return oDialogPromise.then(function() {
				return this.oCAPDialog._oEditor.ready();
			}.bind(this));
		},
		afterEach: function() {
			this.oCAPDialog.destroy();
			sandbox.restore();
		}
	}, function() {
		QUnit.test("when a field is created", function(assert) {
			var fnDone = assert.async();
			sandbox.stub(MessageToast, "show").callsFake(function() {
				assert.ok(true, "then a success message is displayed");
				fnDone();
			});
			this.oCAPDialog._oEditor.setJson({
				element: {
					name: "TestField",
					type: "cds.String"
				},
				extend: "SampleType"
			});
			this.oCAPDialog.onSave();

			var oAddFieldRequest = findAddFieldRequest(this.aRequests);
			assert.ok(
				oAddFieldRequest.url.endsWith("/extensibility/addExtension"),
				"then the addField endpoint is called"
			);
			var oResponse = JSON.parse(oAddFieldRequest.requestBody);
			assert.strictEqual(
				oResponse.extensions.length,
				1,
				"then the csn for one extension is created"
			);
			assert.deepEqual(
				JSON.parse(oResponse.extensions[0]),
				{
					elements: {
						TestField: {
							name: "TestField",
							type: "cds.String"
						}
					},
					extend: "SampleType"
				},
				"then the proper csn payload is passed"
			);
			oAddFieldRequest.respond(200);
		});

		QUnit.test("when the field creation is canceled", function(assert) {
			this.oCAPDialog._oEditor.setJson({
				element: {
					name: "TestField",
					type: "cds.String"
				},
				extend: "SampleType"
			});
			this.oCAPDialog.onCancel();

			assert.strictEqual(
				findAddFieldRequest(this.aRequests),
				undefined,
				"then the create request is not sent"
			);
		});

		QUnit.test("when a field is created with a custom annotation", function(assert) {
			this.oCAPDialog._oEditor.setJson({
				element: {
					name: "TestField",
					type: "cds.Integer",
					"@assert.range": [0, 1],
					annotations: {
						"@custom.annotation": 123
					}
				},
				extend: "SampleType"
			});
			this.oCAPDialog.onSave();

			var oResponse = JSON.parse(findAddFieldRequest(this.aRequests).requestBody);
			assert.deepEqual(
				JSON.parse(oResponse.extensions[0]),
				{
					elements: {
						TestField: {
							name: "TestField",
							type: "cds.Integer",
							"@assert.range": [0, 1],
							"@custom.annotation": 123
						}
					},
					extend: "SampleType"
				},
				"then the custom annotation is added to the payload"
			);
		});

		QUnit.test("when a string field with a range assertion is created", function(assert) {
			this.oCAPDialog._oEditor.setJson({
				element: {
					name: "TestField",
					type: "cds.String",
					"@assert.range": ["a", "b", "c"]
				},
				extend: "SampleType"
			});
			this.oCAPDialog.onSave();

			var oResponse = JSON.parse(findAddFieldRequest(this.aRequests).requestBody);
			assert.deepEqual(
				JSON.parse(oResponse.extensions[0]),
				{
					elements: {
						TestField: {
							name: "TestField",
							type: "cds.String",
							"@assert.range": true,
							"enum": {
								a: {},
								b: {},
								c: {}
							}
						}
					},
					extend: "SampleType"
				},
				"then the custom annotation is added to the payload"
			);
		});
	});

	QUnit.done(function () {
		jQuery("#qunit-fixture").hide();
	});
});