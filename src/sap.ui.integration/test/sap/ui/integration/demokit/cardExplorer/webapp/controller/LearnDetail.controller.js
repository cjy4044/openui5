sap.ui.define([
	"./Topic.controller",
	"../model/DocumentationNavigationModel",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(
	TopicController,
	DocumentationNavigationModel,
	JSONModel,
	Device
) {
	"use strict";

	return TopicController.extend("sap.ui.demo.cardExplorer.controller.LearnDetail", {

		/**
		 * Called when the controller is instantiated.
		 */
		onInit : function () {
			TopicController.prototype.onInit.apply(this, arguments);

			this.getRouter().getRoute("learnDetail").attachPatternMatched(this._onTopicMatched, this);
			this.oDefaultModel = new JSONModel();
			this.getView().setModel(this.oDefaultModel);
		},

		/**
		 * @override
		 */
		getNavigationModel: function() {
			return DocumentationNavigationModel;
		},

		/**
		 * Binds the view to the object path and expands the aggregated line items.
		 * @function
		 * @param {sap.ui.base.Event} event pattern match event in route 'topicId'
		 * @private
		 */
		_onTopicMatched: function (event) {
			var oArgs = event.getParameter("arguments"),
				sTopic = oArgs.topic,
				sSubTopic = oArgs.subTopic || "",
				sElementId = oArgs.id;

			// Check for deep link (id of element inside the page)
			// Note: id of element shouldn't equal any subTopic, else it won't work.
			if (sSubTopic) {
				if (this.isSubTopic(sSubTopic)) {
					sSubTopic = "/" + sSubTopic;
				} else {
					sElementId = sSubTopic;
					sSubTopic = "";
				}
			}

			var oNavEntry = this.findNavEntry(sTopic),
				sTopicURL = sap.ui.require.toUrl("sap/ui/demo/cardExplorer/topics/learn/" + sTopic + sSubTopic + '.html');

			var jsonObj = {
				pageTitle: oNavEntry.title,
				topicURL : sTopicURL,
				bIsPhone : Device.system.phone
			};

			this.oDefaultModel.setData(jsonObj);
			this.onFrameSourceChange();
			this.scrollTo(sElementId);
		}
	});

});