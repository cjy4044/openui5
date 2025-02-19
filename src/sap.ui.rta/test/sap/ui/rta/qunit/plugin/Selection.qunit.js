/*global QUnit*/

sap.ui.define([
	"sap/m/Bar",
	"sap/m/Button",
	"sap/m/HBox",
	"sap/m/Text",
	"sap/m/VBox",
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/ui/events/KeyCodes",
	"sap/ui/dt/DesignTime",
	"sap/ui/dt/ElementOverlay",
	"sap/ui/dt/OverlayRegistry",
	"sap/ui/fl/write/api/ChangesWriteAPI",
	"sap/ui/fl/Layer",
	"sap/ui/fl/Utils",
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/rta/command/CommandFactory",
	"sap/ui/rta/plugin/Combine",
	"sap/ui/rta/plugin/Remove",
	"sap/ui/rta/plugin/Selection",
	"sap/ui/rta/Utils",
	"sap/m/InstanceManager",
	"sap/m/Popover",
	"sap/ui/thirdparty/jquery",
	"sap/ui/thirdparty/sinon-4"
], function (
	Bar,
	Button,
	HBox,
	Text,
	VBox,
	UIComponent,
	Device,
	KeyCodes,
	DesignTime,
	ElementOverlay,
	OverlayRegistry,
	ChangesWriteAPI,
	Layer,
	FlUtils,
	QUnitUtils,
	CommandFactory,
	Combine,
	Remove,
	Selection,
	Utils,
	InstanceManager,
	Popover,
	jQuery,
	sinon
) {
	"use strict";

	var sandbox = sinon.sandbox.create();

	QUnit.module("Given a Selection plugin and designtime in MultiSelection mode and controls with custom dt metadata to simulate different cases...", {
		beforeEach: function(assert) {
			var done = assert.async();

			sandbox.stub(ChangesWriteAPI, "getChangeHandler").resolves();
			this.oComponent = new UIComponent();
			sandbox.stub(FlUtils, "getAppComponentForControl").returns(this.oComponent);
			this.oCommandFactory = new CommandFactory({
				flexSettings: {
					layer: Layer.CUSTOMER,
					developerMode: false
				}
			});
			this.oSelectionPlugin = new Selection({
				commandFactory: this.oCommandFactory,
				multiSelectionRequiredPlugins: [
					Combine.getMetadata().getName(),
					Remove.getMetadata().getName()
				]
			});
			this.oVBox = new VBox({
				id: this.oComponent.createId("root"),
				items: [
					new HBox({
						id: this.oComponent.createId("container1"),
						items: [
							new Button(this.oComponent.createId("innerBtn11"), {text: "innerBtn11"}),
							new Button(this.oComponent.createId("innerBtn12"), {text: "innerBtn12"}),
							new Text(this.oComponent.createId("innerTxt13"), {text: "innerTxt13"})
						]
					}),
					new Button(this.oComponent.createId("btnOutsideContainer"), {text: "btnOutsideContainer"}),
					new HBox({
						id: this.oComponent.createId("container2"),
						items: [
							new Button(this.oComponent.createId("innerBtn21"), {text: "innerBtn21"})
						]
					}),
					new Bar(this.oComponent.createId("othercontainer3")),
					new HBox({
						id: this.oComponent.createId("container4"),
						items: [
							new VBox({
								id: this.oComponent.createId("innerVBox1"),
								items: [
									new Text(this.oComponent.createId("innerVBox1Txt"), {text: "innerVBox1Txt"})
								]
							}),
							new VBox({
								id: this.oComponent.createId("innerVBox2"),
								items: [
									new Text(this.oComponent.createId("innerVBox2Txt"), {text: "innerVBox2Txt"}),
									new Button(this.oComponent.createId("innerVBox2Btn"), {text: "innerVBox2Btn"})
								]
							})
						]
					})
				]
			});
			this.oVBox.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();

			this.oDesignTime = new DesignTime({
				plugins: [
					this.oSelectionPlugin,
					new Remove({commandFactory: this.oCommandFactory}),
					new Combine({commandFactory: this.oCommandFactory})
				],
				rootElements: [this.oVBox],
				designTimeMetadata: {
					"sap.m.VBox": {
						actions: {
							remove: {
								changeType: "hideControl"
							}
						}
					},
					"sap.m.HBox": {
						aggregations: {
							items: {
								propagateRelevantContainer: true
							}
						},
						actions: {
							remove: {
								changeType: "hideControl"
							}
						}
					},
					"sap.m.Button": {
						actions: {
							combine: {
								changeType: "combineChange",
								changeOnRelevantContainer: true
							},
							remove: null
						}
					},
					"sap.m.Text": {
						actions: {
							remove: {
								changeType: "hideControl"
							}
						}
					}
				}
			});
			this.oDesignTime.attachEventOnce("synced", function() {
				done();
			});
			this.oSelectionManager = this.oDesignTime.getSelectionManager();
			this.oEvent = new Event("keydown");
			this.oEvent.shiftKey = false;
			this.oEvent.altKey = false;
		},
		afterEach: function() {
			sandbox.restore();
			this.oComponent.destroy();
			this.oVBox.destroy();
			this.oDesignTime.destroy();
		}
	}, function() {
		QUnit.test("when trying to select the first compatible control (removable/combinable)", function(assert) {
			var oOverlay = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn12"));
			oOverlay.setSelected(true);

			assert.ok(oOverlay.isSelected(), "then single overlay is selected");
		});

		QUnit.test("when trying to select the 2. compatible (removable/combinable) control", function(assert) {
			var oOverlay1 = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn11"));
			var oOverlay2 = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn12"));

			this.oSelectionManager.set([oOverlay1, oOverlay2]);

			assert.ok(oOverlay1.isSelected(), "then innerBtn11 overlay is selected");
			assert.ok(oOverlay2.isSelected(), "then innerBtn12 overlay is selected");
		});

		QUnit.test("when trying to select the 2. control not multiselection enabled control (removable/combinable)", function(assert) {
			var oOverlay1 = OverlayRegistry.getOverlay(this.oComponent.createId("container1"));
			var oOverlay2 = OverlayRegistry.getOverlay(this.oComponent.createId("othercontainer3"));
			oOverlay2.setSelectable(true);

			this.oSelectionManager.add(oOverlay1);
			this.oSelectionManager.add(oOverlay2);

			assert.ok(oOverlay1.isSelected(), "then container1 overlay is selected");
			assert.notOk(oOverlay2.isSelected(), "then othercontainer3 overlay is not selected");
		});

		QUnit.test("when trying to select a single container which doesn't pass validator of Plugin", function(assert) {
			var oOverlay = OverlayRegistry.getOverlay(this.oComponent.createId("othercontainer3"));
			oOverlay.setSelectable(true);

			this.oSelectionManager.add(oOverlay);

			assert.ok(oOverlay.isSelected(), "then othercontainer3 overlay is not selected");
		});

		QUnit.test("when trying to select 3 overlays and the 2. control is multiselection enabled for a different action", function(assert) {
			var oOverlay1 = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn12"));
			var oOverlay2 = OverlayRegistry.getOverlay(this.oComponent.createId("innerTxt13"));
			var oOverlay3 = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn11"));

			this.oSelectionManager.add(oOverlay1);
			this.oSelectionManager.add(oOverlay2);
			this.oSelectionManager.add(oOverlay3);

			assert.ok(oOverlay1.isSelected(), "then innerBtn12 overlay is selected");
			assert.notOk(oOverlay2.isSelected(), "then innerTxt13 overlay for the different action is not selected");
			assert.ok(oOverlay3.isSelected(), "then innerBtn11 overlay is selected");
		});

		QUnit.test("when trying to select the 2. control with different parent", function(assert) {
			var oOverlay1 = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn12"));
			var oOverlay2 = OverlayRegistry.getOverlay(this.oComponent.createId("btnOutsideContainer"));
			oOverlay2.setSelectable(true);

			this.oSelectionManager.add(oOverlay1);
			this.oSelectionManager.add(oOverlay2);

			assert.ok(oOverlay1.isSelected(), "then innerBtn12 overlay is selected");
			assert.notOk(oOverlay2.isSelected(), "then btnOutsideContainer overlay from different parent is not selected");
		});

		QUnit.test("when trying to select innerVBox1Txt inside the innerVBox (both have HBox container4 as their relevant container, but innerVBox is parent of text)", function(assert) {
			var oOverlay1 = OverlayRegistry.getOverlay(this.oComponent.createId("innerVBox1Txt"));
			var oOverlay2 = OverlayRegistry.getOverlay(this.oComponent.createId("innerVBox1"));

			this.oSelectionManager.add(oOverlay1);
			this.oSelectionManager.add(oOverlay2);

			assert.ok(oOverlay1.isSelected(), "then innerVBox1Txt overlay is selected");
			assert.notOk(oOverlay2.isSelected(), "then innerVBox1 overlay is not selected");
		});

		QUnit.test("when trying to select the texts inside the innerVBox1 & innerVBox2 (different parents, same control type and same relevant container)", function(assert) {
			var oOverlay1 = OverlayRegistry.getOverlay(this.oComponent.createId("innerVBox1Txt"));
			var oOverlay2 = OverlayRegistry.getOverlay(this.oComponent.createId("innerVBox2Txt"));

			this.oSelectionManager.add(oOverlay1);
			this.oSelectionManager.add(oOverlay2);

			assert.ok(oOverlay1.isSelected(), "then innerVBox1Txt overlay is selected");
			assert.ok(oOverlay2.isSelected(), "then innerVBox2Txt overlay is selected");
		});

		QUnit.test("when trying to select innerVBox1Txt in innerVBox1 and the container innerVBox2 (different control types and same relevant container)", function(assert) {
			var oOverlay1 = OverlayRegistry.getOverlay(this.oComponent.createId("innerVBox1Txt"));
			var oOverlay2 = OverlayRegistry.getOverlay(this.oComponent.createId("innerVBox2"));

			this.oSelectionManager.add(oOverlay1);
			this.oSelectionManager.add(oOverlay2);

			assert.ok(oOverlay1.isSelected(), "then innerVBox1Txt overlay is selected");
			assert.notOk(oOverlay2.isSelected(), "then innerVBox2 overlay is not selected");
		});

		//Note: we might support this case in the future
		QUnit.test("when trying to select innerVBox1Txt in innerVBox1 and innerVBox2Btn in innerVBox2 (different control types, different parents and same relevant container)", function(assert) {
			var oOverlay1 = OverlayRegistry.getOverlay(this.oComponent.createId("innerVBox1Txt"));
			var oOverlay2 = OverlayRegistry.getOverlay(this.oComponent.createId("innerVBox2Btn"));

			this.oSelectionManager.add(oOverlay1);
			this.oSelectionManager.add(oOverlay2);

			assert.ok(oOverlay1.isSelected(), "then innerVBox1Txt overlay is selected");
			assert.notOk(oOverlay2.isSelected(), "then innerVBox2Btn overlay is not selected");
		});

		QUnit.test("When setSelected() is called on an Overlay with Developer Mode = false ", function(assert) {
			var oElement = new Button("testbutton1");
			var oOverlay = new ElementOverlay({
				element: oElement,
				isRoot: false
			});
			sandbox.stub(oOverlay, "getDesignTimeMetadata").returns({
				markedAsNotAdaptable: function() { return false; }
			});
			var oAttachEditableChangeStub = sandbox.stub(oOverlay, "attachEditableChange");
			this.oSelectionPlugin.registerElementOverlay(oOverlay);
			this.oSelectionManager.add(oOverlay);
			assert.notOk(oOverlay.isSelected(), "then this overlay is not selected");
			assert.strictEqual(oAttachEditableChangeStub.callCount, 1, "then 'attachEditableChange' function called once");
			this.oSelectionPlugin.deregisterElementOverlay(oOverlay);
			oElement.destroy();
		});

		QUnit.test("When setSelected() is called on an Overlay and markedAsNotAdaptable function returns true ", function(assert) {
			var oElement = new Button("testbutton2");
			var oOverlay = new ElementOverlay({
				element: oElement,
				isRoot: false
			});
			sandbox.stub(oOverlay, "getDesignTimeMetadata").returns({
				markedAsNotAdaptable: function() { return true; }
			});
			var oAttachEditableChangeStub = sandbox.stub(oOverlay, "attachEditableChange");
			this.oSelectionPlugin.registerElementOverlay(oOverlay);
			this.oSelectionManager.add(oOverlay);
			assert.notOk(oOverlay.isSelected(), "then this overlay is not selected");
			assert.strictEqual(oAttachEditableChangeStub.callCount, 0, "then 'attachEditableChange' function never called");
			this.oSelectionPlugin.deregisterElementOverlay(oOverlay);
			oElement.destroy();
		});

		QUnit.test("Deregistering an Overlay", function (assert) {
			var oOverlay = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn11"));
			this.oSelectionPlugin.registerElementOverlay(oOverlay);
			this.oSelectionPlugin.deregisterElementOverlay(oOverlay);
			assert.ok(true, "Should throw no error");
		});

		QUnit.test("Pressing a Keyboard-key other than Arrows and Enter (e.g.TAB) on an Overlay", function (assert) {
			var oOverlay = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn11"));
			oOverlay.focus();
			this.oEvent.keyCode = KeyCodes.TAB;
			oOverlay.getDomRef().dispatchEvent(this.oEvent);
			assert.notOk(oOverlay.isSelected(), "then this overlay is not selected");
		});

		QUnit.test("Pressing any Keyboard-key on an Overlay and isActive is false", function (assert) {
			// processing of the key-down event can be proofed by checking the calls of
			// "getFocusedOverlay" function
			this.oSelectionPlugin.setIsActive(false);
			var oGetFocusedOverlayStub = sandbox.stub(Utils, "getFocusedOverlay");
			var oOverlay = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn11"));
			oOverlay.focus();
			this.oEvent.keyCode = KeyCodes.TAB;
			oOverlay.getDomRef().dispatchEvent(this.oEvent);
			assert.strictEqual(oGetFocusedOverlayStub.callCount, 0, "then KayDown Event is not processed");
		});

		QUnit.test("Pressing ENTER on an Overlay", function (assert) {
			var oOverlay1 = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn12"));
			this.oSelectionManager.add(oOverlay1);
			var oOverlay2 = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn11"));
			oOverlay2.focus();
			this.oEvent.keyCode = KeyCodes.ENTER;
			oOverlay2.getDomRef().dispatchEvent(this.oEvent);
			assert.notOk(oOverlay1.isSelected(), "then Overlay1 is not selected");
			assert.ok(oOverlay2.isSelected(), "then Overlay2 is selected");
		});

		QUnit.test("Pressing CTRL-ENTER on an Overlay", function (assert) {
			var oOverlay1 = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn12"));
			this.oSelectionManager.add(oOverlay1);
			var oOverlay2 = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn11"));
			oOverlay2.focus();
			this.oEvent.keyCode = KeyCodes.ENTER;
			this.oEvent.ctrlKey = true;
			oOverlay2.getDomRef().dispatchEvent(this.oEvent);
			assert.ok(oOverlay1.isSelected(), "then Overlay1 is selected");
			assert.ok(oOverlay2.isSelected(), "then Overlay2 is selected");
		});

		QUnit.test("Pressing ESC on an Overlay when there are selected Overlays", function (assert) {
			var oOverlay1 = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn12"));
			this.oSelectionManager.add(oOverlay1);
			var oOverlay2 = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn11"));
			this.oSelectionManager.add(oOverlay2);
			assert.equal(this.oSelectionManager.get().length, 2, "Two Overlays are selected before Keypress");
			oOverlay2.focus();
			this.oEvent.keyCode = KeyCodes.ESCAPE;
			oOverlay2.getDomRef().dispatchEvent(this.oEvent);
			assert.equal(this.oSelectionManager.get().length, 0, "No Overlays are selected after Keypress");
		});

		QUnit.test("Pressing UP-Arrow on an Overlay", function (assert) {
			var oOverlay = OverlayRegistry.getOverlay(this.oComponent.createId("innerVBox2Btn"));
			oOverlay.focus();
			var oParentOverlay = Utils.getFocusableParentOverlay(oOverlay);
			this.oEvent.keyCode = KeyCodes.ARROW_UP;
			oOverlay.getDomRef().dispatchEvent(this.oEvent);
			assert.ok(Utils.getFocusedOverlay() === oParentOverlay, "Parent Overlay is focused");
		});

		QUnit.test("Pressing DOWN-Arrow on an Overlay", function (assert) {
			var oOverlay = OverlayRegistry.getOverlay(this.oComponent.createId("innerVBox2"));
			oOverlay.focus();
			var oFirstChildOverlay = Utils.getFirstFocusableDescendantOverlay(oOverlay);
			this.oEvent.keyCode = KeyCodes.ARROW_DOWN;
			oOverlay.getDomRef().dispatchEvent(this.oEvent);
			assert.ok(Utils.getFocusedOverlay() === oFirstChildOverlay, "Child Overlay is focused");
		});

		QUnit.test("Pressing Left-arrow on an Overlay", function (assert) {
			var oOverlay = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn12"));
			oOverlay.focus();
			var oPrevSiblingOverlay = Utils.getPreviousFocusableSiblingOverlay(oOverlay);
			this.oEvent.keyCode = KeyCodes.ARROW_LEFT;
			oOverlay.getDomRef().dispatchEvent(this.oEvent);
			assert.ok(Utils.getFocusedOverlay() === oPrevSiblingOverlay, "Previous Sibling Overlay is focused");
		});

		QUnit.test("Pressing Right-arrow on an Overlay", function (assert) {
			var oOverlay = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn11"));
			oOverlay.focus();
			var oNextSiblingOverlay = Utils.getNextFocusableSiblingOverlay(oOverlay);
			this.oEvent.keyCode = KeyCodes.ARROW_RIGHT;
			oOverlay.getDomRef().dispatchEvent(this.oEvent);
			assert.ok(Utils.getFocusedOverlay() === oNextSiblingOverlay, "Next Sibling Overlay is focused");
		});

		QUnit.test("Invoking 'contextmenu' on an Overlay which is selectable", function (assert) {
			var oOverlay1 = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn12"));
			this.oSelectionManager.add(oOverlay1);
			var oOverlay2 = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn11"));
			var oMouseEvent = new Event("contextmenu");
			oOverlay2.getDomRef().dispatchEvent(oMouseEvent);
			assert.notOk(oOverlay1.isSelected(), "then Overlay1 is not selected");
			assert.ok(oOverlay2.isSelected(), "then Overlay2 is selected");
		});

		QUnit.test("Invoking 'click' on an Overlay which is selectable", function (assert) {
			var oOverlay1 = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn12"));
			this.oSelectionManager.add(oOverlay1);
			var oOverlay2 = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn11"));
			var oMouseEvent = new Event("click");
			oOverlay2.getDomRef().dispatchEvent(oMouseEvent);
			assert.notOk(oOverlay1.isSelected(), "then Overlay1 is not selected");
			assert.ok(oOverlay2.isSelected(), "then Overlay2 is selected");
		});

		QUnit.test("Invoking Mouse-Down on an Overlay which is selectable", function (assert) {
			sandbox.stub(Device.browser, "name").value("ie");
			var oOverlay = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn11"));
			assert.notOk(document.activeElement === oOverlay.getDomRef(), "when the Overlay is initially not focused");
			var oMouseEvent = new Event("mousedown");
			oOverlay.getDomRef().dispatchEvent(oMouseEvent);
			assert.ok(document.activeElement === oOverlay.getDomRef(), "then the Overlay is focused");
		});

		QUnit.test("Invoking Mouse-Down on an Overlay which is selectable and isActive is false", function (assert) {
			sandbox.stub(Device.browser, "name").value("ie");
			this.oSelectionPlugin.setIsActive(false);
			var oOverlay = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn11"));
			assert.notOk(document.activeElement === oOverlay.getDomRef(), "when the Overlay is initially not focused");
			var oMouseEvent = new Event("mousedown");
			oOverlay.getDomRef().dispatchEvent(oMouseEvent);
			assert.notOk(document.activeElement === oOverlay.getDomRef(), "then the Overlay is not focused afterwards");
		});

		QUnit.test("Invoking Mouse-Down on an Overlay which is selectable and isActive is false and two PopOvers are open", function (assert) {
			var fnDone = assert.async();
			this.oSelectionPlugin.setIsActive(false);
			var oOverlay1 = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn11"));
			var oOverlay2 = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn12"));
			var oPopOver1 = new Popover({}).openBy(oOverlay1);
			var oPopOver2 = new Popover({}).openBy(oOverlay2);
			oPopOver1._bOpenedByChangeIndicator = false;
			oPopOver2._bOpenedByChangeIndicator = true;
			assert.strictEqual(InstanceManager.getOpenPopovers().length, 2, "then 2 PopOvers are opened initially");
			var oMouseEvent = new Event("mousedown");
			oOverlay1.getDomRef().dispatchEvent(oMouseEvent);
			oPopOver2.attachAfterClose(function () {
				assert.strictEqual(InstanceManager.getOpenPopovers().length, 1, "then one PopOver is closed");
				fnDone();
			});
		});

		QUnit.test("Invoking Mouse-Down on an Overlay which is not selectable", function (assert) {
			sandbox.stub(Device.browser, "name").value("ie");
			var oOverlay = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn11"));
			oOverlay.setSelectable(false);
			oOverlay.setFocusable(true);
			oOverlay.focus();
			assert.ok(document.activeElement === oOverlay.getDomRef(), "when the Overlay is initialy focused");
			var oMouseEvent = new Event("mousedown");
			oOverlay.getDomRef().dispatchEvent(oMouseEvent);
			assert.notOk(document.activeElement === oOverlay.getDomRef(), "then the Overlay is not focused any more");
		});

		QUnit.test("Invoking Mouse-Over and Mouse-Leave on an Overlay which is selectable", function (assert) {
			var oOverlay = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn11"));
			assert.ok(!oOverlay.hasStyleClass("sapUiRtaOverlayHover"), "initially the CSS class is not set");
			var oMouseOverEvent = new Event("mouseover");
			oOverlay.getDomRef().dispatchEvent(oMouseOverEvent);
			assert.ok(oOverlay.hasStyleClass("sapUiRtaOverlayHover"), "then the Overlay has the proper CSS class after mouse-over event");
			// this does not seem to work without jQuery
			QUnitUtils.triggerEvent("mouseleave", oOverlay.getDomRef());
			assert.ok(!oOverlay.hasStyleClass("sapUiRtaOverlayHover"), "then the CSS class is removed again after mouse-leave event");
		});

		QUnit.test("Invoking Mouse-Over and Mouse-Leave on an Overlay which is selectable and isActive is false", function (assert) {
			this.oSelectionPlugin.setIsActive(false);
			var oOverlay = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn11"));
			assert.ok(!oOverlay.hasStyleClass("sapUiRtaOverlayHover"), "initially the CSS class is not set");
			var oMouseOverEvent = new Event("mouseover");
			oOverlay.getDomRef().dispatchEvent(oMouseOverEvent);
			assert.ok(!oOverlay.hasStyleClass("sapUiRtaOverlayHover"), "then the CSS class is still not not set after mouse-over event");
			// this does not seem to work without jQuery
			QUnitUtils.triggerEvent("mouseleave", oOverlay.getDomRef());
			assert.ok(!oOverlay.hasStyleClass("sapUiRtaOverlayHover"), "then the CSS class is still not not set after mouse-leave event");
		});

		QUnit.test("Invoking Mouse-Over on an Overlay which is not selectable", function (assert) {
			var oOverlay = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn11"));
			oOverlay.setSelectable(false);
			assert.ok(!oOverlay.hasStyleClass("sapUiRtaOverlayHover"), "initially the CSS class is not set");
			var oMouseEvent = new Event("mouseover");
			oOverlay.getDomRef().dispatchEvent(oMouseEvent);
			assert.ok(!oOverlay.hasStyleClass("sapUiRtaOverlayHover"), "then the CSS class is still not set after Mouse-over event");
		});

		QUnit.test("When 'Editable' changes to false on an hovered Overlay", function (assert) {
			var fnDone = assert.async();
			var oOverlay = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn12"));
			var oMouseEvent = new Event("mouseover");
			oOverlay.getDomRef().dispatchEvent(oMouseEvent);
			assert.ok(oOverlay.hasStyleClass("sapUiRtaOverlayHover"), "then the Overlay has initaly the proper CSS class");
			this.oSelectionPlugin.attachEventOnce("elementEditableChange", function() {
				assert.ok(!oOverlay.hasStyleClass("sapUiRtaOverlayHover"), "then the CSS class is removed again after editable change");
				fnDone();
			});
			oOverlay.setEditable(false);
		});

		QUnit.test("When the method _checkDeveloperMode is called and Developermode is true", function (assert) {
			var fnDone = assert.async();
			var oOverlay = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn12"));
			oOverlay.setEditable(false);
			oOverlay.setSelectable(false);
			this.oCommandFactory.setProperty("flexSettings", {layer: Layer.CUSTOMER, developerMode: true});
			this.oSelectionPlugin.attachEventOnce("elementEditableChange", function () {
				assert.ok(true, 'elementEditableChange event was called');
				fnDone();
			});
			assert.ok(this.oSelectionPlugin._checkDeveloperMode(oOverlay, {}), "_checkDeveloperMode returns true");
			assert.ok(oOverlay.getEditable() === true, "Overlay is set to 'editable = true'");
			assert.ok(oOverlay.getSelectable() === true, "Overlay is set to 'selectable = true'");
		});

		QUnit.test("When the method _checkDeveloperMode is called and Developermode is false", function (assert) {
			var oOverlay = OverlayRegistry.getOverlay(this.oComponent.createId("innerBtn12"));
			assert.notOk(this.oSelectionPlugin._checkDeveloperMode(oOverlay, {}), "_checkDeveloperMode returns false");
		});
	});

	QUnit.done(function () {
		jQuery("#qunit-fixture").hide();
	});
});