/*global QUnit, sinon */
(function() {
	"use strict";

	QUnit.module("Core boot", {
		before: function() {
			this.requireSyncStub = sinon.spy(sap.ui, "requireSync");
			window["sap-ui-config"] = {support: ["a", "b"]};
			return new Promise(function(resolve) {
				sap.ui.require(["sap/base/Log", "sap/ui/Device"], function(Log, Device) {
					Log.logSupportInfo(true);
					Log.setLevel(4);
					sap.ui.require(["sap/ui/core/Core"], function(core) {
						core.boot();
						core.attachInit(resolve);
					});
				});
			});
		},
		after: function(assert) {
			var iLoadedModuleIndex = 0;
			var iExpectedMaxSyncCalls = 2;

			var fnAssertRequireSync = function(sModuleName) {
				assert.strictEqual(this.requireSyncStub.getCall(iLoadedModuleIndex).args[0], sModuleName, "At position " + iLoadedModuleIndex + " the module '" + sModuleName + "' should be loaded");
				iLoadedModuleIndex++;
			}.bind(this);

			var fnGetModuleName = function(iPosition){
				return this.requireSyncStub.getCall(iPosition).args[0];
			}.bind(this);


			// In case preloads are used, there is also an additional sync request for the sap.ui.core library-preload.js
			if (fnGetModuleName(iLoadedModuleIndex) === "sap/ui/core/library-preload") {
				fnAssertRequireSync("sap/ui/core/library-preload");
				iExpectedMaxSyncCalls++;
			}

			fnAssertRequireSync("sap/ui/core/support/Support");
			fnAssertRequireSync("sap/ui/support/Bootstrap");

			assert.equal(this.requireSyncStub.callCount, iExpectedMaxSyncCalls,
				"The number of sync requests should be exactly " + iExpectedMaxSyncCalls);
			this.requireSyncStub.restore();
		}
	});

	QUnit.test("globalSyncXHR", function(assert) {
		var done = assert.async();

		sap.ui.require(["sap/ui/support/RuleAnalyzer", "jquery.sap.script"], function(RuleAnalyzer /* jquery.sap.script */) {
			RuleAnalyzer.analyze({
					type: "global"
				},
				[{
					libName: "sap.ui.core",
					ruleId: "globalSyncXHR"
				}]
			).then(function() {
				var oHistory = RuleAnalyzer.getLastAnalysisHistory();

				assert.equal(oHistory.issues.length, 2, "There should be " + 2 + " issues");

				// If there are issues found check the rule id
				assert.equal(oHistory.issues[0].rule.id, "globalSyncXHR", "There should be an issue from rule " + "globalSyncXHR");

				done();
			});

		});

	});

})();
