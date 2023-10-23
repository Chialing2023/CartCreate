sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"
], function (Controller, MessageBox) {
	"use strict";
	var searchAdrrVal;
	return Controller.extend("CTL.zcartcreaterequistion.controller.SearchAddress", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf CTL.zcartcreaterequistion.view.SearchAddress
		 */
		onInit: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			// this.onStateData();
			oRouter.getRoute("RouteSearchAddress").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function (oevt) {

			searchAdrrVal = oevt.getParameters().arguments.searchadd;
			var pageTitleText = "";
			var tableTitletext = "";
			if (searchAdrrVal === "shiptocode") {
				pageTitleText = "Search Shipping Info";
				tableTitletext = "Shipping Search Results";
			} else if (searchAdrrVal === "finaldestcode") {
				pageTitleText = "Search Final Destination Info";
				tableTitletext = "Final Destination Search Results";
			}
			var data = {
				pageTitleText: pageTitleText,
				tableTitletext: tableTitletext
			};
			var jsonModel = new sap.ui.model.json.JSONModel(data);
			this.getOwnerComponent().setModel(jsonModel, "AdreesTitleModel");
			// this.getView().byId("idname").setValue("");
			this.getView().byId("idstreet").setValue("");
			this.getView().byId("idStreet2").setValue("");
			this.getView().byId("idCity").setValue("");
			this.getView().byId("idAddNo").setValue("");
			this.getView().byId("idState").setValue("");
			this.getView().byId("idPostalCode").setValue("");
			// this.getView().byId("idSearchTerm1").setValue("");
			// this.getView().byId("idSearchTerm2").setValue("");
			var addresmodel = this.getOwnerComponent().getModel("AddressSearchModel");
			if (typeof (addresmodel) !== "undefined") {
				addresmodel.setData(null);
			}
		},
		navToReviewReq: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("RouteViewRequistion", {
				isAddressUpdated: true
			});
		},
		onSearchAddress: function () {

			var that = this;
			// var name = this.getView().byId("idname").getValue().trim();
			var street1 = this.getView().byId("idstreet").getValue().trim();
			var street2 = this.getView().byId("idStreet2").getValue().trim();
			var city = this.getView().byId("idCity").getValue().trim();
			var addressNo = this.getView().byId("idAddNo").getValue().trim();
            // developer changed getkey to getValue for state
			var state = this.getView().byId("idState").getValue().trim();
			var postalCode = this.getView().byId("idPostalCode").getValue().trim();
			// var searchterm1 = this.getView().byId("idSearchTerm1").getValue().trim();
			// var searchterm2 = this.getView().byId("idSearchTerm2").getValue().trim();
            //Akshara commented start
			// if (name === "" && street1 === "" && street2 === "" && city === "" && addressNo === "" && state === "" && postalCode === "") {
			// 	MessageBox.error("Please enter any field ");
			// 	return false;
			// }
            //Akshara commented end
			sap.ui.core.BusyIndicator.show();

			var oModel = this.getOwnerComponent().getModel();
			var sPath = "";
			if (searchAdrrVal === "shiptocode") {
				sPath = "/SHT_ADDRSet";
			} else if (searchAdrrVal === "finaldestcode") {
				sPath = "/DST_ADDRSet";
			}

			var filter = 
				"(STREET1 eq '" + street1.toUpperCase() + "')" +
				" and (STREET2 eq '" + street2.toUpperCase() + "')" +
				" and (CITY eq '" + city.toUpperCase() + "')" +
				" and (STATE eq '" + state.toUpperCase() + "')" +
				" and (POST_CODE1 eq '" + postalCode + "')" +
				" and (ADDRNUMBER_D eq '" + addressNo + "')";

			oModel.read(sPath, {
				urlParameters: {
					$filter: filter
				},
				success: function (odata, ores) {
					var jsonModel = new sap.ui.model.json.JSONModel(odata);
					that.getOwnerComponent().setModel(jsonModel, "AddressSearchModel");
					sap.ui.core.BusyIndicator.hide();
				},
				error: function (ores) {

					MessageBox.error(JSON.parse(ores.responseText).error.message.value);
					var addresmodel = that.getOwnerComponent().getModel("AddressSearchModel");
					if (typeof (addresmodel) !== "undefined") {
						addresmodel.setData(null);
					}
					sap.ui.core.BusyIndicator.hide();
				}
			});

		},
		onUpdateAddress: function (oevt) {
			var oTableItems = this.getView().byId("idAddressTable").getSelectedItem();
			var bindingProperty = oTableItems.getBindingContextPath();
			var tableModel = this.getOwnerComponent().getModel("AddressSearchModel");
			var addressShiptoData = this.getOwnerComponent().getModel("AddressShiptoModel").getData();
			var addressFianlData = this.getOwnerComponent().getModel("AddressFinalModel").getData();
			var data = tableModel.getProperty(bindingProperty);
			var addData = {};
			if (searchAdrrVal === "shiptocode") {

				addData = {
					ADDRNUMBER: data.ADDRNUMBER_D,
					CITY1: data.CITY,
					NAME1: data.NAME,
					NAME2: "",
					POST_CODE1: data.POST_CODE1,
					REGION: data.STATE,
					USERNAME: addressShiptoData.USERNAME,
					USERPHONENUMBER: addressShiptoData.USERPHONENUMBER,
					STREET: data.STREET1
						// ADDRNUMBER: data.ADDRNUMBER_D,
						// ADDRNUMBER_D: addressData.ADDRNUMBER_D,
						// CITY1: data.CITY,
						// CITY1_D: addressData.CITY1_D,
						// NAME1: data.NAME,
						// NAME1_D: addressData.NAME1_D,
						// NAME2: "",
						// NAME2_D: addressData.NAME2_D,
						// POST_CODE1: data.POST_CODE1,
						// POST_CODE1_D: addressData.POST_CODE1_D,
						// REGION: data.STATE,
						// REGION_D: addressData.REGION_D,
						// STREET: data.STREET1,
						// STREET_D: addressData.STREET_D,
						// USERNAME: addressData.USERNAME,
						// WERKS: addressData.WERKS
						//	UPDATED:true
				};
				var jsonMOdel = new sap.ui.model.json.JSONModel(addData);
				this.getOwnerComponent().setModel(jsonMOdel, "AddressShiptoModel");
			} else if (searchAdrrVal === "finaldestcode") {
				addData = {
					ADDRNUMBER: data.ADDRNUMBER_D,
					CITY1: data.CITY,
					NAME1: data.NAME,
					NAME2: "",
					POST_CODE1: data.POST_CODE1,
					REGION: data.STATE,
					USERNAME: addressFianlData.USERNAME,
					STREET: data.STREET1
						// ADDRNUMBER: addressData.ADDRNUMBER,
						// ADDRNUMBER_D: data.ADDRNUMBER_D,
						// CITY1_D: data.CITY,
						// CITY1: addressData.CITY1,
						// NAME1_D: data.NAME,
						// NAME1: addressData.NAME1,
						// NAME2_D: "",
						// NAME2: addressData.NAME2,
						// POST_CODE1_D: data.POST_CODE1,
						// POST_CODE1: addressData.POST_CODE1,
						// REGION_D: data.STATE,
						// REGION: addressData.REGION,
						// STREET_D: data.STREET1,
						// STREET: addressData.STREET,
						// USERNAME: addressData.USERNAME,
						// WERKS: addressData.WERKS,
						//	UPDATED:true
				};
				var jsonFinalMOdel = new sap.ui.model.json.JSONModel(addData);
				this.getOwnerComponent().setModel(jsonFinalMOdel, "AddressFinalModel");
			}

			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("RouteViewRequistion", {
				isAddressUpdated: true
			});

		},
		onClearAddress: function (oevt) {
			// this.getView().byId("idname").setValue("");
			this.getView().byId("idstreet").setValue("");
			this.getView().byId("idStreet2").setValue("");
			this.getView().byId("idCity").setValue("");
			this.getView().byId("idAddNo").setValue("");
			this.getView().byId("idState").setValue("");
			this.getView().byId("idPostalCode").setValue("");
			// this.getView().byId("idSearchTerm1").setValue("");
			// this.getView().byId("idSearchTerm2").setValue("");
			this.getOwnerComponent().getModel("AddressSearchModel").setData(null);
		},
		oncanceladdresspage: function (oevt) {
			this.getOwnerComponent().getModel("AddressSearchModel").setData(null);
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("RouteViewRequistion", {
				isAddressUpdated: true
			});
		},
		onf4forStreet: function (oevt) {
			this._matId = oevt.getSource().getId();
			if (!this._streetvaluehelp) {
				this._streetvaluehelp = sap.ui.xmlfragment("CTL.zcartcreaterequistion.fragments.streetvaluehelp", this);
				this.getView().addDependent(this._streetvaluehelp);
			}
			//this._dialogMaterialHeaderorItem = "Header";
			this._streetvaluehelp.open();
		},
		onClearStreets: function (evt) {
			sap.ui.getCore().byId("idStreetValHelp").setValue("");
			sap.ui.getCore().byId("idStreetCityExtStreetValHelp").setValue("");
			sap.ui.getCore().byId("idCityStreetValHelp").setValue("");
			sap.ui.getCore().byId("idRegionStreetValHelp").setValue("");
			sap.ui.getCore().byId("idCountryKeyStreetValHelp").setValue("");
			sap.ui.getCore().byId("idlangKeyStreetValHelp").setValue("");
		},
		onClearCity: function (evt) {
			sap.ui.getCore().byId("idCityValHelp").setValue("");
			sap.ui.getCore().byId("idCountryKeyCityValHelp").setValue("");
			sap.ui.getCore().byId("idCityExtCityValueHelp").setValue("");
			sap.ui.getCore().byId("idLangKeyCityValHelp").setValue("");
			sap.ui.getCore().byId("idRegionCityValueHelp").setValue("");
		},
		onStreetSelect: function (oevt) {

			var cityTable = sap.ui.getCore().byId("idStreetAddTable").getSelectedItem();
			var streetModel = this.getOwnerComponent().getModel("StreetModel");
			var data = streetModel.getProperty(cityTable.getBindingContextPath());
			var streetName = data.STREET;
			this.getView().byId("idstreet").setValue(streetName);
			this._streetvaluehelp.close();
		},
		onRejectSreetF4: function (oevt) {
			this._streetvaluehelp.close();
		},
		onf4forCity: function (oevt) {
			sap.ui.core.BusyIndicator.show();
			var that = this;
			this._matId = oevt.getSource().getId();
			if (!this.cityvaluehelp) {
				this.cityvaluehelp = sap.ui.xmlfragment("CTL.zcartcreaterequistion.fragments.cityvaluehelp", this);
				this.getView().addDependent(this.cityvaluehelp);
			}
			//this._dialogMaterialHeaderorItem = "Header";
			var oModel = this.getOwnerComponent().getModel();
			var sPath = "/F4_CITYSet";
			oModel.read(sPath, {
				success: function (odata, ores) {
					var cityJsonModel = new sap.ui.model.json.JSONModel(odata);
					that.getOwnerComponent().setModel(cityJsonModel, "CityModel");
					that.cityvaluehelp.open();
					sap.ui.core.BusyIndicator.hide();
				},
				error: function (ores) {
					sap.ui.core.BusyIndicator.hide();
				}
			});

		},
		onCitySelect: function (oevt) {
			var cityTable = sap.ui.getCore().byId("idCitySearchTable").getSelectedItem();
			//var contextPath = cityTable.getBindingContextPath();
			var cityModel = this.getOwnerComponent().getModel("CityModel");
			var data = cityModel.getProperty(cityTable.getBindingContextPath());
			var cityName = data.CityName;
			this.getView().byId("idCity").setValue(cityName);
			this.cityvaluehelp.close();
		},
		onSearchCity: function (evt) {
			var oBindings = sap.ui.getCore().byId("idCitySearchTable").getBinding("items");
			var city = sap.ui.getCore().byId("idCityValHelp").getValue();
			var cityExtension = sap.ui.getCore().byId("idCityExtCityValueHelp").getValue();
			var region = sap.ui.getCore().byId("idRegionCityValueHelp").getValue();
			var countryKey = sap.ui.getCore().byId("idCountryKeyCityValHelp").getValue();
			var oFilter1 = new sap.ui.model.Filter("CityName", sap.ui.model.FilterOperator.Contains, city);
			var oFilter2 = new sap.ui.model.Filter("CityExt", sap.ui.model.FilterOperator.Contains, cityExtension);
			var oFilter3 = new sap.ui.model.Filter("Region", sap.ui.model.FilterOperator.Contains, region);
			var oFilter4 = new sap.ui.model.Filter("Country", sap.ui.model.FilterOperator.Contains, countryKey);
			var allFilter = new sap.ui.model.Filter([oFilter1, oFilter2, oFilter3, oFilter4], true);
			oBindings.filter(allFilter);
		},
		onRejectCityF4: function (oevt) {
			this.cityvaluehelp.close();
		},
		onCityLiveSearch: function (oevt) {
			var searchValue = oevt.getParameters().newValue;
			var oFilter1 = new sap.ui.model.Filter("CityName", sap.ui.model.FilterOperator.Contains, searchValue);
			var allFilter = new sap.ui.model.Filter([oFilter1], false);
			var oBinding = sap.ui.getCore().byId("idCitySearchTable").getBinding("items");
			oBinding.filter(allFilter);
		},
		onSearchStreets: function (oevt) {
			sap.ui.core.BusyIndicator.show();
			var that = this;
			var streetValue = sap.ui.getCore().byId("idStreetValHelp").getValue();
			var cityExt = sap.ui.getCore().byId("idStreetCityExtStreetValHelp").getValue();
			var city = sap.ui.getCore().byId("idCityStreetValHelp").getValue();
			var region = sap.ui.getCore().byId("idRegionStreetValHelp").getValue();
			var country = sap.ui.getCore().byId("idCountryKeyStreetValHelp").getValue();
			var lang = sap.ui.getCore().byId("idlangKeyStreetValHelp").getValue();
			var model = this.getOwnerComponent().getModel();
			var sPath = "/F4STREETSet";
			var filter = "(STREET eq '" + streetValue + "') and (CITY eq '" + city + "') and (REGION eq '" + region + "' ) and (CITY_EXTN eq '" +
				cityExt + "') and (CNTRY_KEY eq '" + country + "')";
			model.read(sPath, {
				urlParameters: {
					$filter: filter
				},
				success: function (odata, ores) {
					var streetJsonModel = new sap.ui.model.json.JSONModel(odata);
					that.getOwnerCompnent().setModel(streetJsonModel, "StreetModel");
					sap.ui.core.BusyIndicator.hide();
				},
				error: function (ores) {
					MessageBox.error(JSON.parse(ores.responseText).error.message.value);
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},
		onStateData: function () {
				sap.ui.core.BusyIndicator.show();
				var filter = "(BLAND eq '') and (LAND1 eq 'US') and (REGION eq '')";
				var spath = "/F4STATESet";
				var oModel = this.getOwnerComponent().getModel();
				var that = this;
				oModel.read(spath, {
					urlParameters: {
						$filter: filter
					},
					success: function (odata, ores) {
						var jsonStreetModel = new sap.ui.model.json.JSONModel(odata);
						that.getOwnerComponent().setModel(jsonStreetModel, "StateModel");
						sap.ui.core.BusyIndicator.hide();
					},
					error: function (ores) {
						MessageBox.error(JSON.parse(ores.responseText).error.message.value);
						sap.ui.core.BusyIndicator.hide();
					}
				});
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf CTL.zcartcreaterequistion.view.SearchAddress
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf CTL.zcartcreaterequistion.view.SearchAddress
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf CTL.zcartcreaterequistion.view.SearchAddress
		 */
		//	onExit: function() {
		//
		//	}

	});

});