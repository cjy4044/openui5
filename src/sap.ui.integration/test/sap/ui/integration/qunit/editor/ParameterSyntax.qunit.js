/* global QUnit */
sap.ui.define([
	"sap/base/util/merge",
	"sap-ui-integration-editor",
	"sap/ui/integration/editor/Editor",
	"sap/ui/integration/Designtime",
	"sap/ui/integration/Host",
	"sap/ui/thirdparty/sinon-4",
	"./ContextHost",
	"sap/ui/core/Core",
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/events/KeyCodes",
	"sap/base/i18n/ResourceBundle"
], function (
	merge,
	x,
	Editor,
	Designtime,
	Host,
	sinon,
	ContextHost,
	Core,
	QUnitUtils,
	KeyCodes,
	ResourceBundle
) {
	"use strict";

	var sandbox = sinon.createSandbox();
	QUnit.config.reorder = false;

	var sBaseUrl = "test-resources/sap/ui/integration/qunit/editor/jsons/withDesigntime/sap.card/";
	var oManifest = {
			"sap.app": {
			"id": "test.sample",
			"i18n": "../i18n/i18n.properties"
		},
		"sap.card": {
			"designtime": "designtime/parametersyntax",
			"type": "List",
			"configuration": {
				"parameters": {
					"stringParameter": {
						"value": "stringParameter Value"
					},
					"stringWithTranslatedValue": {
						"value": "{{STRINGPARAMETERVALUE}}"
					},
					"stringWithTranslatedValueIni18nFormat": {
						"value": "{i18n>STRINGPARAMETERVALUE}"
					},
					"parameterSyntaxNormal": {
						"value": "Value: {{parameters.stringParameter}}"
					},
					"parameterSyntaxToTranslate": {
						"value": "Value: {{parameters.stringWithTranslatedValue}}"
					},
					"parameterSyntaxToI18nTranslate": {
						"value": "Value: {{parameters.stringWithTranslatedValueIni18nFormat}}"
					},
					"parameterSyntaxToTODAY_ISO": {
						"value": "Value: {{parameters.TODAY_ISO}}"
					},
					"parameterSyntaxToNOW_ISO": {
						"value": "Value: {{parameters.NOW_ISO}}"
					},
					"parameterSyntaxToLOCALE": {
						"value": "Value: {{parameters.LOCALE}}"
					},
					"parameterSyntax_mixed": {
						"value": "Mixed value: {{parameters.stringParameter}}, {{parameters.stringWithTranslatedValue}}, {{parameters.stringWithTranslatedValueIni18nFormat}}, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End"
					},
					"parameterSyntaxToTODAY_ISO1": {
						"value": "Value: {{parameters.TODAY_ISO1}}"
					},
					"parameterSyntaxToNOW_ISO1": {
						"value": "Value: {{parameters.NOW_ISO1}}"
					},
					"parameterSyntaxToLOCALE1": {
						"value": "Value: {{parameters.LOCALE1}}"
					},
					"TODAY_ISO2": {
						"value": "TODAY_ISO2"
					},
					"parameterSyntaxToTODAY_ISO2": {
						"value": "Value: {{parameters.TODAY_ISO2}}"
					},
					"NOW_ISO2": {
						"value": "NOW_ISO2"
					},
					"parameterSyntaxToNOW_ISO2": {
						"value": "Value: {{parameters.NOW_ISO2}}"
					},
					"LOCALE2": {
						"value": "LOCALE2"
					},
					"parameterSyntaxToLOCALE2": {
						"value": "Value: {{parameters.LOCALE2}}"
					}
				}
			}
		}
	};

	document.body.className = document.body.className + " sapUiSizeCompact ";

	function wait(ms) {
		return new Promise(function (resolve) {
			setTimeout(function () {
				resolve();
			}, ms || 1000);
		});
	}

	QUnit.module("Admin Mode", {
		beforeEach: function () {
			this.oHost = new Host("host");
			this.oContextHost = new ContextHost("contexthost");

			this.oEditor = new Editor();
			var oContent = document.getElementById("content");
			if (!oContent) {
				oContent = document.createElement("div");
				oContent.setAttribute("id", "content");
				document.body.appendChild(oContent);
				document.body.style.zIndex = 1000;
			}
			this.oEditor.placeAt(oContent);
		},
		afterEach: function () {
			this.oEditor.destroy();
			this.oHost.destroy();
			this.oContextHost.destroy();
			sandbox.restore();
			var oContent = document.getElementById("content");
			if (oContent) {
				oContent.innerHTML = "";
				document.body.style.zIndex = "unset";
			}
		}
	}, function () {
		QUnit.test("Default without change", function (assert) {
			this.oEditor.setMode("admin");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oStringrField = this.oEditor.getAggregation("_formContent")[2];
					assert.ok(oStringrField.getAggregation("_field").getValue() === "stringParameter Value", "Field: stringParameter Value");
					var oTranslateField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oTranslateField.getAggregation("_field").getValue() === "StringParameter Value Trans in i18n", "Field: Translation Value");
					var oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getValue() === "StringParameter Value Trans in i18n", "Field: Translation i18n Value");
					var oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[8];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getValue() === "Value: stringParameter Value", "Field: Normol parameter syntax Value");
					var oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans in i18n", "Field: parameter syntax to translate Value");
					var oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans in i18n", "Field: parameter syntax to translate in i18n format Value");
					var oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[14];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.TODAY_ISO}}", "Field: parameter syntax to TODAY_ISO Value");
					var oNowSyntaxField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oNowSyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.NOW_ISO}}", "Field: parameter syntax to NOW_ISO Value");
					var oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.LOCALE}}", "Field: parameter syntax to LOCALE Value");
					var oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[20];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getValue() === "Mixed value: stringParameter Value, StringParameter Value Trans in i18n, StringParameter Value Trans in i18n, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs Value");
					var oToday1SyntaxField = this.oEditor.getAggregation("_formContent")[22];
					assert.ok(oToday1SyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.TODAY_ISO1}}", "Field: parameter syntax to TODAY_ISO1 Value");
					var oNow1SyntaxField = this.oEditor.getAggregation("_formContent")[24];
					assert.ok(oNow1SyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.NOW_ISO1}}", "Field: parameter syntax to NOW_ISO1 Value");
					var oLocale1SyntaxField = this.oEditor.getAggregation("_formContent")[26];
					assert.ok(oLocale1SyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.LOCALE1}}", "Field: parameter syntax to LOCALE1 Value");
					var oToday2SyntaxField = this.oEditor.getAggregation("_formContent")[30];
					assert.ok(oToday2SyntaxField.getAggregation("_field").getValue() === "Value: TODAY_ISO2", "Field: parameter syntax to TODAY_ISO2 Value");
					var oNow2SyntaxField = this.oEditor.getAggregation("_formContent")[34];
					assert.ok(oNow2SyntaxField.getAggregation("_field").getValue() === "Value: NOW_ISO2", "Field: parameter syntax to NOW_ISO2 Value");
					var oLocale2SyntaxField = this.oEditor.getAggregation("_formContent")[38];
					assert.ok(oLocale2SyntaxField.getAggregation("_field").getValue() === "Value: LOCALE2", "Field: parameter syntax to LOCALE2 Value");

					oStringrField.getAggregation("_field").setValue("stringParameter New Value");
					oTranslateField.getAggregation("_field").setValue("StringParameter Value Trans New Value");
					oTranslateInI18nField.getAggregation("_field").setValue("StringParameter Value Trans in i18n New Value");
					wait(1000).then(function () {
						assert.ok(oNormalSyntaxField.getAggregation("_field").getValue() === "Value: stringParameter New Value", "Field: Normol parameter syntax New Value");
						assert.ok(oTranslateSyntaxField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans New Value", "Field: parameter syntax to translate New Value");
						assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans in i18n New Value", "Field: parameter syntax to translate New Value");
						assert.ok(oTodaySyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.TODAY_ISO}}", "Field: parameter syntax to TODAY_ISO Value");
						assert.ok(oNowSyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.NOW_ISO}}", "Field: parameter syntax to NOW_ISO Value");
						assert.ok(oLocaleSyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.LOCALE}}", "Field: parameter syntax to LOCALE Value");
						assert.ok(oMixedSyntaxField.getAggregation("_field").getValue() === "Mixed value: stringParameter New Value, StringParameter Value Trans New Value, StringParameter Value Trans in i18n New Value, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs New Value");
						resolve();
					});
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter change from Admin", function (assert) {
			var adminchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Admin",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Admin1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Admin2",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {};
			var translationchanges = {};
			this.oEditor.setMode("admin");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oField = this.oEditor.getAggregation("_formContent")[2];
					assert.ok(oField.getAggregation("_field").getValue() === "stringParameter Value Admin", "Field: String Value");
					oField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Admin1", "Field: Translation Value");
					oField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Admin2", "Field: Translation i18n Value");
					oField = this.oEditor.getAggregation("_formContent")[8];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: stringParameter Value Admin", "Field: Normol parameter syntax Value");
					oField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans Admin1", "Field: parameter syntax to translate Value");
					oField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans Admin2", "Field: parameter syntax to translate in i18n format Value");
					oField = this.oEditor.getAggregation("_formContent")[14];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: {{parameters.TODAY_ISO}}", "Field: parameter syntax to TODAY_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: {{parameters.NOW_ISO}}", "Field: parameter syntax to NOW_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: {{parameters.LOCALE}}", "Field: parameter syntax to LOCALE Value");
					oField = this.oEditor.getAggregation("_formContent")[20];
					assert.ok(oField.getAggregation("_field").getValue() === "Mixed value: stringParameter Value Admin, StringParameter Value Trans Admin1, StringParameter Value Trans Admin2, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter and self change from Admin", function (assert) {
			var adminchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Admin",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Admin1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Admin2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Admin",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Admin",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {};
			var translationchanges = {};
			this.oEditor.setMode("admin");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oField = this.oEditor.getAggregation("_formContent")[2];
					assert.ok(oField.getAggregation("_field").getValue() === "stringParameter Value Admin", "Field: String Value");
					oField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Admin1", "Field: Translation Value");
					oField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Admin2", "Field: Translation i18n Value");
					oField = this.oEditor.getAggregation("_formContent")[8];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxNormal Value Admin", "Field: Normol parameter syntax Value");
					oField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTranslate Value Admin", "Field: parameter syntax to translate Value");
					oField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToI18nTranslate Value Admin", "Field: parameter syntax to translate in i18n format Value");
					oField = this.oEditor.getAggregation("_formContent")[14];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTODAY_ISO Value Admin", "Field: parameter syntax to TODAY_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToNOW_ISO Value Admin", "Field: parameter syntax to NOW_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToLOCALE Value Admin", "Field: parameter syntax to LOCALE Value");
					oField = this.oEditor.getAggregation("_formContent")[20];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntax_mixed Value Admin", "Field: mixed parameter syntaxs Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});
	});

	QUnit.module("Content Mode", {
		beforeEach: function () {
			this.oHost = new Host("host");
			this.oContextHost = new ContextHost("contexthost");

			this.oEditor = new Editor();
			var oContent = document.getElementById("content");
			if (!oContent) {
				oContent = document.createElement("div");
				oContent.setAttribute("id", "content");
				document.body.appendChild(oContent);
				document.body.style.zIndex = 1000;
			}
			this.oEditor.placeAt(oContent);
		},
		afterEach: function () {
			this.oEditor.destroy();
			this.oHost.destroy();
			this.oContextHost.destroy();
			sandbox.restore();
			var oContent = document.getElementById("content");
			if (oContent) {
				oContent.innerHTML = "";
				document.body.style.zIndex = "unset";
			}
		}
	}, function () {
		QUnit.test("Default without change", function (assert) {
			this.oEditor.setMode("content");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oStringrField = this.oEditor.getAggregation("_formContent")[2];
					assert.ok(oStringrField.getAggregation("_field").getValue() === "stringParameter Value", "Field: stringParameter Value");
					var oTranslateField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oTranslateField.getAggregation("_field").getValue() === "StringParameter Value Trans in i18n", "Field: Translation Value");
					var oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getValue() === "StringParameter Value Trans in i18n", "Field: Translation i18n Value");
					var oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[8];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getValue() === "Value: stringParameter Value", "Field: Normol parameter syntax Value");
					var oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans in i18n", "Field: parameter syntax to translate Value");
					var oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans in i18n", "Field: parameter syntax to translate in i18n format Value");
					var oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[14];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.TODAY_ISO}}", "Field: parameter syntax to TODAY_ISO Value");
					var oNowSyntaxField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oNowSyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.NOW_ISO}}", "Field: parameter syntax to NOW_ISO Value");
					var oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.LOCALE}}", "Field: parameter syntax to LOCALE Value");
					var oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[20];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getValue() === "Mixed value: stringParameter Value, StringParameter Value Trans in i18n, StringParameter Value Trans in i18n, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs Value");
					var oToday1SyntaxField = this.oEditor.getAggregation("_formContent")[22];
					assert.ok(oToday1SyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.TODAY_ISO1}}", "Field: parameter syntax to TODAY_ISO1 Value");
					var oNow1SyntaxField = this.oEditor.getAggregation("_formContent")[24];
					assert.ok(oNow1SyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.NOW_ISO1}}", "Field: parameter syntax to NOW_ISO1 Value");
					var oLocale1SyntaxField = this.oEditor.getAggregation("_formContent")[26];
					assert.ok(oLocale1SyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.LOCALE1}}", "Field: parameter syntax to LOCALE1 Value");
					var oToday2SyntaxField = this.oEditor.getAggregation("_formContent")[30];
					assert.ok(oToday2SyntaxField.getAggregation("_field").getValue() === "Value: TODAY_ISO2", "Field: parameter syntax to TODAY_ISO2 Value");
					var oNow2SyntaxField = this.oEditor.getAggregation("_formContent")[34];
					assert.ok(oNow2SyntaxField.getAggregation("_field").getValue() === "Value: NOW_ISO2", "Field: parameter syntax to NOW_ISO2 Value");
					var oLocale2SyntaxField = this.oEditor.getAggregation("_formContent")[38];
					assert.ok(oLocale2SyntaxField.getAggregation("_field").getValue() === "Value: LOCALE2", "Field: parameter syntax to LOCALE2 Value");

					oStringrField.getAggregation("_field").setValue("stringParameter New Value");
					oTranslateField.getAggregation("_field").setValue("StringParameter Value Trans New Value");
					oTranslateInI18nField.getAggregation("_field").setValue("StringParameter Value Trans in i18n New Value");
					wait(1000).then(function () {
						assert.ok(oNormalSyntaxField.getAggregation("_field").getValue() === "Value: stringParameter New Value", "Field: Normol parameter syntax New Value");
						assert.ok(oTranslateSyntaxField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans New Value", "Field: parameter syntax to translate New Value");
						assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans in i18n New Value", "Field: parameter syntax to translate New Value");
						assert.ok(oTodaySyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.TODAY_ISO}}", "Field: parameter syntax to TODAY_ISO");
						assert.ok(oNowSyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.NOW_ISO}}", "Field: parameter syntax to NOW_ISO");
						assert.ok(oLocaleSyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.LOCALE}}", "Field: parameter syntax to LOCALE");
						assert.ok(oMixedSyntaxField.getAggregation("_field").getValue() === "Mixed value: stringParameter New Value, StringParameter Value Trans New Value, StringParameter Value Trans in i18n New Value, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs New Value");
						resolve();
					});
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter change from Admin", function (assert) {
			var adminchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Admin",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Admin1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Admin2",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {};
			var translationchanges = {};
			this.oEditor.setMode("content");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oField = this.oEditor.getAggregation("_formContent")[2];
					assert.ok(oField.getAggregation("_field").getValue() === "stringParameter Value Admin", "Field: String Value");
					oField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Admin1", "Field: Translation Value");
					oField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Admin2", "Field: Translation i18n Value");
					oField = this.oEditor.getAggregation("_formContent")[8];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: stringParameter Value Admin", "Field: Normol parameter syntax Value");
					oField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans Admin1", "Field: parameter syntax to translate Value");
					oField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans Admin2", "Field: parameter syntax to translate in i18n format Value");
					oField = this.oEditor.getAggregation("_formContent")[14];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: {{parameters.TODAY_ISO}}", "Field: parameter syntax to TODAY_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: {{parameters.NOW_ISO}}", "Field: parameter syntax to NOW_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: {{parameters.LOCALE}}", "Field: parameter syntax to LOCALE Value");
					oField = this.oEditor.getAggregation("_formContent")[20];
					assert.ok(oField.getAggregation("_field").getValue() === "Mixed value: stringParameter Value Admin, StringParameter Value Trans Admin1, StringParameter Value Trans Admin2, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter and self change from Admin", function (assert) {
			var adminchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Admin",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Admin1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Admin2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Admin",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Admin",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {};
			var translationchanges = {};
			this.oEditor.setMode("content");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oField = this.oEditor.getAggregation("_formContent")[2];
					assert.ok(oField.getAggregation("_field").getValue() === "stringParameter Value Admin", "Field: String Value");
					oField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Admin1", "Field: Translation Value");
					oField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Admin2", "Field: Translation i18n Value");
					oField = this.oEditor.getAggregation("_formContent")[8];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxNormal Value Admin", "Field: Normol parameter syntax Value");
					oField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTranslate Value Admin", "Field: parameter syntax to translate Value");
					oField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToI18nTranslate Value Admin", "Field: parameter syntax to translate in i18n format Value");
					oField = this.oEditor.getAggregation("_formContent")[14];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTODAY_ISO Value Admin", "Field: parameter syntax to TODAY_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToNOW_ISO Value Admin", "Field: parameter syntax to NOW_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToLOCALE Value Admin", "Field: parameter syntax to LOCALE Value");
					oField = this.oEditor.getAggregation("_formContent")[20];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntax_mixed Value Admin", "Field: mixed parameter syntaxs Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter change from Content", function (assert) {
			var adminchanges = {};
			var contentchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Content",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Content1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Content2",
				":layer": 5,
				":errors": false
			};
			var translationchanges = {};
			this.oEditor.setMode("content");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oField = this.oEditor.getAggregation("_formContent")[2];
					assert.ok(oField.getAggregation("_field").getValue() === "stringParameter Value Content", "Field: String Value");
					oField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Content1", "Field: Translation Value");
					oField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Content2", "Field: Translation i18n Value");
					oField = this.oEditor.getAggregation("_formContent")[8];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: stringParameter Value Content", "Field: Normol parameter syntax Value");
					oField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans Content1", "Field: parameter syntax to translate Value");
					oField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans Content2", "Field: parameter syntax to translate in i18n format Value");
					oField = this.oEditor.getAggregation("_formContent")[14];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: {{parameters.TODAY_ISO}}", "Field: parameter syntax to TODAY_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: {{parameters.NOW_ISO}}", "Field: parameter syntax to NOW_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: {{parameters.LOCALE}}", "Field: parameter syntax to LOCALE Value");
					oField = this.oEditor.getAggregation("_formContent")[20];
					assert.ok(oField.getAggregation("_field").getValue() === "Mixed value: stringParameter Value Content, StringParameter Value Trans Content1, StringParameter Value Trans Content2, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter and self change from Content", function (assert) {
			var adminchanges = {};
			var contentchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Content",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Content1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Content2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Content",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Content",
				":layer": 5,
				":errors": false
			};
			var translationchanges = {};
			this.oEditor.setMode("content");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oField = this.oEditor.getAggregation("_formContent")[2];
					assert.ok(oField.getAggregation("_field").getValue() === "stringParameter Value Content", "Field: String Value");
					oField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Content1", "Field: Translation Value");
					oField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Content2", "Field: Translation i18n Value");
					oField = this.oEditor.getAggregation("_formContent")[8];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxNormal Value Content", "Field: Normol parameter syntax Value");
					oField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTranslate Value Content", "Field: parameter syntax to translate Value");
					oField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToI18nTranslate Value Content", "Field: parameter syntax to translate in i18n format Value");
					oField = this.oEditor.getAggregation("_formContent")[14];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTODAY_ISO Value Content", "Field: parameter syntax to TODAY_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToNOW_ISO Value Content", "Field: parameter syntax to NOW_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToLOCALE Value Content", "Field: parameter syntax to LOCALE Value");
					oField = this.oEditor.getAggregation("_formContent")[20];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntax_mixed Value Content", "Field: mixed parameter syntaxs Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter change from Admin and Content", function (assert) {
			var adminchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Admin",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Admin1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Admin2",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Content",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Content2",
				":layer": 5,
				":errors": false
			};
			var translationchanges = {};
			this.oEditor.setMode("content");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oField = this.oEditor.getAggregation("_formContent")[2];
					assert.ok(oField.getAggregation("_field").getValue() === "stringParameter Value Content", "Field: String Value");
					oField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Admin1", "Field: Translation Value");
					oField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Content2", "Field: Translation i18n Value");
					oField = this.oEditor.getAggregation("_formContent")[8];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: stringParameter Value Content", "Field: Normol parameter syntax Value");
					oField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans Admin1", "Field: parameter syntax to translate Value");
					oField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans Content2", "Field: parameter syntax to translate in i18n format Value");
					oField = this.oEditor.getAggregation("_formContent")[14];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: {{parameters.TODAY_ISO}}", "Field: parameter syntax to TODAY_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: {{parameters.NOW_ISO}}", "Field: parameter syntax to NOW_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: {{parameters.LOCALE}}", "Field: parameter syntax to LOCALE Value");
					oField = this.oEditor.getAggregation("_formContent")[20];
					assert.ok(oField.getAggregation("_field").getValue() === "Mixed value: stringParameter Value Content, StringParameter Value Trans Admin1, StringParameter Value Trans Content2, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter and self change from Admin and Content 1", function (assert) {
			var adminchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Admin",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Admin1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Admin2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Admin",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Admin",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Content",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Content1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Content2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Content",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Content",
				":layer": 5,
				":errors": false
			};
			var translationchanges = {};
			this.oEditor.setMode("content");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oField = this.oEditor.getAggregation("_formContent")[2];
					assert.ok(oField.getAggregation("_field").getValue() === "stringParameter Value Content", "Field: String Value");
					oField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Content1", "Field: Translation Value");
					oField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Content2", "Field: Translation i18n Value");
					oField = this.oEditor.getAggregation("_formContent")[8];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxNormal Value Content", "Field: Normol parameter syntax Value");
					oField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTranslate Value Content", "Field: parameter syntax to translate Value");
					oField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToI18nTranslate Value Content", "Field: parameter syntax to translate in i18n format Value");
					oField = this.oEditor.getAggregation("_formContent")[14];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTODAY_ISO Value Content", "Field: parameter syntax to TODAY_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToNOW_ISO Value Content", "Field: parameter syntax to NOW_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToLOCALE Value Content", "Field: parameter syntax to LOCALE Value");
					oField = this.oEditor.getAggregation("_formContent")[20];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntax_mixed Value Content", "Field: mixed parameter syntaxs Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter and self change from Admin and Content 2", function (assert) {
			var adminchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Admin",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Admin1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Admin2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Admin",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Content",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Content2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Content",
				":layer": 5,
				":errors": false
			};
			var translationchanges = {};
			this.oEditor.setMode("content");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oField = this.oEditor.getAggregation("_formContent")[2];
					assert.ok(oField.getAggregation("_field").getValue() === "stringParameter Value Content", "Field: String Value");
					oField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Admin1", "Field: Translation Value");
					oField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Content2", "Field: Translation i18n Value");
					oField = this.oEditor.getAggregation("_formContent")[8];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxNormal Value Content", "Field: Normol parameter syntax Value");
					oField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTranslate Value Admin", "Field: parameter syntax to translate Value");
					oField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToI18nTranslate Value Content", "Field: parameter syntax to translate in i18n format Value");
					oField = this.oEditor.getAggregation("_formContent")[14];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTODAY_ISO Value Admin", "Field: parameter syntax to TODAY_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToNOW_ISO Value Content", "Field: parameter syntax to NOW_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToLOCALE Value Content", "Field: parameter syntax to LOCALE Value");
					oField = this.oEditor.getAggregation("_formContent")[20];
					assert.ok(oField.getAggregation("_field").getValue() === "Mixed value: stringParameter Value Content, StringParameter Value Trans Admin1, StringParameter Value Trans Content2, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter and self change from Admin and Content 3", function (assert) {
			var adminchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Admin",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Admin2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Admin",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Content",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Content2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Content",
				":layer": 5,
				":errors": false
			};
			var translationchanges = {};
			this.oEditor.setMode("content");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oField = this.oEditor.getAggregation("_formContent")[2];
					assert.ok(oField.getAggregation("_field").getValue() === "stringParameter Value Content", "Field: String Value");
					oField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans in i18n", "Field: Translation Value");
					oField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Content2", "Field: Translation i18n Value");
					oField = this.oEditor.getAggregation("_formContent")[8];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxNormal Value Content", "Field: Normol parameter syntax Value");
					oField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTranslate Value Admin", "Field: parameter syntax to translate Value");
					oField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToI18nTranslate Value Content", "Field: parameter syntax to translate in i18n format Value");
					oField = this.oEditor.getAggregation("_formContent")[14];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTODAY_ISO Value Admin", "Field: parameter syntax to TODAY_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToNOW_ISO Value Content", "Field: parameter syntax to NOW_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToLOCALE Value Content", "Field: parameter syntax to LOCALE Value");
					oField = this.oEditor.getAggregation("_formContent")[20];
					assert.ok(oField.getAggregation("_field").getValue() === "Mixed value: stringParameter Value Content, StringParameter Value Trans in i18n, StringParameter Value Trans Content2, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});
	});

	QUnit.module("Translation Mode", {
		beforeEach: function () {
			this.oHost = new Host("host");
			this.oContextHost = new ContextHost("contexthost");

			this.oEditor = new Editor();
			var oContent = document.getElementById("content");
			if (!oContent) {
				oContent = document.createElement("div");
				oContent.setAttribute("id", "content");
				document.body.appendChild(oContent);
				document.body.style.zIndex = 1000;
			}
			this.oEditor.placeAt(oContent);
		},
		afterEach: function () {
			this.oEditor.destroy();
			this.oHost.destroy();
			this.oContextHost.destroy();
			sandbox.restore();
			var oContent = document.getElementById("content");
			if (oContent) {
				oContent.innerHTML = "";
				document.body.style.zIndex = "unset";
			}
		}
	}, function () {
		QUnit.test("Default without change", function (assert) {
			this.oEditor.setMode("translation");
			this.oEditor.setLanguage("fr");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oStringrField = this.oEditor.getAggregation("_formContent")[3];
					assert.ok(oStringrField.getAggregation("_field").getText() === "stringParameter Value", "Field: stringParameter ori Value");
					oStringrField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oStringrField.getAggregation("_field").getValue() === "stringParameter Value", "Field: stringParameter trans Value");
					var oTranslateField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oTranslateField.getAggregation("_field").getText() === "StringParameter Value Trans in i18n", "Field: Translation ori Value");
					oTranslateField = this.oEditor.getAggregation("_formContent")[7];
					assert.ok(oTranslateField.getAggregation("_field").getValue() === "StringParameter Value Trans in i18n France", "Field: Translation trans Value");
					var oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[9];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getText() === "StringParameter Value Trans in i18n", "Field: Translation i18n ori Value");
					oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getValue() === "StringParameter Value Trans in i18n France", "Field: Translation i18n trans Value");
					var oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getText() === "Value: stringParameter Value", "Field: Normol parameter syntax Value");
					oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[13];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getValue() === "Value: stringParameter Value", "Field: Normol parameter syntax trans Value");
					var oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[15];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getText() === "Value: StringParameter Value Trans in i18n", "Field: parameter syntax to translate Value");
					oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans in i18n France", "Field: parameter syntax to translate trans Value");
					var oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getText() === "Value: StringParameter Value Trans in i18n", "Field: parameter syntax to translate in i18n format Value");
					oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[19];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans in i18n France", "Field: parameter syntax to translate in i18n format trans Value");
					var oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[21];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getText() === "Value: {{parameters.TODAY_ISO}}", "Field: parameter syntax to TODAY_ISO Value");
					oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[22];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.TODAY_ISO}}", "Field: parameter syntax to TODAY_ISO trans Value");
					var oNowSyntaxField = this.oEditor.getAggregation("_formContent")[24];
					assert.ok(oNowSyntaxField.getAggregation("_field").getText() === "Value: {{parameters.NOW_ISO}}", "Field: parameter syntax to NOW_ISO Value");
					oNowSyntaxField = this.oEditor.getAggregation("_formContent")[25];
					assert.ok(oNowSyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.NOW_ISO}}", "Field: parameter syntax to NOW_ISO trans Value");
					var oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[27];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getText() === "Value: {{parameters.LOCALE}}", "Field: parameter syntax to LOCALE Value");
					oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[28];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.LOCALE}}", "Field: parameter syntax to LOCALE trans Value");
					var oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[30];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getText() === "Mixed value: stringParameter Value, StringParameter Value Trans in i18n, StringParameter Value Trans in i18n, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs Value");
					oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[31];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getValue() === "Mixed value: stringParameter Value, StringParameter Value Trans in i18n France, StringParameter Value Trans in i18n France, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs trans Value");
					var oToday1SyntaxField = this.oEditor.getAggregation("_formContent")[33];
					assert.ok(oToday1SyntaxField.getAggregation("_field").getText() === "Value: {{parameters.TODAY_ISO1}}", "Field: parameter syntax to TODAY_ISO1 Value");
					oToday1SyntaxField = this.oEditor.getAggregation("_formContent")[34];
					assert.ok(oToday1SyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.TODAY_ISO1}}", "Field: parameter syntax to TODAY_ISO1 trans Value");
					var oNow1SyntaxField = this.oEditor.getAggregation("_formContent")[36];
					assert.ok(oNow1SyntaxField.getAggregation("_field").getText() === "Value: {{parameters.NOW_ISO1}}", "Field: parameter syntax to NOW_ISO1 Value");
					oNow1SyntaxField = this.oEditor.getAggregation("_formContent")[37];
					assert.ok(oNow1SyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.NOW_ISO1}}", "Field: parameter syntax to NOW_ISO1 trans Value");
					var oLocale1SyntaxField = this.oEditor.getAggregation("_formContent")[39];
					assert.ok(oLocale1SyntaxField.getAggregation("_field").getText() === "Value: {{parameters.LOCALE1}}", "Field: parameter syntax to LOCALE1 Value");
					oLocale1SyntaxField = this.oEditor.getAggregation("_formContent")[40];
					assert.ok(oLocale1SyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.LOCALE1}}", "Field: parameter syntax to LOCALE1 trans Value");

					var oToday2SyntaxField = this.oEditor.getAggregation("_formContent")[45];
					assert.ok(oToday2SyntaxField.getAggregation("_field").getText() === "Value: TODAY_ISO2", "Field: parameter syntax to TODAY_ISO2 Value");
					oToday2SyntaxField = this.oEditor.getAggregation("_formContent")[46];
					assert.ok(oToday2SyntaxField.getAggregation("_field").getValue() === "Value: TODAY_ISO2", "Field: parameter syntax to TODAY_ISO2 trans Value");
					var oNow2SyntaxField = this.oEditor.getAggregation("_formContent")[51];
					assert.ok(oNow2SyntaxField.getAggregation("_field").getText() === "Value: NOW_ISO2", "Field: parameter syntax to NOW_ISO2 Value");
					oNow2SyntaxField = this.oEditor.getAggregation("_formContent")[52];
					assert.ok(oNow2SyntaxField.getAggregation("_field").getValue() === "Value: NOW_ISO2", "Field: parameter syntax to NOW_ISO2 trans Value");
					var oLocale2SyntaxField = this.oEditor.getAggregation("_formContent")[57];
					assert.ok(oLocale2SyntaxField.getAggregation("_field").getText() === "Value: LOCALE2", "Field: parameter syntax to LOCALE2 Value");
					oLocale2SyntaxField = this.oEditor.getAggregation("_formContent")[58];
					assert.ok(oLocale2SyntaxField.getAggregation("_field").getValue() === "Value: LOCALE2", "Field: parameter syntax to LOCALE2 trans Value");


					oStringrField.getAggregation("_field").setValue("stringParameter New Value");
					oTranslateField.getAggregation("_field").setValue("StringParameter Value Trans New Value");
					oTranslateInI18nField.getAggregation("_field").setValue("StringParameter Value Trans in i18n New Value");
					wait(1000).then(function () {
						assert.ok(oNormalSyntaxField.getAggregation("_field").getValue() === "Value: stringParameter New Value", "Field: Normol parameter syntax trans New Value");
						assert.ok(oTranslateSyntaxField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans New Value", "Field: parameter syntax to translate trans New Value");
						assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans in i18n New Value", "Field: parameter syntax to translate trans New Value");
						assert.ok(oTodaySyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.TODAY_ISO}}", "Field: parameter syntax to TODAY_ISO");
						assert.ok(oNowSyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.NOW_ISO}}", "Field: parameter syntax to NOW_ISO");
						assert.ok(oLocaleSyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.LOCALE}}", "Field: parameter syntax to LOCALE");
						assert.ok(oMixedSyntaxField.getAggregation("_field").getValue() === "Mixed value: stringParameter New Value, StringParameter Value Trans New Value, StringParameter Value Trans in i18n New Value, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs New Value");
						resolve();
					});
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter change from Admin", function (assert) {
			this.oEditor.setMode("translation");
			this.oEditor.setLanguage("fr");
			var adminchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Admin",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Admin1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Admin2",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {};
			var translationchanges = {};
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oStringrField = this.oEditor.getAggregation("_formContent")[3];
					assert.ok(oStringrField.getAggregation("_field").getText() === "stringParameter Value Admin", "Field: stringParameter ori Value");
					oStringrField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oStringrField.getAggregation("_field").getValue() === "stringParameter Value Admin", "Field: stringParameter trans Value");
					var oTranslateField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oTranslateField.getAggregation("_field").getText() === "StringParameter Value Trans Admin1", "Field: Translation ori Value");
					oTranslateField = this.oEditor.getAggregation("_formContent")[7];
					assert.ok(oTranslateField.getAggregation("_field").getValue() === "StringParameter Value Trans Admin1", "Field: Translation trans Value");
					var oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[9];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getText() === "StringParameter Value Trans Admin2", "Field: Translation i18n ori Value");
					oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getValue() === "StringParameter Value Trans Admin2", "Field: Translation i18n trans Value");
					var oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getText() === "Value: stringParameter Value Admin", "Field: Normol parameter syntax Value");
					oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[13];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getValue() === "Value: stringParameter Value Admin", "Field: Normol parameter syntax trans Value");
					var oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[15];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getText() === "Value: StringParameter Value Trans Admin1", "Field: parameter syntax to translate Value");
					oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans Admin1", "Field: parameter syntax to translate trans Value");
					var oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getText() === "Value: StringParameter Value Trans Admin2", "Field: parameter syntax to translate in i18n format Value");
					oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[19];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans Admin2", "Field: parameter syntax to translate in i18n format trans Value");
					var oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[21];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getText() === "Value: {{parameters.TODAY_ISO}}", "Field: parameter syntax to TODAY_ISO Value");
					oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[22];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.TODAY_ISO}}", "Field: parameter syntax to TODAY_ISO trans Value");
					var oNowSyntaxField = this.oEditor.getAggregation("_formContent")[24];
					assert.ok(oNowSyntaxField.getAggregation("_field").getText() === "Value: {{parameters.NOW_ISO}}", "Field: parameter syntax to NOW_ISO Value");
					oNowSyntaxField = this.oEditor.getAggregation("_formContent")[25];
					assert.ok(oNowSyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.NOW_ISO}}", "Field: parameter syntax to NOW_ISO trans Value");
					var oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[27];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getText() === "Value: {{parameters.LOCALE}}", "Field: parameter syntax to LOCALE Value");
					oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[28];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.LOCALE}}", "Field: parameter syntax to LOCALE trans Value");
					var oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[30];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getText() === "Mixed value: stringParameter Value Admin, StringParameter Value Trans Admin1, StringParameter Value Trans Admin2, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs Value");
					oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[31];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getValue() === "Mixed value: stringParameter Value Admin, StringParameter Value Trans Admin1, StringParameter Value Trans Admin2, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs trans Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter and self change from Admin", function (assert) {
			this.oEditor.setMode("translation");
			this.oEditor.setLanguage("fr");
			var adminchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Admin",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Admin1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Admin2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Admin",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Admin",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {};
			var translationchanges = {};
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oStringrField = this.oEditor.getAggregation("_formContent")[3];
					assert.ok(oStringrField.getAggregation("_field").getText() === "stringParameter Value Admin", "Field: stringParameter ori Value");
					oStringrField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oStringrField.getAggregation("_field").getValue() === "stringParameter Value Admin", "Field: stringParameter trans Value");
					var oTranslateField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oTranslateField.getAggregation("_field").getText() === "StringParameter Value Trans Admin1", "Field: Translation ori Value");
					oTranslateField = this.oEditor.getAggregation("_formContent")[7];
					assert.ok(oTranslateField.getAggregation("_field").getValue() === "StringParameter Value Trans Admin1", "Field: Translation trans Value");
					var oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[9];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getText() === "StringParameter Value Trans Admin2", "Field: Translation i18n ori Value");
					oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getValue() === "StringParameter Value Trans Admin2", "Field: Translation i18n trans Value");
					var oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxNormal Value Admin", "Field: Normol parameter syntax Value");
					oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[13];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxNormal Value Admin", "Field: Normol parameter syntax trans Value");
					var oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[15];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToTranslate Value Admin", "Field: parameter syntax to translate Value");
					oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTranslate Value Admin", "Field: parameter syntax to translate trans Value");
					var oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToI18nTranslate Value Admin", "Field: parameter syntax to translate in i18n format Value");
					oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[19];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToI18nTranslate Value Admin", "Field: parameter syntax to translate in i18n format trans Value");
					var oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[21];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToTODAY_ISO Value Admin", "Field: parameter syntax to TODAY_ISO Value");
					oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[22];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTODAY_ISO Value Admin", "Field: parameter syntax to TODAY_ISO trans Value");
					var oNowSyntaxField = this.oEditor.getAggregation("_formContent")[24];
					assert.ok(oNowSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToNOW_ISO Value Admin", "Field: parameter syntax to NOW_ISO Value");
					oNowSyntaxField = this.oEditor.getAggregation("_formContent")[25];
					assert.ok(oNowSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToNOW_ISO Value Admin", "Field: parameter syntax to NOW_ISO trans Value");
					var oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[27];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToLOCALE Value Admin", "Field: parameter syntax to LOCALE Value");
					oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[28];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToLOCALE Value Admin", "Field: parameter syntax to LOCALE trans Value");
					var oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[30];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntax_mixed Value Admin", "Field: mixed parameter syntaxs Value");
					oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[31];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntax_mixed Value Admin", "Field: mixed parameter syntaxs trans Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter change from Content", function (assert) {
			this.oEditor.setMode("translation");
			this.oEditor.setLanguage("fr");
			var adminchanges = {};
			var contentchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Content",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Content1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Content2",
				":layer": 5,
				":errors": false
			};
			var translationchanges = {};
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oStringrField = this.oEditor.getAggregation("_formContent")[3];
					assert.ok(oStringrField.getAggregation("_field").getText() === "stringParameter Value Content", "Field: stringParameter ori Value");
					oStringrField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oStringrField.getAggregation("_field").getValue() === "stringParameter Value Content", "Field: stringParameter trans Value");
					var oTranslateField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oTranslateField.getAggregation("_field").getText() === "StringParameter Value Trans Content1", "Field: Translation ori Value");
					oTranslateField = this.oEditor.getAggregation("_formContent")[7];
					assert.ok(oTranslateField.getAggregation("_field").getValue() === "StringParameter Value Trans Content1", "Field: Translation trans Value");
					var oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[9];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getText() === "StringParameter Value Trans Content2", "Field: Translation i18n ori Value");
					oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getValue() === "StringParameter Value Trans Content2", "Field: Translation i18n trans Value");
					var oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getText() === "Value: stringParameter Value Content", "Field: Normol parameter syntax Value");
					oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[13];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getValue() === "Value: stringParameter Value Content", "Field: Normol parameter syntax trans Value");
					var oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[15];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getText() === "Value: StringParameter Value Trans Content1", "Field: parameter syntax to translate Value");
					oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans Content1", "Field: parameter syntax to translate trans Value");
					var oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getText() === "Value: StringParameter Value Trans Content2", "Field: parameter syntax to translate in i18n format Value");
					oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[19];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans Content2", "Field: parameter syntax to translate in i18n format trans Value");
					var oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[21];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getText() === "Value: {{parameters.TODAY_ISO}}", "Field: parameter syntax to TODAY_ISO Value");
					oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[22];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.TODAY_ISO}}", "Field: parameter syntax to TODAY_ISO trans Value");
					var oNowSyntaxField = this.oEditor.getAggregation("_formContent")[24];
					assert.ok(oNowSyntaxField.getAggregation("_field").getText() === "Value: {{parameters.NOW_ISO}}", "Field: parameter syntax to NOW_ISO Value");
					oNowSyntaxField = this.oEditor.getAggregation("_formContent")[25];
					assert.ok(oNowSyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.NOW_ISO}}", "Field: parameter syntax to NOW_ISO trans Value");
					var oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[27];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getText() === "Value: {{parameters.LOCALE}}", "Field: parameter syntax to LOCALE Value");
					oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[28];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.LOCALE}}", "Field: parameter syntax to LOCALE trans Value");
					var oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[30];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getText() === "Mixed value: stringParameter Value Content, StringParameter Value Trans Content1, StringParameter Value Trans Content2, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs Value");
					oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[31];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getValue() === "Mixed value: stringParameter Value Content, StringParameter Value Trans Content1, StringParameter Value Trans Content2, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs trans Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter and self change from Content", function (assert) {
			this.oEditor.setMode("translation");
			this.oEditor.setLanguage("fr");
			var adminchanges = {};
			var contentchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Content",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Content1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Content2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Content",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Content",
				":layer": 5,
				":errors": false
			};
			var translationchanges = {};
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oStringrField = this.oEditor.getAggregation("_formContent")[3];
					assert.ok(oStringrField.getAggregation("_field").getText() === "stringParameter Value Content", "Field: stringParameter ori Value");
					oStringrField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oStringrField.getAggregation("_field").getValue() === "stringParameter Value Content", "Field: stringParameter trans Value");
					var oTranslateField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oTranslateField.getAggregation("_field").getText() === "StringParameter Value Trans Content1", "Field: Translation ori Value");
					oTranslateField = this.oEditor.getAggregation("_formContent")[7];
					assert.ok(oTranslateField.getAggregation("_field").getValue() === "StringParameter Value Trans Content1", "Field: Translation trans Value");
					var oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[9];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getText() === "StringParameter Value Trans Content2", "Field: Translation i18n ori Value");
					oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getValue() === "StringParameter Value Trans Content2", "Field: Translation i18n trans Value");
					var oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxNormal Value Content", "Field: Normol parameter syntax Value");
					oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[13];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxNormal Value Content", "Field: Normol parameter syntax trans Value");
					var oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[15];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToTranslate Value Content", "Field: parameter syntax to translate Value");
					oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTranslate Value Content", "Field: parameter syntax to translate trans Value");
					var oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToI18nTranslate Value Content", "Field: parameter syntax to translate in i18n format Value");
					oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[19];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToI18nTranslate Value Content", "Field: parameter syntax to translate in i18n format trans Value");
					var oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[21];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToTODAY_ISO Value Content", "Field: parameter syntax to TODAY_ISO Value");
					oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[22];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTODAY_ISO Value Content", "Field: parameter syntax to TODAY_ISO trans Value");
					var oNowSyntaxField = this.oEditor.getAggregation("_formContent")[24];
					assert.ok(oNowSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToNOW_ISO Value Content", "Field: parameter syntax to NOW_ISO Value");
					oNowSyntaxField = this.oEditor.getAggregation("_formContent")[25];
					assert.ok(oNowSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToNOW_ISO Value Content", "Field: parameter syntax to NOW_ISO trans Value");
					var oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[27];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToLOCALE Value Content", "Field: parameter syntax to LOCALE Value");
					oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[28];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToLOCALE Value Content", "Field: parameter syntax to LOCALE trans Value");
					var oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[30];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntax_mixed Value Content", "Field: mixed parameter syntaxs Value");
					oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[31];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntax_mixed Value Content", "Field: mixed parameter syntaxs trans Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter change from Translate", function (assert) {
			this.oEditor.setMode("translation");
			this.oEditor.setLanguage("fr");
			var adminchanges = {};
			var contentchanges = {};
			var translationchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Translation",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Translation1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Translation2",
				":layer": 10,
				":errors": false
			};
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oStringrField = this.oEditor.getAggregation("_formContent")[3];
					assert.ok(oStringrField.getAggregation("_field").getText() === "stringParameter Value", "Field: stringParameter ori Value");
					oStringrField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oStringrField.getAggregation("_field").getValue() === "stringParameter Value Translation", "Field: stringParameter trans Value");
					var oTranslateField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oTranslateField.getAggregation("_field").getText() === "StringParameter Value Trans in i18n", "Field: Translation ori Value");
					oTranslateField = this.oEditor.getAggregation("_formContent")[7];
					assert.ok(oTranslateField.getAggregation("_field").getValue() === "StringParameter Value Trans Translation1", "Field: Translation trans Value");
					var oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[9];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getText() === "StringParameter Value Trans in i18n", "Field: Translation i18n ori Value");
					oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getValue() === "StringParameter Value Trans Translation2", "Field: Translation i18n trans Value");
					var oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getText() === "Value: stringParameter Value", "Field: Normol parameter syntax Value");
					oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[13];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getValue() === "Value: stringParameter Value Translation", "Field: Normol parameter syntax trans Value");
					var oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[15];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getText() === "Value: StringParameter Value Trans in i18n", "Field: parameter syntax to translate Value");
					oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans Translation1", "Field: parameter syntax to translate trans Value");
					var oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getText() === "Value: StringParameter Value Trans in i18n", "Field: parameter syntax to translate in i18n format Value");
					oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[19];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans Translation2", "Field: parameter syntax to translate in i18n format trans Value");
					var oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[21];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getText() === "Value: {{parameters.TODAY_ISO}}", "Field: parameter syntax to TODAY_ISO Value");
					oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[22];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.TODAY_ISO}}", "Field: parameter syntax to TODAY_ISO trans Value");
					var oNowSyntaxField = this.oEditor.getAggregation("_formContent")[24];
					assert.ok(oNowSyntaxField.getAggregation("_field").getText() === "Value: {{parameters.NOW_ISO}}", "Field: parameter syntax to NOW_ISO Value");
					oNowSyntaxField = this.oEditor.getAggregation("_formContent")[25];
					assert.ok(oNowSyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.NOW_ISO}}", "Field: parameter syntax to NOW_ISO trans Value");
					var oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[27];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getText() === "Value: {{parameters.LOCALE}}", "Field: parameter syntax to LOCALE Value");
					oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[28];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.LOCALE}}", "Field: parameter syntax to LOCALE trans Value");
					var oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[30];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getText() === "Mixed value: stringParameter Value, StringParameter Value Trans in i18n, StringParameter Value Trans in i18n, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs Value");
					oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[31];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getValue() === "Mixed value: stringParameter Value Translation, StringParameter Value Trans Translation1, StringParameter Value Trans Translation2, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs trans Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter and self change from Translate", function (assert) {
			this.oEditor.setMode("translation");
			this.oEditor.setLanguage("fr");
			var adminchanges = {};
			var contentchanges = {};
			var translationchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Translation",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Translation1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Translation2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Translation",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Translation",
				":layer": 10,
				":errors": false
			};
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oStringrField = this.oEditor.getAggregation("_formContent")[3];
					assert.ok(oStringrField.getAggregation("_field").getText() === "stringParameter Value", "Field: stringParameter ori Value");
					oStringrField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oStringrField.getAggregation("_field").getValue() === "stringParameter Value Translation", "Field: stringParameter trans Value");
					var oTranslateField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oTranslateField.getAggregation("_field").getText() === "StringParameter Value Trans in i18n", "Field: Translation ori Value");
					oTranslateField = this.oEditor.getAggregation("_formContent")[7];
					assert.ok(oTranslateField.getAggregation("_field").getValue() === "StringParameter Value Trans Translation1", "Field: Translation trans Value");
					var oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[9];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getText() === "StringParameter Value Trans in i18n", "Field: Translation i18n ori Value");
					oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getValue() === "StringParameter Value Trans Translation2", "Field: Translation i18n trans Value");
					var oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getText() === "Value: stringParameter Value", "Field: Normol parameter syntax Value");
					oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[13];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxNormal Value Translation", "Field: Normol parameter syntax trans Value");
					var oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[15];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getText() === "Value: StringParameter Value Trans in i18n", "Field: parameter syntax to translate Value");
					oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTranslate Value Translation", "Field: parameter syntax to translate trans Value");
					var oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getText() === "Value: StringParameter Value Trans in i18n", "Field: parameter syntax to translate in i18n format Value");
					oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[19];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToI18nTranslate Value Translation", "Field: parameter syntax to translate in i18n format trans Value");
					var oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[21];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getText() === "Value: {{parameters.TODAY_ISO}}", "Field: parameter syntax to TODAY_ISO Value");
					oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[22];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTODAY_ISO Value Translation", "Field: parameter syntax to TODAY_ISO trans Value");
					var oNowSyntaxField = this.oEditor.getAggregation("_formContent")[24];
					assert.ok(oNowSyntaxField.getAggregation("_field").getText() === "Value: {{parameters.NOW_ISO}}", "Field: parameter syntax to NOW_ISO Value");
					oNowSyntaxField = this.oEditor.getAggregation("_formContent")[25];
					assert.ok(oNowSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToNOW_ISO Value Translation", "Field: parameter syntax to NOW_ISO trans Value");
					var oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[27];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getText() === "Value: {{parameters.LOCALE}}", "Field: parameter syntax to LOCALE Value");
					oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[28];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToLOCALE Value Translation", "Field: parameter syntax to LOCALE trans Value");
					var oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[30];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getText() === "Mixed value: stringParameter Value, StringParameter Value Trans in i18n, StringParameter Value Trans in i18n, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs Value");
					oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[31];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntax_mixed Value Translation", "Field: mixed parameter syntaxs trans Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter and self change from Admin and Content 1", function (assert) {
			var adminchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Admin",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Admin1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Admin2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Admin",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Admin",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Content",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Content1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Content2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Content",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Content",
				":layer": 5,
				":errors": false
			};
			var translationchanges = {};
			this.oEditor.setMode("translation");
			this.oEditor.setLanguage("fr");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oStringrField = this.oEditor.getAggregation("_formContent")[3];
					assert.ok(oStringrField.getAggregation("_field").getText() === "stringParameter Value Content", "Field: stringParameter ori Value");
					oStringrField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oStringrField.getAggregation("_field").getValue() === "stringParameter Value Content", "Field: stringParameter trans Value");
					var oTranslateField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oTranslateField.getAggregation("_field").getText() === "StringParameter Value Trans Content1", "Field: Translation ori Value");
					oTranslateField = this.oEditor.getAggregation("_formContent")[7];
					assert.ok(oTranslateField.getAggregation("_field").getValue() === "StringParameter Value Trans Content1", "Field: Translation trans Value");
					var oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[9];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getText() === "StringParameter Value Trans Content2", "Field: Translation i18n ori Value");
					oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getValue() === "StringParameter Value Trans Content2", "Field: Translation i18n trans Value");
					var oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxNormal Value Content", "Field: Normol parameter syntax Value");
					oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[13];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxNormal Value Content", "Field: Normol parameter syntax trans Value");
					var oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[15];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToTranslate Value Content", "Field: parameter syntax to translate Value");
					oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTranslate Value Content", "Field: parameter syntax to translate trans Value");
					var oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToI18nTranslate Value Content", "Field: parameter syntax to translate in i18n format Value");
					oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[19];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToI18nTranslate Value Content", "Field: parameter syntax to translate in i18n format trans Value");
					var oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[21];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToTODAY_ISO Value Content", "Field: parameter syntax to TODAY_ISO Value");
					oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[22];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTODAY_ISO Value Content", "Field: parameter syntax to TODAY_ISO trans Value");
					var oNowSyntaxField = this.oEditor.getAggregation("_formContent")[24];
					assert.ok(oNowSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToNOW_ISO Value Content", "Field: parameter syntax to NOW_ISO Value");
					oNowSyntaxField = this.oEditor.getAggregation("_formContent")[25];
					assert.ok(oNowSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToNOW_ISO Value Content", "Field: parameter syntax to NOW_ISO trans Value");
					var oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[27];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToLOCALE Value Content", "Field: parameter syntax to LOCALE Value");
					oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[28];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToLOCALE Value Content", "Field: parameter syntax to LOCALE trans Value");
					var oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[30];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntax_mixed Value Content", "Field: mixed parameter syntaxs Value");
					oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[31];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntax_mixed Value Content", "Field: mixed parameter syntaxs trans Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter and self change from Admin and Content 2", function (assert) {
			var adminchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Admin",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Admin1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Admin2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Admin",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Content",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Content2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Content",
				":layer": 5,
				":errors": false
			};
			var translationchanges = {};
			this.oEditor.setMode("translation");
			this.oEditor.setLanguage("fr");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oStringrField = this.oEditor.getAggregation("_formContent")[3];
					assert.ok(oStringrField.getAggregation("_field").getText() === "stringParameter Value Content", "Field: stringParameter ori Value");
					oStringrField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oStringrField.getAggregation("_field").getValue() === "stringParameter Value Content", "Field: stringParameter trans Value");
					var oTranslateField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oTranslateField.getAggregation("_field").getText() === "StringParameter Value Trans Admin1", "Field: Translation ori Value");
					oTranslateField = this.oEditor.getAggregation("_formContent")[7];
					assert.ok(oTranslateField.getAggregation("_field").getValue() === "StringParameter Value Trans Admin1", "Field: Translation trans Value");
					var oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[9];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getText() === "StringParameter Value Trans Content2", "Field: Translation i18n ori Value");
					oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getValue() === "StringParameter Value Trans Content2", "Field: Translation i18n trans Value");
					var oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxNormal Value Content", "Field: Normol parameter syntax Value");
					oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[13];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxNormal Value Content", "Field: Normol parameter syntax trans Value");
					var oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[15];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToTranslate Value Admin", "Field: parameter syntax to translate Value");
					oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTranslate Value Admin", "Field: parameter syntax to translate trans Value");
					var oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToI18nTranslate Value Content", "Field: parameter syntax to translate in i18n format Value");
					oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[19];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToI18nTranslate Value Content", "Field: parameter syntax to translate in i18n format trans Value");
					var oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[21];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToTODAY_ISO Value Admin", "Field: parameter syntax to TODAY_ISO Value");
					oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[22];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTODAY_ISO Value Admin", "Field: parameter syntax to TODAY_ISO trans Value");
					var oNowSyntaxField = this.oEditor.getAggregation("_formContent")[24];
					assert.ok(oNowSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToNOW_ISO Value Content", "Field: parameter syntax to NOW_ISO Value");
					oNowSyntaxField = this.oEditor.getAggregation("_formContent")[25];
					assert.ok(oNowSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToNOW_ISO Value Content", "Field: parameter syntax to NOW_ISO trans Value");
					var oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[27];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToLOCALE Value Content", "Field: parameter syntax to LOCALE Value");
					oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[28];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToLOCALE Value Content", "Field: parameter syntax to LOCALE trans Value");
					var oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[30];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getText() === "Mixed value: stringParameter Value Content, StringParameter Value Trans Admin1, StringParameter Value Trans Content2, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs Value");
					oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[31];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getValue() === "Mixed value: stringParameter Value Content, StringParameter Value Trans Admin1, StringParameter Value Trans Content2, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs trans Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter and self change from Admin and Content 3", function (assert) {
			var adminchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Admin",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Admin2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Admin",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Content",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Content2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Content",
				":layer": 5,
				":errors": false
			};
			var translationchanges = {};
			this.oEditor.setMode("translation");
			this.oEditor.setLanguage("fr");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oStringrField = this.oEditor.getAggregation("_formContent")[3];
					assert.ok(oStringrField.getAggregation("_field").getText() === "stringParameter Value Content", "Field: stringParameter ori Value");
					oStringrField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oStringrField.getAggregation("_field").getValue() === "stringParameter Value Content", "Field: stringParameter trans Value");
					var oTranslateField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oTranslateField.getAggregation("_field").getText() === "StringParameter Value Trans in i18n", "Field: Translation ori Value");
					oTranslateField = this.oEditor.getAggregation("_formContent")[7];
					assert.ok(oTranslateField.getAggregation("_field").getValue() === "StringParameter Value Trans in i18n France", "Field: Translation trans Value");
					var oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[9];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getText() === "StringParameter Value Trans Content2", "Field: Translation i18n ori Value");
					oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getValue() === "StringParameter Value Trans Content2", "Field: Translation i18n trans Value");
					var oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxNormal Value Content", "Field: Normol parameter syntax Value");
					oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[13];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxNormal Value Content", "Field: Normol parameter syntax trans Value");
					var oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[15];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToTranslate Value Admin", "Field: parameter syntax to translate Value");
					oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTranslate Value Admin", "Field: parameter syntax to translate trans Value");
					var oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToI18nTranslate Value Content", "Field: parameter syntax to translate in i18n format Value");
					oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[19];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToI18nTranslate Value Content", "Field: parameter syntax to translate in i18n format trans Value");
					var oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[21];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToTODAY_ISO Value Admin", "Field: parameter syntax to TODAY_ISO Value");
					oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[22];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTODAY_ISO Value Admin", "Field: parameter syntax to TODAY_ISO trans Value");
					var oNowSyntaxField = this.oEditor.getAggregation("_formContent")[24];
					assert.ok(oNowSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToNOW_ISO Value Content", "Field: parameter syntax to NOW_ISO Value");
					oNowSyntaxField = this.oEditor.getAggregation("_formContent")[25];
					assert.ok(oNowSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToNOW_ISO Value Content", "Field: parameter syntax to NOW_ISO trans Value");
					var oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[27];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToLOCALE Value Content", "Field: parameter syntax to LOCALE Value");
					oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[28];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToLOCALE Value Content", "Field: parameter syntax to LOCALE trans Value");
					var oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[30];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getText() === "Mixed value: stringParameter Value Content, StringParameter Value Trans in i18n, StringParameter Value Trans Content2, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs Value");
					oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[31];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getValue() === "Mixed value: stringParameter Value Content, StringParameter Value Trans in i18n France, StringParameter Value Trans Content2, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs trans Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter and self change from Admin and Translate 1", function (assert) {
			var adminchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Admin",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Admin1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Admin2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Admin",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Admin",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {};
			var translationchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Translation",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Translation1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Translation2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Translation",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Translation",
				":layer": 10,
				":errors": false
			};
			this.oEditor.setMode("translation");
			this.oEditor.setLanguage("fr");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oStringrField = this.oEditor.getAggregation("_formContent")[3];
					assert.ok(oStringrField.getAggregation("_field").getText() === "stringParameter Value Admin", "Field: stringParameter ori Value");
					oStringrField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oStringrField.getAggregation("_field").getValue() === "stringParameter Value Translation", "Field: stringParameter trans Value");
					var oTranslateField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oTranslateField.getAggregation("_field").getText() === "StringParameter Value Trans Admin1", "Field: Translation ori Value");
					oTranslateField = this.oEditor.getAggregation("_formContent")[7];
					assert.ok(oTranslateField.getAggregation("_field").getValue() === "StringParameter Value Trans Translation1", "Field: Translation trans Value");
					var oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[9];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getText() === "StringParameter Value Trans Admin2", "Field: Translation i18n ori Value");
					oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getValue() === "StringParameter Value Trans Translation2", "Field: Translation i18n trans Value");
					var oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxNormal Value Admin", "Field: Normol parameter syntax Value");
					oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[13];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxNormal Value Translation", "Field: Normol parameter syntax trans Value");
					var oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[15];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToTranslate Value Admin", "Field: parameter syntax to translate Value");
					oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTranslate Value Translation", "Field: parameter syntax to translate trans Value");
					var oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToI18nTranslate Value Admin", "Field: parameter syntax to translate in i18n format Value");
					oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[19];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToI18nTranslate Value Translation", "Field: parameter syntax to translate in i18n format trans Value");
					var oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[21];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToTODAY_ISO Value Admin", "Field: parameter syntax to TODAY_ISO Value");
					oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[22];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTODAY_ISO Value Translation", "Field: parameter syntax to TODAY_ISO trans Value");
					var oNowSyntaxField = this.oEditor.getAggregation("_formContent")[24];
					assert.ok(oNowSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToNOW_ISO Value Admin", "Field: parameter syntax to NOW_ISO Value");
					oNowSyntaxField = this.oEditor.getAggregation("_formContent")[25];
					assert.ok(oNowSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToNOW_ISO Value Translation", "Field: parameter syntax to NOW_ISO trans Value");
					var oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[27];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToLOCALE Value Admin", "Field: parameter syntax to LOCALE Value");
					oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[28];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToLOCALE Value Translation", "Field: parameter syntax to LOCALE trans Value");
					var oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[30];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntax_mixed Value Admin", "Field: mixed parameter syntaxs Value");
					oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[31];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntax_mixed Value Translation", "Field: mixed parameter syntaxs trans Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter and self change from Admin and Translate 2", function (assert) {
			var adminchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Admin",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Admin1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Admin2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Admin",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {};
			var translationchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Translation",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Translation2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Translation",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Translation",
				":layer": 10,
				":errors": false
			};
			this.oEditor.setMode("translation");
			this.oEditor.setLanguage("fr");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oStringrField = this.oEditor.getAggregation("_formContent")[3];
					assert.ok(oStringrField.getAggregation("_field").getText() === "stringParameter Value Admin", "Field: stringParameter ori Value");
					oStringrField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oStringrField.getAggregation("_field").getValue() === "stringParameter Value Translation", "Field: stringParameter trans Value");
					var oTranslateField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oTranslateField.getAggregation("_field").getText() === "StringParameter Value Trans Admin1", "Field: Translation ori Value");
					oTranslateField = this.oEditor.getAggregation("_formContent")[7];
					assert.ok(oTranslateField.getAggregation("_field").getValue() === "StringParameter Value Trans Admin1", "Field: Translation trans Value");
					var oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[9];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getText() === "StringParameter Value Trans Admin2", "Field: Translation i18n ori Value");
					oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getValue() === "StringParameter Value Trans Translation2", "Field: Translation i18n trans Value");
					var oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxNormal Value Admin", "Field: Normol parameter syntax Value");
					oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[13];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxNormal Value Translation", "Field: Normol parameter syntax trans Value");
					var oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[15];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getText() === "Value: StringParameter Value Trans Admin1", "Field: parameter syntax to translate Value");
					oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans Admin1", "Field: parameter syntax to translate trans Value");
					var oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToI18nTranslate Value Admin", "Field: parameter syntax to translate in i18n format Value");
					oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[19];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToI18nTranslate Value Translation", "Field: parameter syntax to translate in i18n format trans Value");
					var oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[21];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToTODAY_ISO Value Admin", "Field: parameter syntax to TODAY_ISO Value");
					oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[22];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTODAY_ISO Value Translation", "Field: parameter syntax to TODAY_ISO trans Value");
					var oNowSyntaxField = this.oEditor.getAggregation("_formContent")[24];
					assert.ok(oNowSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToNOW_ISO Value Admin", "Field: parameter syntax to NOW_ISO Value");
					oNowSyntaxField = this.oEditor.getAggregation("_formContent")[25];
					assert.ok(oNowSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToNOW_ISO Value Translation", "Field: parameter syntax to NOW_ISO trans Value");
					var oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[27];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToLOCALE Value Admin", "Field: parameter syntax to LOCALE Value");
					oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[28];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToLOCALE Value Translation", "Field: parameter syntax to LOCALE trans Value");
					var oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[30];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getText() === "Mixed value: stringParameter Value Admin, StringParameter Value Trans Admin1, StringParameter Value Trans Admin2, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs Value");
					oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[31];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntax_mixed Value Translation", "Field: mixed parameter syntaxs trans Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter and self change from Content and Translate 1", function (assert) {
			var adminchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Content",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Content1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Content2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Content",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Content",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {};
			var translationchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Translation",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Translation1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Translation2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Translation",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Translation",
				":layer": 10,
				":errors": false
			};
			this.oEditor.setMode("translation");
			this.oEditor.setLanguage("fr");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oStringrField = this.oEditor.getAggregation("_formContent")[3];
					assert.ok(oStringrField.getAggregation("_field").getText() === "stringParameter Value Content", "Field: stringParameter ori Value");
					oStringrField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oStringrField.getAggregation("_field").getValue() === "stringParameter Value Translation", "Field: stringParameter trans Value");
					var oTranslateField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oTranslateField.getAggregation("_field").getText() === "StringParameter Value Trans Content1", "Field: Translation ori Value");
					oTranslateField = this.oEditor.getAggregation("_formContent")[7];
					assert.ok(oTranslateField.getAggregation("_field").getValue() === "StringParameter Value Trans Translation1", "Field: Translation trans Value");
					var oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[9];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getText() === "StringParameter Value Trans Content2", "Field: Translation i18n ori Value");
					oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getValue() === "StringParameter Value Trans Translation2", "Field: Translation i18n trans Value");
					var oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxNormal Value Content", "Field: Normol parameter syntax Value");
					oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[13];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxNormal Value Translation", "Field: Normol parameter syntax trans Value");
					var oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[15];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToTranslate Value Content", "Field: parameter syntax to translate Value");
					oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTranslate Value Translation", "Field: parameter syntax to translate trans Value");
					var oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToI18nTranslate Value Content", "Field: parameter syntax to translate in i18n format Value");
					oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[19];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToI18nTranslate Value Translation", "Field: parameter syntax to translate in i18n format trans Value");
					var oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[21];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToTODAY_ISO Value Content", "Field: parameter syntax to TODAY_ISO Value");
					oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[22];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTODAY_ISO Value Translation", "Field: parameter syntax to TODAY_ISO trans Value");
					var oNowSyntaxField = this.oEditor.getAggregation("_formContent")[24];
					assert.ok(oNowSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToNOW_ISO Value Content", "Field: parameter syntax to NOW_ISO Value");
					oNowSyntaxField = this.oEditor.getAggregation("_formContent")[25];
					assert.ok(oNowSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToNOW_ISO Value Translation", "Field: parameter syntax to NOW_ISO trans Value");
					var oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[27];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToLOCALE Value Content", "Field: parameter syntax to LOCALE Value");
					oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[28];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToLOCALE Value Translation", "Field: parameter syntax to LOCALE trans Value");
					var oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[30];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntax_mixed Value Content", "Field: mixed parameter syntaxs Value");
					oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[31];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntax_mixed Value Translation", "Field: mixed parameter syntaxs trans Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter and self change from Content and Translate 2", function (assert) {
			var adminchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Content",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Content1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Content2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Content",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {};
			var translationchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Translation",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Translation2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Translation",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Translation",
				":layer": 10,
				":errors": false
			};
			this.oEditor.setMode("translation");
			this.oEditor.setLanguage("fr");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oStringrField = this.oEditor.getAggregation("_formContent")[3];
					assert.ok(oStringrField.getAggregation("_field").getText() === "stringParameter Value Content", "Field: stringParameter ori Value");
					oStringrField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oStringrField.getAggregation("_field").getValue() === "stringParameter Value Translation", "Field: stringParameter trans Value");
					var oTranslateField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oTranslateField.getAggregation("_field").getText() === "StringParameter Value Trans Content1", "Field: Translation ori Value");
					oTranslateField = this.oEditor.getAggregation("_formContent")[7];
					assert.ok(oTranslateField.getAggregation("_field").getValue() === "StringParameter Value Trans Content1", "Field: Translation trans Value");
					var oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[9];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getText() === "StringParameter Value Trans Content2", "Field: Translation i18n ori Value");
					oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getValue() === "StringParameter Value Trans Translation2", "Field: Translation i18n trans Value");
					var oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxNormal Value Content", "Field: Normol parameter syntax Value");
					oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[13];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxNormal Value Translation", "Field: Normol parameter syntax trans Value");
					var oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[15];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getText() === "Value: StringParameter Value Trans Content1", "Field: parameter syntax to translate Value");
					oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans Content1", "Field: parameter syntax to translate trans Value");
					var oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToI18nTranslate Value Content", "Field: parameter syntax to translate in i18n format Value");
					oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[19];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToI18nTranslate Value Translation", "Field: parameter syntax to translate in i18n format trans Value");
					var oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[21];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToTODAY_ISO Value Content", "Field: parameter syntax to TODAY_ISO Value");
					oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[22];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTODAY_ISO Value Translation", "Field: parameter syntax to TODAY_ISO trans Value");
					var oNowSyntaxField = this.oEditor.getAggregation("_formContent")[24];
					assert.ok(oNowSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToNOW_ISO Value Content", "Field: parameter syntax to NOW_ISO Value");
					oNowSyntaxField = this.oEditor.getAggregation("_formContent")[25];
					assert.ok(oNowSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToNOW_ISO Value Translation", "Field: parameter syntax to NOW_ISO trans Value");
					var oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[27];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToLOCALE Value Content", "Field: parameter syntax to LOCALE Value");
					oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[28];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToLOCALE Value Translation", "Field: parameter syntax to LOCALE trans Value");
					var oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[30];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getText() === "Mixed value: stringParameter Value Content, StringParameter Value Trans Content1, StringParameter Value Trans Content2, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs Value");
					oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[31];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntax_mixed Value Translation", "Field: mixed parameter syntaxs trans Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter and self change from Admin, Content and Translate 1", function (assert) {
			var adminchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Admin",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Admin1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Admin2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Admin",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Admin",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Content",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Content1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Content2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Content",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Content",
				":layer": 5,
				":errors": false
			};
			var translationchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Translation",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Translation1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Translation2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Translation",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Translation",
				":layer": 10,
				":errors": false
			};
			this.oEditor.setMode("translation");
			this.oEditor.setLanguage("fr");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oStringrField = this.oEditor.getAggregation("_formContent")[3];
					assert.ok(oStringrField.getAggregation("_field").getText() === "stringParameter Value Content", "Field: stringParameter ori Value");
					oStringrField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oStringrField.getAggregation("_field").getValue() === "stringParameter Value Translation", "Field: stringParameter trans Value");
					var oTranslateField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oTranslateField.getAggregation("_field").getText() === "StringParameter Value Trans Content1", "Field: Translation ori Value");
					oTranslateField = this.oEditor.getAggregation("_formContent")[7];
					assert.ok(oTranslateField.getAggregation("_field").getValue() === "StringParameter Value Trans Translation1", "Field: Translation trans Value");
					var oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[9];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getText() === "StringParameter Value Trans Content2", "Field: Translation i18n ori Value");
					oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getValue() === "StringParameter Value Trans Translation2", "Field: Translation i18n trans Value");
					var oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxNormal Value Content", "Field: Normol parameter syntax Value");
					oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[13];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxNormal Value Translation", "Field: Normol parameter syntax trans Value");
					var oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[15];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToTranslate Value Content", "Field: parameter syntax to translate Value");
					oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTranslate Value Translation", "Field: parameter syntax to translate trans Value");
					var oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToI18nTranslate Value Content", "Field: parameter syntax to translate in i18n format Value");
					oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[19];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToI18nTranslate Value Translation", "Field: parameter syntax to translate in i18n format trans Value");
					var oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[21];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToTODAY_ISO Value Content", "Field: parameter syntax to TODAY_ISO Value");
					oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[22];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTODAY_ISO Value Translation", "Field: parameter syntax to TODAY_ISO trans Value");
					var oNowSyntaxField = this.oEditor.getAggregation("_formContent")[24];
					assert.ok(oNowSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToNOW_ISO Value Content", "Field: parameter syntax to NOW_ISO Value");
					oNowSyntaxField = this.oEditor.getAggregation("_formContent")[25];
					assert.ok(oNowSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToNOW_ISO Value Translation", "Field: parameter syntax to NOW_ISO trans Value");
					var oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[27];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToLOCALE Value Content", "Field: parameter syntax to LOCALE Value");
					oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[28];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToLOCALE Value Translation", "Field: parameter syntax to LOCALE trans Value");
					var oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[30];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntax_mixed Value Content", "Field: mixed parameter syntaxs Value");
					oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[31];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntax_mixed Value Translation", "Field: mixed parameter syntaxs trans Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter and self change from Admin, Content and Translate 2", function (assert) {
			var adminchanges = {
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Admin1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Admin2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Admin",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Admin",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Content",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Content2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Content",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Content",
				":layer": 5,
				":errors": false
			};
			var translationchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Translation",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Translation1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Translation2",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Translation",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Translation",
				":layer": 10,
				":errors": false
			};
			this.oEditor.setMode("translation");
			this.oEditor.setLanguage("fr");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oStringrField = this.oEditor.getAggregation("_formContent")[3];
					assert.ok(oStringrField.getAggregation("_field").getText() === "stringParameter Value Content", "Field: stringParameter ori Value");
					oStringrField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oStringrField.getAggregation("_field").getValue() === "stringParameter Value Translation", "Field: stringParameter trans Value");
					var oTranslateField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oTranslateField.getAggregation("_field").getText() === "StringParameter Value Trans Admin1", "Field: Translation ori Value");
					oTranslateField = this.oEditor.getAggregation("_formContent")[7];
					assert.ok(oTranslateField.getAggregation("_field").getValue() === "StringParameter Value Trans Translation1", "Field: Translation trans Value");
					var oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[9];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getText() === "StringParameter Value Trans Content2", "Field: Translation i18n ori Value");
					oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getValue() === "StringParameter Value Trans Translation2", "Field: Translation i18n trans Value");
					var oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxNormal Value Content", "Field: Normol parameter syntax Value");
					oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[13];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxNormal Value Content", "Field: Normol parameter syntax trans Value");
					var oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[15];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToTranslate Value Content", "Field: parameter syntax to translate Value");
					oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTranslate Value Translation", "Field: parameter syntax to translate trans Value");
					var oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToI18nTranslate Value Content", "Field: parameter syntax to translate in i18n format Value");
					oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[19];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToI18nTranslate Value Translation", "Field: parameter syntax to translate in i18n format trans Value");
					var oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[21];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToTODAY_ISO Value Content", "Field: parameter syntax to TODAY_ISO Value");
					oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[22];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTODAY_ISO Value Translation", "Field: parameter syntax to TODAY_ISO trans Value");
					var oNowSyntaxField = this.oEditor.getAggregation("_formContent")[24];
					assert.ok(oNowSyntaxField.getAggregation("_field").getText() === "Value: {{parameters.NOW_ISO}}", "Field: parameter syntax to NOW_ISO Value");
					oNowSyntaxField = this.oEditor.getAggregation("_formContent")[25];
					assert.ok(oNowSyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.NOW_ISO}}", "Field: parameter syntax to NOW_ISO trans Value");
					var oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[27];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntaxToLOCALE Value Content", "Field: parameter syntax to LOCALE Value");
					oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[28];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntaxToLOCALE Value Translation", "Field: parameter syntax to LOCALE trans Value");
					var oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[30];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getText() === "Value: parameterSyntax_mixed Value Content", "Field: mixed parameter syntaxs Value");
					oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[31];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getValue() === "Value: parameterSyntax_mixed Value Translation", "Field: mixed parameter syntaxs trans Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});
	});

	QUnit.module("All Mode", {
		beforeEach: function () {
			this.oHost = new Host("host");
			this.oContextHost = new ContextHost("contexthost");

			this.oEditor = new Editor();
			var oContent = document.getElementById("content");
			if (!oContent) {
				oContent = document.createElement("div");
				oContent.setAttribute("id", "content");
				document.body.appendChild(oContent);
				document.body.style.zIndex = 1000;
			}
			this.oEditor.placeAt(oContent);
		},
		afterEach: function () {
			this.oEditor.destroy();
			this.oHost.destroy();
			this.oContextHost.destroy();
			sandbox.restore();
			var oContent = document.getElementById("content");
			if (oContent) {
				oContent.innerHTML = "";
				document.body.style.zIndex = "unset";
			}
		}
	}, function () {
		QUnit.test("Default without change", function (assert) {
			this.oEditor.setMode("all");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oStringrField = this.oEditor.getAggregation("_formContent")[2];
					assert.ok(oStringrField.getAggregation("_field").getValue() === "stringParameter Value", "Field: stringParameter Value");
					var oTranslateField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oTranslateField.getAggregation("_field").getValue() === "StringParameter Value Trans in i18n", "Field: Translation Value");
					var oTranslateInI18nField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oTranslateInI18nField.getAggregation("_field").getValue() === "StringParameter Value Trans in i18n", "Field: Translation i18n Value");
					var oNormalSyntaxField = this.oEditor.getAggregation("_formContent")[8];
					assert.ok(oNormalSyntaxField.getAggregation("_field").getValue() === "Value: stringParameter Value", "Field: Normol parameter syntax Value");
					var oTranslateSyntaxField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oTranslateSyntaxField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans in i18n", "Field: parameter syntax to translate Value");
					var oTranslateInI18nSyntaxField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans in i18n", "Field: parameter syntax to translate in i18n format Value");
					var oTodaySyntaxField = this.oEditor.getAggregation("_formContent")[14];
					assert.ok(oTodaySyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.TODAY_ISO}}", "Field: parameter syntax to TODAY_ISO Value");
					var oNowSyntaxField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oNowSyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.NOW_ISO}}", "Field: parameter syntax to NOW_ISO Value");
					var oLocaleSyntaxField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oLocaleSyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.LOCALE}}", "Field: parameter syntax to LOCALE Value");
					var oMixedSyntaxField = this.oEditor.getAggregation("_formContent")[20];
					assert.ok(oMixedSyntaxField.getAggregation("_field").getValue() === "Mixed value: stringParameter Value, StringParameter Value Trans in i18n, StringParameter Value Trans in i18n, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs Value");
					var oToday1SyntaxField = this.oEditor.getAggregation("_formContent")[22];
					assert.ok(oToday1SyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.TODAY_ISO1}}", "Field: parameter syntax to TODAY_ISO1 Value");
					var oNow1SyntaxField = this.oEditor.getAggregation("_formContent")[24];
					assert.ok(oNow1SyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.NOW_ISO1}}", "Field: parameter syntax to NOW_ISO1 Value");
					var oLocale1SyntaxField = this.oEditor.getAggregation("_formContent")[26];
					assert.ok(oLocale1SyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.LOCALE1}}", "Field: parameter syntax to LOCALE1 Value");
					var oToday2SyntaxField = this.oEditor.getAggregation("_formContent")[30];
					assert.ok(oToday2SyntaxField.getAggregation("_field").getValue() === "Value: TODAY_ISO2", "Field: parameter syntax to TODAY_ISO2 Value");
					var oNow2SyntaxField = this.oEditor.getAggregation("_formContent")[34];
					assert.ok(oNow2SyntaxField.getAggregation("_field").getValue() === "Value: NOW_ISO2", "Field: parameter syntax to NOW_ISO2 Value");
					var oLocale2SyntaxField = this.oEditor.getAggregation("_formContent")[38];
					assert.ok(oLocale2SyntaxField.getAggregation("_field").getValue() === "Value: LOCALE2", "Field: parameter syntax to LOCALE2 Value");

					oStringrField.getAggregation("_field").setValue("stringParameter New Value");
					oTranslateField.getAggregation("_field").setValue("StringParameter Value Trans New Value");
					oTranslateInI18nField.getAggregation("_field").setValue("StringParameter Value Trans in i18n New Value");
					wait(1000).then(function () {
						assert.ok(oNormalSyntaxField.getAggregation("_field").getValue() === "Value: stringParameter New Value", "Field: Normol parameter syntax New Value");
						assert.ok(oTranslateSyntaxField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans New Value", "Field: parameter syntax to translate New Value");
						assert.ok(oTranslateInI18nSyntaxField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans in i18n New Value", "Field: parameter syntax to translate New Value");
						assert.ok(oTodaySyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.TODAY_ISO}}", "Field: parameter syntax to TODAY_ISO");
						assert.ok(oNowSyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.NOW_ISO}}", "Field: parameter syntax to NOW_ISO");
						assert.ok(oLocaleSyntaxField.getAggregation("_field").getValue() === "Value: {{parameters.LOCALE}}", "Field: parameter syntax to LOCALE");
						assert.ok(oMixedSyntaxField.getAggregation("_field").getValue() === "Mixed value: stringParameter New Value, StringParameter Value Trans New Value, StringParameter Value Trans in i18n New Value, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs New Value");
						resolve();
					});
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter change from Admin", function (assert) {
			var adminchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Admin",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Admin1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Admin2",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {};
			var translationchanges = {};
			this.oEditor.setMode("all");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oField = this.oEditor.getAggregation("_formContent")[2];
					assert.ok(oField.getAggregation("_field").getValue() === "stringParameter Value Admin", "Field: String Value");
					oField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Admin1", "Field: Translation Value");
					oField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Admin2", "Field: Translation i18n Value");
					oField = this.oEditor.getAggregation("_formContent")[8];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: stringParameter Value Admin", "Field: Normol parameter syntax Value");
					oField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans Admin1", "Field: parameter syntax to translate Value");
					oField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans Admin2", "Field: parameter syntax to translate in i18n format Value");
					oField = this.oEditor.getAggregation("_formContent")[14];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: {{parameters.TODAY_ISO}}", "Field: parameter syntax to TODAY_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: {{parameters.NOW_ISO}}", "Field: parameter syntax to NOW_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: {{parameters.LOCALE}}", "Field: parameter syntax to LOCALE Value");
					oField = this.oEditor.getAggregation("_formContent")[20];
					assert.ok(oField.getAggregation("_field").getValue() === "Mixed value: stringParameter Value Admin, StringParameter Value Trans Admin1, StringParameter Value Trans Admin2, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter and self change from Admin", function (assert) {
			var adminchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Admin",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Admin1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Admin2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Admin",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Admin",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {};
			var translationchanges = {};
			this.oEditor.setMode("all");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oField = this.oEditor.getAggregation("_formContent")[2];
					assert.ok(oField.getAggregation("_field").getValue() === "stringParameter Value Admin", "Field: String Value");
					oField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Admin1", "Field: Translation Value");
					oField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Admin2", "Field: Translation i18n Value");
					oField = this.oEditor.getAggregation("_formContent")[8];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxNormal Value Admin", "Field: Normol parameter syntax Value");
					oField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTranslate Value Admin", "Field: parameter syntax to translate Value");
					oField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToI18nTranslate Value Admin", "Field: parameter syntax to translate in i18n format Value");
					oField = this.oEditor.getAggregation("_formContent")[14];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTODAY_ISO Value Admin", "Field: parameter syntax to TODAY_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToNOW_ISO Value Admin", "Field: parameter syntax to NOW_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToLOCALE Value Admin", "Field: parameter syntax to LOCALE Value");
					oField = this.oEditor.getAggregation("_formContent")[20];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntax_mixed Value Admin", "Field: mixed parameter syntaxs Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter change from Content", function (assert) {
			var adminchanges = {};
			var contentchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Content",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Content1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Content2",
				":layer": 5,
				":errors": false
			};
			var translationchanges = {};
			this.oEditor.setMode("all");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oField = this.oEditor.getAggregation("_formContent")[2];
					assert.ok(oField.getAggregation("_field").getValue() === "stringParameter Value Content", "Field: String Value");
					oField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Content1", "Field: Translation Value");
					oField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Content2", "Field: Translation i18n Value");
					oField = this.oEditor.getAggregation("_formContent")[8];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: stringParameter Value Content", "Field: Normol parameter syntax Value");
					oField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans Content1", "Field: parameter syntax to translate Value");
					oField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans Content2", "Field: parameter syntax to translate in i18n format Value");
					oField = this.oEditor.getAggregation("_formContent")[14];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: {{parameters.TODAY_ISO}}", "Field: parameter syntax to TODAY_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: {{parameters.NOW_ISO}}", "Field: parameter syntax to NOW_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: {{parameters.LOCALE}}", "Field: parameter syntax to LOCALE Value");
					oField = this.oEditor.getAggregation("_formContent")[20];
					assert.ok(oField.getAggregation("_field").getValue() === "Mixed value: stringParameter Value Content, StringParameter Value Trans Content1, StringParameter Value Trans Content2, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter and self change from Content", function (assert) {
			var adminchanges = {};
			var contentchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Content",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Content1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Content2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Content",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Content",
				":layer": 5,
				":errors": false
			};
			var translationchanges = {};
			this.oEditor.setMode("all");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oField = this.oEditor.getAggregation("_formContent")[2];
					assert.ok(oField.getAggregation("_field").getValue() === "stringParameter Value Content", "Field: String Value");
					oField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Content1", "Field: Translation Value");
					oField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Content2", "Field: Translation i18n Value");
					oField = this.oEditor.getAggregation("_formContent")[8];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxNormal Value Content", "Field: Normol parameter syntax Value");
					oField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTranslate Value Content", "Field: parameter syntax to translate Value");
					oField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToI18nTranslate Value Content", "Field: parameter syntax to translate in i18n format Value");
					oField = this.oEditor.getAggregation("_formContent")[14];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTODAY_ISO Value Content", "Field: parameter syntax to TODAY_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToNOW_ISO Value Content", "Field: parameter syntax to NOW_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToLOCALE Value Content", "Field: parameter syntax to LOCALE Value");
					oField = this.oEditor.getAggregation("_formContent")[20];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntax_mixed Value Content", "Field: mixed parameter syntaxs Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter change from Translate", function (assert) {
			var adminchanges = {};
			var contentchanges = {};
			var translationchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Translation",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Translation1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Translation2",
				":layer": 10,
				":errors": false
			};
			this.oEditor.setMode("all");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oField = this.oEditor.getAggregation("_formContent")[2];
					assert.ok(oField.getAggregation("_field").getValue() === "stringParameter Value Translation", "Field: String Value");
					oField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Translation1", "Field: Translation Value");
					oField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Translation2", "Field: Translation i18n Value");
					oField = this.oEditor.getAggregation("_formContent")[8];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: stringParameter Value Translation", "Field: Normol parameter syntax Value");
					oField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans Translation1", "Field: parameter syntax to translate Value");
					oField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans Translation2", "Field: parameter syntax to translate in i18n format Value");
					oField = this.oEditor.getAggregation("_formContent")[14];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: {{parameters.TODAY_ISO}}", "Field: parameter syntax to TODAY_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: {{parameters.NOW_ISO}}", "Field: parameter syntax to NOW_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: {{parameters.LOCALE}}", "Field: parameter syntax to LOCALE Value");
					oField = this.oEditor.getAggregation("_formContent")[20];
					assert.ok(oField.getAggregation("_field").getValue() === "Mixed value: stringParameter Value Translation, StringParameter Value Trans Translation1, StringParameter Value Trans Translation2, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter and self change from Translate", function (assert) {
			var adminchanges = {};
			var contentchanges = {};
			var translationchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Translation",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Translation1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Translation2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Translation",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Translation",
				":layer": 10,
				":errors": false
			};
			this.oEditor.setMode("all");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oField = this.oEditor.getAggregation("_formContent")[2];
					assert.ok(oField.getAggregation("_field").getValue() === "stringParameter Value Translation", "Field: String Value");
					oField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Translation1", "Field: Translation Value");
					oField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Translation2", "Field: Translation i18n Value");
					oField = this.oEditor.getAggregation("_formContent")[8];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxNormal Value Translation", "Field: Normol parameter syntax Value");
					oField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTranslate Value Translation", "Field: parameter syntax to translate Value");
					oField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToI18nTranslate Value Translation", "Field: parameter syntax to translate in i18n format Value");
					oField = this.oEditor.getAggregation("_formContent")[14];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTODAY_ISO Value Translation", "Field: parameter syntax to TODAY_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToNOW_ISO Value Translation", "Field: parameter syntax to NOW_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToLOCALE Value Translation", "Field: parameter syntax to LOCALE Value");
					oField = this.oEditor.getAggregation("_formContent")[20];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntax_mixed Value Translation", "Field: mixed parameter syntaxs Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter change from Admin and Content", function (assert) {
			var adminchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Admin",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Admin1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Admin2",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Content",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Content2",
				":layer": 5,
				":errors": false
			};
			var translationchanges = {};
			this.oEditor.setMode("all");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oField = this.oEditor.getAggregation("_formContent")[2];
					assert.ok(oField.getAggregation("_field").getValue() === "stringParameter Value Content", "Field: String Value");
					oField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Admin1", "Field: Translation Value");
					oField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Content2", "Field: Translation i18n Value");
					oField = this.oEditor.getAggregation("_formContent")[8];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: stringParameter Value Content", "Field: Normol parameter syntax Value");
					oField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans Admin1", "Field: parameter syntax to translate Value");
					oField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans Content2", "Field: parameter syntax to translate in i18n format Value");
					oField = this.oEditor.getAggregation("_formContent")[14];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: {{parameters.TODAY_ISO}}", "Field: parameter syntax to TODAY_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: {{parameters.NOW_ISO}}", "Field: parameter syntax to NOW_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: {{parameters.LOCALE}}", "Field: parameter syntax to LOCALE Value");
					oField = this.oEditor.getAggregation("_formContent")[20];
					assert.ok(oField.getAggregation("_field").getValue() === "Mixed value: stringParameter Value Content, StringParameter Value Trans Admin1, StringParameter Value Trans Content2, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter and self change from Admin and Content 1", function (assert) {
			var adminchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Admin",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Admin1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Admin2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Admin",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Admin",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Content",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Content1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Content2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Content",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Content",
				":layer": 5,
				":errors": false
			};
			var translationchanges = {};
			this.oEditor.setMode("all");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oField = this.oEditor.getAggregation("_formContent")[2];
					assert.ok(oField.getAggregation("_field").getValue() === "stringParameter Value Content", "Field: String Value");
					oField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Content1", "Field: Translation Value");
					oField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Content2", "Field: Translation i18n Value");
					oField = this.oEditor.getAggregation("_formContent")[8];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxNormal Value Content", "Field: Normol parameter syntax Value");
					oField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTranslate Value Content", "Field: parameter syntax to translate Value");
					oField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToI18nTranslate Value Content", "Field: parameter syntax to translate in i18n format Value");
					oField = this.oEditor.getAggregation("_formContent")[14];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTODAY_ISO Value Content", "Field: parameter syntax to TODAY_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToNOW_ISO Value Content", "Field: parameter syntax to NOW_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToLOCALE Value Content", "Field: parameter syntax to LOCALE Value");
					oField = this.oEditor.getAggregation("_formContent")[20];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntax_mixed Value Content", "Field: mixed parameter syntaxs Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter and self change from Admin and Content 2", function (assert) {
			var adminchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Admin",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Admin1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Admin2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Admin",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Content",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Content2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Content",
				":layer": 5,
				":errors": false
			};
			var translationchanges = {};
			this.oEditor.setMode("all");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oField = this.oEditor.getAggregation("_formContent")[2];
					assert.ok(oField.getAggregation("_field").getValue() === "stringParameter Value Content", "Field: String Value");
					oField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Admin1", "Field: Translation Value");
					oField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Content2", "Field: Translation i18n Value");
					oField = this.oEditor.getAggregation("_formContent")[8];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxNormal Value Content", "Field: Normol parameter syntax Value");
					oField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTranslate Value Admin", "Field: parameter syntax to translate Value");
					oField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToI18nTranslate Value Content", "Field: parameter syntax to translate in i18n format Value");
					oField = this.oEditor.getAggregation("_formContent")[14];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTODAY_ISO Value Admin", "Field: parameter syntax to TODAY_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToNOW_ISO Value Content", "Field: parameter syntax to NOW_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToLOCALE Value Content", "Field: parameter syntax to LOCALE Value");
					oField = this.oEditor.getAggregation("_formContent")[20];
					assert.ok(oField.getAggregation("_field").getValue() === "Mixed value: stringParameter Value Content, StringParameter Value Trans Admin1, StringParameter Value Trans Content2, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter and self change from Admin and Content 3", function (assert) {
			var adminchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Admin",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Admin2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Admin",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Content",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Content2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Content",
				":layer": 5,
				":errors": false
			};
			var translationchanges = {};
			this.oEditor.setMode("all");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oField = this.oEditor.getAggregation("_formContent")[2];
					assert.ok(oField.getAggregation("_field").getValue() === "stringParameter Value Content", "Field: String Value");
					oField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans in i18n", "Field: Translation Value");
					oField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Content2", "Field: Translation i18n Value");
					oField = this.oEditor.getAggregation("_formContent")[8];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxNormal Value Content", "Field: Normol parameter syntax Value");
					oField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTranslate Value Admin", "Field: parameter syntax to translate Value");
					oField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToI18nTranslate Value Content", "Field: parameter syntax to translate in i18n format Value");
					oField = this.oEditor.getAggregation("_formContent")[14];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTODAY_ISO Value Admin", "Field: parameter syntax to TODAY_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToNOW_ISO Value Content", "Field: parameter syntax to NOW_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToLOCALE Value Content", "Field: parameter syntax to LOCALE Value");
					oField = this.oEditor.getAggregation("_formContent")[20];
					assert.ok(oField.getAggregation("_field").getValue() === "Mixed value: stringParameter Value Content, StringParameter Value Trans in i18n, StringParameter Value Trans Content2, {{parameters.TODAY_ISO}}, {{parameters.NOW_ISO}}, {{parameters.LOCALE}} End", "Field: mixed parameter syntaxs Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter and self change from Admin and Translate 1", function (assert) {
			var adminchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Admin",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Admin1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Admin2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Admin",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Admin",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {};
			var translationchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Translation",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Translation1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Translation2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Translation",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Translation",
				":layer": 10,
				":errors": false
			};
			this.oEditor.setMode("all");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oField = this.oEditor.getAggregation("_formContent")[2];
					assert.ok(oField.getAggregation("_field").getValue() === "stringParameter Value Translation", "Field: String Value");
					oField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Translation1", "Field: Translation Value");
					oField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Translation2", "Field: Translation i18n Value");
					oField = this.oEditor.getAggregation("_formContent")[8];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxNormal Value Translation", "Field: Normol parameter syntax Value");
					oField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTranslate Value Translation", "Field: parameter syntax to translate Value");
					oField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToI18nTranslate Value Translation", "Field: parameter syntax to translate in i18n format Value");
					oField = this.oEditor.getAggregation("_formContent")[14];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTODAY_ISO Value Translation", "Field: parameter syntax to TODAY_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToNOW_ISO Value Translation", "Field: parameter syntax to NOW_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToLOCALE Value Translation", "Field: parameter syntax to LOCALE Value");
					oField = this.oEditor.getAggregation("_formContent")[20];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntax_mixed Value Translation", "Field: mixed parameter syntaxs Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter and self change from Admin and Translate 2", function (assert) {
			var adminchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Admin",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Admin1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Admin2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Admin",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {};
			var translationchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Translation",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Translation2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Translation",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Translation",
				":layer": 10,
				":errors": false
			};
			this.oEditor.setMode("all");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oField = this.oEditor.getAggregation("_formContent")[2];
					assert.ok(oField.getAggregation("_field").getValue() === "stringParameter Value Translation", "Field: String Value");
					oField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Admin1", "Field: Translation Value");
					oField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Translation2", "Field: Translation i18n Value");
					oField = this.oEditor.getAggregation("_formContent")[8];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxNormal Value Translation", "Field: Normol parameter syntax Value");
					oField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans Admin1", "Field: parameter syntax to translate Value");
					oField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToI18nTranslate Value Translation", "Field: parameter syntax to translate in i18n format Value");
					oField = this.oEditor.getAggregation("_formContent")[14];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTODAY_ISO Value Translation", "Field: parameter syntax to TODAY_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToNOW_ISO Value Translation", "Field: parameter syntax to NOW_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToLOCALE Value Translation", "Field: parameter syntax to LOCALE Value");
					oField = this.oEditor.getAggregation("_formContent")[20];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntax_mixed Value Translation", "Field: mixed parameter syntaxs Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter and self change from Content and Translate 1", function (assert) {
			var adminchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Content",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Content1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Content2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Content",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Content",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {};
			var translationchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Translation",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Translation1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Translation2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Translation",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Translation",
				":layer": 10,
				":errors": false
			};
			this.oEditor.setMode("all");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oField = this.oEditor.getAggregation("_formContent")[2];
					assert.ok(oField.getAggregation("_field").getValue() === "stringParameter Value Translation", "Field: String Value");
					oField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Translation1", "Field: Translation Value");
					oField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Translation2", "Field: Translation i18n Value");
					oField = this.oEditor.getAggregation("_formContent")[8];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxNormal Value Translation", "Field: Normol parameter syntax Value");
					oField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTranslate Value Translation", "Field: parameter syntax to translate Value");
					oField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToI18nTranslate Value Translation", "Field: parameter syntax to translate in i18n format Value");
					oField = this.oEditor.getAggregation("_formContent")[14];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTODAY_ISO Value Translation", "Field: parameter syntax to TODAY_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToNOW_ISO Value Translation", "Field: parameter syntax to NOW_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToLOCALE Value Translation", "Field: parameter syntax to LOCALE Value");
					oField = this.oEditor.getAggregation("_formContent")[20];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntax_mixed Value Translation", "Field: mixed parameter syntaxs Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter and self change from Content and Translate 2", function (assert) {
			var adminchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Content",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Content1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Content2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Content",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {};
			var translationchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Translation",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Translation2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Translation",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Translation",
				":layer": 10,
				":errors": false
			};
			this.oEditor.setMode("all");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oField = this.oEditor.getAggregation("_formContent")[2];
					assert.ok(oField.getAggregation("_field").getValue() === "stringParameter Value Translation", "Field: String Value");
					oField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Content1", "Field: Translation Value");
					oField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Translation2", "Field: Translation i18n Value");
					oField = this.oEditor.getAggregation("_formContent")[8];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxNormal Value Translation", "Field: Normol parameter syntax Value");
					oField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: StringParameter Value Trans Content1", "Field: parameter syntax to translate Value");
					oField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToI18nTranslate Value Translation", "Field: parameter syntax to translate in i18n format Value");
					oField = this.oEditor.getAggregation("_formContent")[14];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTODAY_ISO Value Translation", "Field: parameter syntax to TODAY_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToNOW_ISO Value Translation", "Field: parameter syntax to NOW_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToLOCALE Value Translation", "Field: parameter syntax to LOCALE Value");
					oField = this.oEditor.getAggregation("_formContent")[20];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntax_mixed Value Translation", "Field: mixed parameter syntaxs Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter and self change from Admin, Content and Translate 1", function (assert) {
			var adminchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Admin",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Admin1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Admin2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Admin",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Admin",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Content",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Content1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Content2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Content",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Content",
				":layer": 5,
				":errors": false
			};
			var translationchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Translation",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Translation1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Translation2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToNOW_ISO/value": "Value: parameterSyntaxToNOW_ISO Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Translation",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Translation",
				":layer": 10,
				":errors": false
			};
			this.oEditor.setMode("all");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oField = this.oEditor.getAggregation("_formContent")[2];
					assert.ok(oField.getAggregation("_field").getValue() === "stringParameter Value Translation", "Field: String Value");
					oField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Translation1", "Field: Translation Value");
					oField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Translation2", "Field: Translation i18n Value");
					oField = this.oEditor.getAggregation("_formContent")[8];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxNormal Value Translation", "Field: Normol parameter syntax Value");
					oField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTranslate Value Translation", "Field: parameter syntax to translate Value");
					oField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToI18nTranslate Value Translation", "Field: parameter syntax to translate in i18n format Value");
					oField = this.oEditor.getAggregation("_formContent")[14];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTODAY_ISO Value Translation", "Field: parameter syntax to TODAY_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToNOW_ISO Value Translation", "Field: parameter syntax to NOW_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToLOCALE Value Translation", "Field: parameter syntax to LOCALE Value");
					oField = this.oEditor.getAggregation("_formContent")[20];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntax_mixed Value Translation", "Field: mixed parameter syntaxs Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});

		QUnit.test("Parameter and self change from Admin, Content and Translate 2", function (assert) {
			var adminchanges = {
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Admin1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Admin2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Admin",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Admin",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Admin",
				":layer": 0,
				":errors": false
			};
			var contentchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Content",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Content2",
				"/sap.card/configuration/parameters/parameterSyntaxNormal/value": "Value: parameterSyntaxNormal Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Content",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Content",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Content",
				":layer": 5,
				":errors": false
			};
			var translationchanges = {
				"/sap.card/configuration/parameters/stringParameter/value": "stringParameter Value Translation",
				"/sap.card/configuration/parameters/stringWithTranslatedValue/value": "StringParameter Value Trans Translation1",
				"/sap.card/configuration/parameters/stringWithTranslatedValueIni18nFormat/value": "StringParameter Value Trans Translation2",
				"/sap.card/configuration/parameters/parameterSyntaxToTranslate/value": "Value: parameterSyntaxToTranslate Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToI18nTranslate/value": "Value: parameterSyntaxToI18nTranslate Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToTODAY_ISO/value": "Value: parameterSyntaxToTODAY_ISO Value Translation",
				"/sap.card/configuration/parameters/parameterSyntaxToLOCALE/value": "Value: parameterSyntaxToLOCALE Value Translation",
				"/sap.card/configuration/parameters/parameterSyntax_mixed/value": "Value: parameterSyntax_mixed Value Translation",
				":layer": 10,
				":errors": false
			};
			this.oEditor.setMode("all");
			this.oEditor.setJson({
				baseUrl: sBaseUrl,
				manifest: oManifest,
				manifestChanges: [adminchanges, contentchanges, translationchanges]
			});
			return new Promise(function (resolve, reject) {
				this.oEditor.attachReady(function () {
					assert.ok(this.oEditor.isReady(), "Editor is ready");
					var oField = this.oEditor.getAggregation("_formContent")[2];
					assert.ok(oField.getAggregation("_field").getValue() === "stringParameter Value Translation", "Field: String Value");
					oField = this.oEditor.getAggregation("_formContent")[4];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Translation1", "Field: Translation Value");
					oField = this.oEditor.getAggregation("_formContent")[6];
					assert.ok(oField.getAggregation("_field").getValue() === "StringParameter Value Trans Translation2", "Field: Translation i18n Value");
					oField = this.oEditor.getAggregation("_formContent")[8];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxNormal Value Content", "Field: Normol parameter syntax Value");
					oField = this.oEditor.getAggregation("_formContent")[10];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTranslate Value Translation", "Field: parameter syntax to translate Value");
					oField = this.oEditor.getAggregation("_formContent")[12];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToI18nTranslate Value Translation", "Field: parameter syntax to translate in i18n format Value");
					oField = this.oEditor.getAggregation("_formContent")[14];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToTODAY_ISO Value Translation", "Field: parameter syntax to TODAY_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[16];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: {{parameters.NOW_ISO}}", "Field: parameter syntax to NOW_ISO Value");
					oField = this.oEditor.getAggregation("_formContent")[18];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntaxToLOCALE Value Translation", "Field: parameter syntax to LOCALE Value");
					oField = this.oEditor.getAggregation("_formContent")[20];
					assert.ok(oField.getAggregation("_field").getValue() === "Value: parameterSyntax_mixed Value Translation", "Field: mixed parameter syntaxs Value");
					resolve();
				}.bind(this));
			}.bind(this));
		});
	});

	QUnit.done(function () {
		document.getElementById("qunit-fixture").style.display = "none";
	});
});
