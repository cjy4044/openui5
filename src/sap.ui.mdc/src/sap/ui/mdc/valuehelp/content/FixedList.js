/*
 * ! ${copyright}
 */

sap.ui.define([
	"sap/ui/mdc/valuehelp/base/ListContent",
	"sap/ui/mdc/util/loadModules",
	"sap/ui/mdc/enum/ConditionValidated",
	"sap/ui/model/FormatException",
	"sap/ui/model/ParseException",
	'sap/ui/mdc/enum/SelectType'
], function(
	ListContent,
	loadModules,
	ConditionValidated,
	FormatException,
	ParseException,
	SelectType
) {
	"use strict";

	var FixedList = ListContent.extend("sap.ui.mdc.valuehelp.content.FixedList", /** @lends sap.ui.mdc.valuehelp.content.FixedList.prototype */
	{
		metadata: {
			library: "sap.ui.mdc",
			interfaces: [
				"sap.ui.mdc.valuehelp.ITypeaheadContent",
				"sap.ui.mdc.valuehelp.IDialogContent"
			],
			properties: {
				groupable: {
					type: "boolean",
					group: "Appearance",
					defaultValue : false
				},
				/**
				 * If set, the items of the list are filtered based on <code>filterValue</code>.
				 *
				 * If a type-ahead behavior for the connected field is wanted, this property must be set to <code>true</code>.
				 * For small lists all values are meant to be shown, independent of the typing in the connected field.
				 * In this case this property must be set to <code>false</code>.
				 *
				 * If not set, the list opens if the user clicks into the connected field.
				 */
				filterList: {
					type: "boolean",
					group: "Appearance",
					defaultValue: true
				}
			},
			aggregations: {
				/**
				 * Items of the field help.
				 *
				 * The <code>key</code> of the items is not shown in the list, but is used as a value of the connected field.
				 *
				 * If the <code>additionalText</code> for all the items is not used, the column will not be displayed.
				 *
				 * <b>Note:</b> At the moment, icons are not supported.
				 *
				 */
				items: {
					type: "sap.ui.mdc.field.ListFieldHelpItem",
					multiple: true,
					singularName : "item"
				}
			},
			defaultAggregation: "items",
			events: {

			}
		}
	});

	FixedList.prototype.init = function() {

		ListContent.prototype.init.apply(this, arguments);

		this._oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");

	};

	FixedList.prototype.exit = function() {

		if (this._oManagedObjectModel) {
			this._oManagedObjectModel.destroy();
			delete this._oManagedObjectModel;
		}

		ListContent.prototype.exit.apply(this, arguments);
	};

	FixedList.prototype.getContent = function () {
		return this._retrievePromise("content", function () {
			return loadModules([
				"sap/m/List",
				"sap/m/DisplayListItem",
				"sap/m/library",
				"sap/ui/model/Filter",
				"sap/ui/model/Sorter",
				"sap/ui/model/base/ManagedObjectModel"
			]).then(function (aModules) {
					var List = aModules[0];
					var DisplayListItem = aModules[1];
					var mLibrary = aModules[2];
					var Filter = aModules[3];
					var Sorter = aModules[4];
					var ManagedObjectModel = aModules[5];

					this._oManagedObjectModel = new ManagedObjectModel(this);

					var oItemTemplate = new DisplayListItem(this.getId() + "-item", {
						type: mLibrary.ListType.Active,
						label: "{$help>text}",
						value: "{$help>additionalText}",
						valueTextDirection: "{$help>textDirection}"
					}).addStyleClass("sapMComboBoxNonInteractiveItem"); // to add focus outline to selected items

					var oFilter = new Filter("text", _suggestFilter.bind(this));

					// add sorter only if supported
					var oSorter;
					if (this.getGroupable()) {
						oSorter = new Sorter("groupKey", false, _suggestGrouping.bind(this));
					}

					var oList = new List(this.getId() + "-List", {
						width: "100%",
						showNoData: false,
						mode: mLibrary.ListMode.SingleSelectMaster,
						rememberSelections: false,
						items: {path: "$help>/items", template: oItemTemplate, filters: oFilter, sorter: oSorter, templateShareable: false},
						itemPress: _handleItemPress.bind(this) // as selected item can be pressed
					}).addStyleClass("sapMComboBoxBaseList").addStyleClass("sapMComboBoxList");

					oList.setModel(this._oManagedObjectModel, "$help");
//					oList.bindElement({ path: "/", model: "$help" });
					this.setAggregation("_displayContent", oList, true); // to have in control tree

					return oList;
				}.bind(this));
		}.bind(this));
	};

	function _getList() {

		return this.getAggregation("_displayContent");

	}

	function _handleItemPress(oEvent) {

		var oItem = oEvent.getParameter("listItem");
		var bSelected = oItem.getSelected();

		if (bSelected) {
			var oOriginalItem = _getOriginalItem.call(this, oItem);
			var vKey = _getKey.call(this, oOriginalItem);
//			this.fireRemoveConditions({conditions: this.get_conditions()});
			_setConditions.call(this, vKey, oItem.getLabel());
//			this.fireAddConditions({conditions: this.get_conditions()});
			this.fireSelect({type: SelectType.Set, conditions: this.get_conditions()});
			this.fireConfirm();
		}

	}

	function _setConditions(vKey, sValue) {

		var oCondition = this._createCondition(vKey, sValue);
		this.setProperty("_conditions", [oCondition], true);

		return oCondition;

	}

	function _suggestFilter(sText) {

		var bFilterList = this.getFilterList();

		return !bFilterList || _filterText.call(this, sText, this.get_filterValue());

	}

	function _filterText(sText, sFilterValue) {

		return !sFilterValue || (typeof sFilterValue === "string" && (this.getCaseSensitive() ? sText.startsWith(sFilterValue) : sText.toLowerCase().startsWith(sFilterValue.toLowerCase())));

	}

	function _updateFilter() {

		var oList = _getList.call(this);
		if (oList) {
			var oBinding = oList.getBinding("items");
			oBinding.update();
			oList.updateItems();
			oList.invalidate();
			_updateSelection.call(this); // to update selection
		}

	}

	function _suggestGrouping(oContext) {

		var vKey = oContext.getProperty('groupKey');
		var sText = oContext.getProperty('groupText');
		return {key: vKey, text: sText};

	}

	function _updateSelection() {

		var oList = _getList.call(this);
		if (oList) {
			var aConditions = this.get_conditions();
			var vSelectedKey;
			var sFilterValue = this.get_filterValue();
			var bUseFirstMatch = this.getUseFirstMatch();
			var bFistFilterItemSelected = false;
//			var oOperator = this._getOperator();

			if (aConditions.length > 0 && (aConditions[0].validated === ConditionValidated.Validated || aConditions[0].operator === "EQ"/*oOperator.name*/)) {
				vSelectedKey = aConditions[0].values[0];
			}

			var aItems = oList.getItems();
			for (var i = 0; i < aItems.length; i++) {
				var oItem = aItems[i];
				if (oItem.isA("sap.m.DisplayListItem")) { // not for group headers
					var oOriginalItem = _getOriginalItem.call(this, oItem);
					if (aConditions.length > 0 && _getKey.call(this, oOriginalItem) === vSelectedKey) {
						// conditions given -> use them to show selected items
						oItem.setSelected(true);
					} else if (aConditions.length === 0 && bUseFirstMatch && sFilterValue && !bFistFilterItemSelected && _filterText.call(this, oItem.getLabel(), sFilterValue)) {
						// filter value used -> show first match as selected
						oItem.setSelected(true);
						bFistFilterItemSelected = true;
					} else if (this.hasOwnProperty("_iNavigateIndex") && i === this._iNavigateIndex) { // TODO: better solution
						// let navigated item be selected
						oItem.setSelected(true);
					} else {
						oItem.setSelected(false);
					}
				}
			}
		}
	}

	// returns ListFieldHelp item for inner list item
	function _getOriginalItem(oItem) {

		var sPath = oItem.getBindingContextPath();
		return this._oManagedObjectModel.getProperty(sPath);

	}

	function _getKey(oItem) {

		// as key could have internally another type - use initial value of binding
		// TODO: better logic?
		var oBinding = oItem.getBinding("key");
		if (oBinding) {
			return oBinding.getInternalValue();
		} else {
			return oItem.getKey();
		}

	}

	FixedList.prototype.getItemForValue = function (oConfig) {

		return Promise.resolve().then(function() {
			if (oConfig.value === null || oConfig.value === undefined) {
				return null;
			} else if (!oConfig.value && oConfig.checkDescription) {
				return null; // no check for empty description
			}

			var aItems = this.getItems();
			var oItem;
			var i = 0;
			var vKey;
			var sText;

			for (i = 0; i < aItems.length; i++) {
				oItem = aItems[i];
				vKey = _getKey.call(this, oItem);
				sText = oItem.getText();
				if ((oConfig.checkKey && vKey === oConfig.parsedValue) || (oConfig.checkDescription && (sText === oConfig.value || vKey == oConfig.value))) {
					return {key: vKey, description: oItem.getText()};
				}
			}

			if (oConfig.checkKey && oConfig.value === "") {
				// empty key and no item with empty key
				return null;
			}

			if (oConfig.checkDescription && this.getUseFirstMatch()) {
				for (i = 0; i < aItems.length; i++) {
					oItem = aItems[i];
					sText = oItem.getText();
					if (_filterText.call(this, sText, oConfig.value)) {
						vKey = _getKey.call(this, oItem);
						return {key: vKey, description: sText};
					}
				}
			}

			var sError = this._oResourceBundle.getText("valuehelp.VALUE_NOT_EXIST", [oConfig.value]);
			if (oConfig.checkKey && !oConfig.checkDescription) {
				throw new FormatException(sError);
			} else {
				throw new ParseException(sError);
			}
		}.bind(this));

	};

	FixedList.prototype.isValidationSupported = function(oConfig) {
		return true;
	};

	FixedList.prototype._handleConditionsUpdate = function(oChanges) {
		_updateSelection.call(this);
	};

	FixedList.prototype._handleFilterValueUpdate = function(oChanges) {
		_updateFilter.call(this);
	};

	FixedList.prototype.removeFocus = function() {

		var oList = _getList.call(this);
		if (oList) {
			oList.removeStyleClass("sapMListFocus");
		}

	};

	FixedList.prototype.navigate = function(iStep) {

		var oList = _getList.call(this);

		if (!oList) {
			return; // TODO: should not happen? Create List?
		}

		oList.addStyleClass("sapMListFocus"); // to show focus outline on navigated item

		var oSelectedItem = oList.getSelectedItem();
		var aItems = oList.getItems();
		var iItems = aItems.length;
		var iSelectedIndex = 0;
		var bFilterList = this.getFilterList();
		var sFilterValue = this.get_filterValue();
		var bLeaveFocus = false;

		if (!bFilterList && !oSelectedItem) {
			// try to find item that matches Filter
			var i = 0;
			if (iStep >= 0) {
				for (i = 0; i < aItems.length; i++) {
					if (_filterText.call(this, aItems[i].getLabel(), sFilterValue)) {
						iSelectedIndex = i;
						break;
					}
				}
			} else {
				for (i = aItems.length - 1; i >= 0; i--) {
					if (_filterText.call(this, aItems[i].getLabel(), sFilterValue)) {
						iSelectedIndex = i;
						break;
					}
				}
			}
		} else if (oSelectedItem) {
			iSelectedIndex = oList.indexOfItem(oSelectedItem);
			iSelectedIndex = iSelectedIndex + iStep;
		} else if (iStep >= 0){
			iSelectedIndex = iStep - 1;
		} else {
			iSelectedIndex = iItems + iStep;
		}

		var bSeachForNext;
		if (iSelectedIndex < 0) {
			iSelectedIndex = 0;
			bSeachForNext = true;
			bLeaveFocus = true;
		} else if (iSelectedIndex >= iItems - 1) {
			iSelectedIndex = iItems - 1;
			bSeachForNext = false;
		} else {
			bSeachForNext = iStep >= 0;
		}

		while (aItems[iSelectedIndex] && aItems[iSelectedIndex].isA("sap.m.GroupHeaderListItem")) { // ignore group headers
			if (bSeachForNext) {
				iSelectedIndex++;
			} else {
				iSelectedIndex--;
			}
		}

		var oItem = aItems[iSelectedIndex];
		if (oItem) {
			if (oItem !== oSelectedItem) {
				var oOriginalItem = _getOriginalItem.call(this, oItem);
				var vKey = _getKey.call(this, oOriginalItem);

				if (this.getParent().isOpen()) {
					oList.scrollToIndex(iSelectedIndex); // only possible if open
				} else {
					this._iNavigateIndex = iSelectedIndex; // TODO: better solution
				}

				oItem.setSelected(true);
				var oCondition = _setConditions.call(this, vKey, oItem.getLabel());
				this.fireNavigated({condition: oCondition, itemId: oItem.getId(), leaveFocus: false});
			} else if (bLeaveFocus) {
				this.fireNavigated({condition: undefined, itemId: undefined, leaveFocus: bLeaveFocus});
			}
		}

	};

	FixedList.prototype.onShow = function () { // TODO: name

		ListContent.prototype.onShow.apply(this, arguments);

		// scroll to selected item
		var oList = _getList.call(this);

		if (!oList) {
			return; // TODO: should not happen? Create List?
		}

		var oSelectedItem = oList.getSelectedItem();
		if (oSelectedItem) {
			var iSelectedIndex = oList.indexOfItem(oSelectedItem);
			oList.scrollToIndex(iSelectedIndex);
		}

		if (this.hasOwnProperty("_iNavigateIndex")) { // initialize after opening
			delete this._iNavigateIndex;
		}
	};

	FixedList.prototype.onHide = function () {

		this.removeFocus();

	};

	FixedList.prototype.getValueHelpIcon = function() {

		if (this.getUseAsValueHelp()) {
			return "sap-icon://slim-arrow-down";
		} else {
			return null;
		}

	};

	FixedList.prototype.getAriaAttributes = function(iMaxConditions) {

		return { // return default values, but needs to be implemented by specific content
			contentId: this.getId() + "-List", // as list might be created async, use fix ID
			ariaHasPopup: "listbox",
			roleDescription: null // no multi-selection
		};

	};

	FixedList.prototype.shouldOpenOnClick = function() {

		return !this.getFilterList(); // TODO: own property, maybe general at content?

	};

	FixedList.prototype.isFocusInHelp = function() {

		return false; // focus should stay in field, even if opened as valueHelp

	};

	FixedList.prototype._isSingleSelect = function (oEvent) {

		return true;

	};

	FixedList.prototype.shouldOpenOnNavigate = function() {

		return !ListContent.prototype._isSingleSelect.apply(this);

	};

	return FixedList;
});
