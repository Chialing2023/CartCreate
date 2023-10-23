sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "CTL/zcartcreaterequistion/Util/util",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox"
], function (Controller, util, History, MessageBox) {
    "use strict";

    return Controller.extend("CTL.zcartcreaterequistion.controller.ReviewRequsition", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf CTL.zcartcreaterequistion.view.ReviewRequsition
		 */
        onInit: function () {
            this._oRouter = this.getOwnerComponent().getRouter();
            this._oModel = this.getOwnerComponent().getModel();

            this._oRouter.getRoute("RouteViewRequistion").attachMatched(this._onRouteMatched, this);

        },
        _onRouteMatched: function (evt) {

            // this.getOwnerComponent().setModel(util.reviewReqSoldtoEditModel(false), "ReviewRequsitionSoldToEditModel");
            // this.getOwnerComponent().setModel(util.reviewReqFinalDestEditModel(false), "ReviewRequsitionFinalDestEditModel");

            var that = this;
            // var headData = [];
            var isAddressUpdated = evt.getParameters().arguments.isAddressUpdated;
            this.oEntry = this.getOwnerComponent().getModel("ReviewReqPayload");
            var ocostCenter = this.oEntry.ZMAT_SRCHSet[0].COST_CEN;
            this.getView().byId("cCenter").setText(ocostCenter);
            this.addrId = this.oEntry.BNAME;

            this._router = sap.ui.core.UIComponent.getRouterFor(this);




            var sPath = "/LOGINDETLSSet('" + this.addrId + "')";
            sap.ui.core.BusyIndicator.show();

            this._oModel.read(sPath, {
                success: function (odata, ores) {

                    this.addrName = odata.FULLNAME;
                    this.addrNameId = odata.BNAME;
                    this.getView().byId("addrName").setValue(this.addrName);
                    this.reqName = this.getView().byId("addrName").getValue();
                    this.addrCostCen = this.getView().byId("cCenter").getText();
                    var headData = {

                        AddrUserName: this.reqName,
                        AddrCostCenter: this.addrCostCen
                    };

                    this.getOwnerComponent().setModel(headData, "AddrHeaderModel");

                }.bind(this),
                error: function (ores) {
                    MessageBox.error(JSON.parse(ores.responseText).error.message.value);
                    MessageBox.error("Please Enter Valid User ID");

                    sap.ui.core.BusyIndicator.hide();

                }
            });








            // this.getView().byId("cCenter").setText(ocostCenter);            
            var sPath = "/SRCH_FILTSet";
            this._oModel.create(sPath, this.oEntry, {
                success: function (odata, ores) {
                    var gPrice = 0;
                    odata.NOOF_ITEMS = odata.ZMAT_SRCHSet.results.length;
                    // odata.TOTAL_PRICE = odata.ZMAT_SRCHSet.results[odata.ZMAT_SRCHSet.results.length - 1].TOT_PRICE;
                    for (var t = 0; t < odata.ZMAT_SRCHSet.results.length; t++) {
                        gPrice = Number(gPrice) + Number((odata.ZMAT_SRCHSet.results[t].TOT_PRICE).replace(/,(?=\d{3})/g, ''));
                        // String(ToT_Price.toFixed(2))
                    }

                    odata.TOTAL_PRICE = String(gPrice.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    var jsonModel = new sap.ui.model.json.JSONModel(odata);
                    that.getOwnerComponent().setModel(jsonModel, "ReviewReqModel");
                    sap.ui.core.BusyIndicator.hide();
                },
                error: function (ores) {
                    MessageBox.error("Internal Error");
                    sap.ui.core.BusyIndicator.hide();
                }
            });
            if (isAddressUpdated === "false") {
                // var addrModel = this.getOwnerComponent().getModel("AddressShiptoModel");
                //  if (typeof (addrModel) === "undefined") {
                var sPath1 = "/ADDR_DETLSSet";
                var filter = "(USERNAME eq '" + this.addrId + "')";
                this._oModel.read(sPath1, {
                    urlParameters: {
                        $filter: filter
                    },
                    success: function (odata) {

                        var shiptodata = {
                            ADDRNUMBER: odata.results[0].ADDRNUMBER,
                            CITY1: odata.results[0].CITY1,
                            NAME1: odata.results[0].NAME1,
                            NAME2: odata.results[0].NAME2,
                            POST_CODE1: odata.results[0].POST_CODE1,
                            REGION: odata.results[0].REGION,
                            USERNAME: odata.results[0].USERNAME,
                            STREET: odata.results[0].STREET,
                            USERPHONENUMBER:odata.results[0].USERPHONE
                        };
                        var finalDestdata = {
                            ADDRNUMBER: odata.results[0].ADDRNUMBER_D,
                            CITY1: odata.results[0].CITY1_D,
                            NAME1: odata.results[0].NAME1_D,
                            NAME2: odata.results[0].NAME2_D,
                            POST_CODE1: odata.results[0].POST_CODE1_D,
                            REGION: odata.results[0].REGION_D,
                            USERNAME: odata.results[0].USERNAME,
                            STREET: odata.results[0].STREET_D,
                            USERPHONENUMBER: odata.results[0].USERPHONE
                        };
                        var jsonshiptoModel = new sap.ui.model.json.JSONModel(shiptodata);
                        that.getOwnerComponent().setModel(jsonshiptoModel, "AddressShiptoModel");
                        var jsonFinalModel = new sap.ui.model.json.JSONModel(finalDestdata);
                        that.getOwnerComponent().setModel(jsonFinalModel, "AddressFinalModel");
                        sap.ui.core.BusyIndicator.hide();
                    },
                    error: function (ores) {
                        sap.ui.core.BusyIndicator.hide();
                    }
                });
            }

            //}
        },
        onNavToAddRequistion: function (oevt) {

            // var istr = "back"

            jQuery.sap.buttonPressed = "back";
            this._oRouter.navTo("RouteAddRequistion");

        },
        onEditSoldTo: function (oevt) {
            this.getOwnerComponent().setModel(util.reviewReqSoldtoEditModel(true), "ReviewRequsitionSoldToEditModel");
        },
        onEditFinalDest: function (oevt) {
            this.getOwnerComponent().setModel(util.reviewReqFinalDestEditModel(true), "ReviewRequsitionFinalDestEditModel");
        },
        onSubmitReq: function (oevt) {
            // sap.ui.getCore().byId("idComment").setValue();            
            sap.ui.core.BusyIndicator.show();
            var that = this;
            var headText = this.getOwnerComponent().getModel("ReviewReqPayload").ZMAT_SRCHSet[0].ITEM_TXT;
            var addressShiptoData = this.getOwnerComponent().getModel("AddressShiptoModel").getProperty("/");
            var addressFinalData = this.getOwnerComponent().getModel("AddressFinalModel").getProperty("/");
            var itemsData = this.getOwnerComponent().getModel("ReviewReqModel");
            var reviewTableItems = this.getView().byId("reviewReqTable").getItems();
            var ADD_REQUSet = [];
            var valName = this.getView().byId("addrName").getValue();
            var valStreet = this.getView().byId("idStreet").getValue();
            var valCity = this.getView().byId("idCity").getValue();
            var valState = this.getView().byId("idState").getValue();
            var valPostalCode = this.getView().byId("idPostal").getValue();
            reviewTableItems.forEach(function (itemData) {
                var propertyPath = itemData.getBindingContextPath();
                var data = itemsData.getProperty(propertyPath);
                var str = {
                    "WERKS": data.WERKS,
                    "MATNR": data.MATNR,
                    "CARTCODE": data.CARTCODE,
                    "ZMAKTX": data.ZMAKTX,
                    "MEINS": data.MEINS,
                    "NETPR": data.NETPR,
                    "PEINH": data.PEINH,
                    "SAKNR": data.SAKNR,
                    "ZKEY": data.ZKEY,
                    "COST_CEN": data.COST_CEN,
                    "WORK_CEN": data.WORK_CEN,
                    "GENERAL_CEN": data.GENERAL_CEN,
                    "MENGE": data.QUANTITY,
                    "AUFNR": data.AUFNR,
                    "AUFNR1": data.AUFNR1,
                    "AUFNR2": data.AUFNR2,
                    "PSPNR": data.PSPNR,
                    "REQ_TYP": data.REQ_TYP,
                    "ORD_MIN": data.ORD_MIN,
                    "ORD_MUL": data.ORD_MUL,
                    "ORD_MAX": data.ORD_MAX,
                    "BNAME": data.BNAME,
                    "ZMATNR": data.ZMATNR,
                    "QMATNR": data.QMATNR,
                    "S_MODE": data.S_MODE,
                    "ZVARIANT": data.ZVARIANT,
                    "TOT_PRICE": data.TOT_PRICE,
                    "SUM_PRICE": data.SUM_PRICE,
                    "ITEM_TXT": headText
                };
                ADD_REQUSet.push(str);
            });
            var addName1 = this.getView().byId("addrName").getValue();
// Start of Insert By DAHMAD for AD-246
            var phoneid = this.getView().byId("userPhone").getValue();  
            if(phoneid.trim().length === 0){
               sap.ui.core.BusyIndicator.hide();
               MessageBox.error("Please Enter the Phone Number."); 
            }else{   
// End of Insert By DAHMAD for AD-246                  
            var payload = {
                "USERNAME": addressShiptoData.USERNAME,
                "ADDRNUMBER": addressShiptoData.ADDRNUMBER,
                "NAME1": addName1,
                "NAME2": addressShiptoData.NAME2,
                "STREET": addressShiptoData.STREET,
                "CITY1": addressShiptoData.CITY1,
                "REGION": addressShiptoData.REGION,
                "POST_CODE1": addressShiptoData.POST_CODE1,
                "USERPHONE": addressShiptoData.USERPHONENUMBER,
                "ADDRNUMBER_D": addressFinalData.ADDRNUMBER,
                "NAME1_D": addressFinalData.NAME1,
                "NAME2_D": addressFinalData.NAME2,
                "STREET_D": addressFinalData.STREET,
                "CITY1_D": addressFinalData.CITY1,
                "REGION_D": addressFinalData.REGION,
                "POST_CODE1_D": addressFinalData.POST_CODE1,
                "WERKS": addressFinalData.WERKS,
                "ADD_REQUSet": ADD_REQUSet
            };

            if (valName == "" || valStreet == "" || valCity == "" || valState == "" || valPostalCode == "") {
                sap.ui.core.BusyIndicator.hide();
                MessageBox.error("Please use Search to select a delivery address");

            }
            else {

            var sPath = "/ADDR_DETLSSet";
            this._oModel.create(sPath, payload, {
                success: function (odata, ores) {
                    sap.ui.core.BusyIndicator.hide();
                    // MessageBox.success("Successfully Created", {
                    // 	title: "Success"
                    // });
                    if (odata.ADD_REQUSet.results[0].AUFNR == "") {
                        // that.getOwnerComponent().byId("prMsg").setType(Error);                     
                        var successmsg = {
                            //Akshara changed the MSG
                            // MSG: "Order Submitted Successfully",
                            MSG: odata.ADD_REQUSet.results[0].ITEM_TXT,
                            SHOW: true
                        };

                        var successMsgMod = new sap.ui.model.json.JSONModel(successmsg);
                        that.getOwnerComponent().setModel(successMsgMod, "SuccessMsgModel");


                    }
                    else {

                        // that.getOwnerComponent().byId("prMsg").setType(Success);
                        var successmsg = {
                            //Akshara changed the MSG
                            // MSG: "Order Submitted Successfully",
                            MSG: "Order Submitted and Purchase Requisition" + " " +
                                parseInt(odata.ADD_REQUSet.results[0].AUFNR, 10) + " " +
                                "Created Successfully",
                            // MSG: "Order Submitted and Purchase Requisition Created Successfully",
                            SHOW: true
                        };


                        var successMsgMod = new sap.ui.model.json.JSONModel(successmsg);
                        that.getOwnerComponent().setModel(successMsgMod, "SuccessMsgModel");

                        that.getOwnerComponent().getModel("AddRequistionModel").setData(null);
                        var filterJson = {
                            cartitem: "",
                            material: "",
                            matDescr: "",
                            questMat: "",
                            favourite: ""
                        };
                        var jsonFilter = new sap.ui.model.json.JSONModel(filterJson);
                        that.getOwnerComponent().setModel(jsonFilter, "FilterModel");
                        that.getOwnerComponent().setModel(util.materialsButtonEditModel(false), "ReviewRequsitionSoldToEditModel");

                        // var istr = "submit"
                        jQuery.sap.buttonPressed = "submit";

                        that._oRouter.navTo("RouteAddRequistion");

                    }
                    // var successMsgMod = new sap.ui.model.json.JSONModel(successmsg);
                    // that.getOwnerComponent().setModel(successMsgMod, "SuccessMsgModel");


                    //that.getOwnerComponent().getModel("SuccessMsgModel").getData().SHOW=true;
                    // sap.m.MessageToast.show("Successfully Created", {
                    // 	duration: 8000
                    // });
                    //MessageBox.success("Requisition is Created Successfully");



                    // that.getOwnerComponent().getModel("AddRequistionModel").setData(null);
                    // var filterJson = {
                    // 	cartitem: "",
                    // 	material: "",
                    // 	matDescr: "",
                    // 	questMat: "",
                    // 	favourite: ""
                    // };
                    // var jsonFilter = new sap.ui.model.json.JSONModel(filterJson);
                    // that.getOwnerComponent().setModel(jsonFilter, "FilterModel");
                    // that.getOwnerComponent().setModel(util.materialsButtonEditModel(false), "ReviewRequsitionSoldToEditModel");

                },
                error: function (ores) {
                    sap.ui.core.BusyIndicator.hide();
                    var successMsgMod = new sap.ui.model.json.JSONModel(successmsg);
                    that.getOwnerComponent().setModel(successMsgMod, "SuccessMsgModel");
                }
            });
            }
        }   // Added By DAHMAD for AD-246  
        },
        onBackAddReq: function () {
            jQuery.sap.buttonPressed = "back";
            this._oRouter.navTo("RouteAddRequistion");
        },
        onCancelReviewRequistion: function () {
            // sap.ui.getCore().byId("idComment").setValue("");
            var filterJson = {
                cartitem: "",
                material: "",
                matDescr: "",
                questMat: "",
                favourite: ""
            };
            var jsonFilter = new sap.ui.model.json.JSONModel(filterJson);
            this.getOwnerComponent().setModel(jsonFilter, "FilterModel");
            this.getOwnerComponent().getModel("AddRequistionModel").setData(null);

            // var istr = "cancel"
            jQuery.sap.buttonPressed = "cancel";
            this._oRouter.navTo("RouteAddRequistion");
        },
        onSearchShiptoCode: function () {
            var addressval = "shiptocode";
            this.onNavtoSearch(addressval);
        },
        onSearchFinalDestCode: function () {
            var addressval = "finaldestcode";
            this.onNavtoSearch(addressval);
        },
        onNavtoSearch: function (addressval) {
            this._oRouter.navTo("RouteSearchAddress", {
                searchadd: addressval
            });
        }

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf CTL.zcartcreaterequistion.view.ReviewRequsition
		 */
        //	onBeforeRendering: function() {
        //
        //	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf CTL.zcartcreaterequistion.view.ReviewRequsition
		 */
        //	onAfterRendering: function() {
        //
        //	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf CTL.zcartcreaterequistion.view.ReviewRequsition
		 */
        //	onExit: function() {
        //
        //	}

    });

});