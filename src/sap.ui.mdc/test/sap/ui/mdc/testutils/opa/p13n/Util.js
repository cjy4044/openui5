/*
* ! ${copyright}
*/
sap.ui.define([
], function() {
	"use strict";

    var oMDCBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");
    var oMBundle = sap.ui.getCore().getLibraryResourceBundle("sap.m");

	var Util = {

        texts: {
            resetwarning: oMBundle.getText("MSGBOX_TITLE_WARNING"),
            ok: oMDCBundle.getText("p13nDialog.OK"),
            reset: oMDCBundle.getText("p13nDialog.RESET"),
            none: oMDCBundle.getText("sort.PERSONALIZATION_DIALOG_OPTION_NONE"),
            chart: oMDCBundle.getText("p13nDialog.TAB_Chart"),
            column: oMDCBundle.getText("p13nDialog.TAB_Column"),
            filter: oMDCBundle.getText("p13nDialog.TAB_Filter"),
            group: oMDCBundle.getText("p13nDialog.TAB_Group"),
            sort: oMDCBundle.getText("p13nDialog.TAB_Sort")
        },

        icons: {
            descending: "sap-icon://sort-descending",
            ascending: "sap-icon://sort-ascending",
            decline: "sap-icon://decline",
            settings: "sap-icon://action-settings",
            movetotop: "sap-icon://collapse-group",
            movedown: "sap-icon://navigation-down-arrow",
            group: "sap-icon://group-2"
        }

    };

	return Util;
});
