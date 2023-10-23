sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "CTL/zcartcreaterequistion/Util/util",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/ColumnListItem",
    "sap/m/Label",
    "sap/m/Token",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, util, MessageBox, Fragment, JSONModel, ColumnListItem, Label, Token, MessageToast, UIComponent, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("CTL.zcartcreaterequistion.controller.AddRequistion", {

        onInit: function () {


            this._router = sap.ui.core.UIComponent.getRouterFor(this);
            this._model = this.getOwnerComponent().getModel();
            var model = this.getOwnerComponent().getModel("UserModel");
            var userId = sap.ushell.Container.getService("UserInfo").getId();
            if (this.behFullName) {
                this.getView().byId("idSAPUserName").setText(this.behFullName);
            }
            if (this.behCartCode) {
                this.getView().byId("idSAPUserName").setText(this.behCartCode);
            }


            var headerData = this.getOwnerComponent().getModel("AddrHeaderModel");
            if (headerData) {
                this.getView().byId("idSAPUserName").setText(headerData.AddrUserName);
                this.getView().byId("idCostCent").setValue(headerData.AddrCostCenter);
            }

            var sPath = "/LOGINDETLSSet('" + userId + "')";
            sap.ui.core.BusyIndicator.show();

            this._model.read(sPath, {
                success: function (odata, ores) {
                    var userInfo = {
                        userId: odata.BNAME,
                        userName: odata.FULLNAME,
                        costCenter: odata.COST_CEN
                    };
                    var jsonUser = new sap.ui.model.json.JSONModel(userInfo);
                    that.getOwnerComponent().setModel(jsonUser, "UserModel");
                    sap.ui.core.BusyIndicator.hide();

                    var headerData = this.getOwnerComponent().getModel("AddrHeaderModel");
                    if (headerData) {
                        this.getView().byId("idSAPUserName").setText(headerData.AddrUserName);
                        this.getView().byId("idCostCent").setValue(headerData.AddrCostCenter);
                    }

                }.bind(this),
                error: function (ores) {
                    // MessageBox.error(JSON.parse(ores.responseText).error.message.value);
                    MessageBox.error("Please Enter Valid User ID");
                    var userInfo = {
                        userId: "",
                        userName: "",
                        costCenter: ""
                    };
                    var jsonUser = new sap.ui.model.json.JSONModel(userInfo);
                    this.getOwnerComponent().setModel(jsonUser, "UserModel");
                    sap.ui.core.BusyIndicator.hide();
                    // this.onClearFilter();
                }
            });



            var that = this;


            if (typeof (model) === "undefined") {
                var userId = sap.ushell.Container.getService("UserInfo").getId();
                var fisrtName = sap.ushell.Container.getService("UserInfo").getUser().getFirstName();
                var lastName = sap.ushell.Container.getService("UserInfo").getUser().getLastName();
                var userInfo = {
                    userId: userId,
                    userName: fisrtName + " " + lastName
                };
                var jsonUser = new sap.ui.model.json.JSONModel(userInfo);
                this.getOwnerComponent().setModel(jsonUser, "UserModel");

            }

            var filterJson = {
                cartitem: "",
                material: "",
                matDescr: "",
                manfacNo: "",
                // questMat: "",
                favourite: ""
            };
            var jsonFilter = new sap.ui.model.json.JSONModel(filterJson);
            this.getOwnerComponent().setModel(jsonFilter, "FilterModel");
            var successModel = this.getOwnerComponent().getModel("SuccessMsgModel");
            if (typeof (successModel) === "undefined") {
                var successmsg = {
                    MSG: "Order is Created Successfully",
                    SHOW: false
                };
                var successMsgMod = new sap.ui.model.json.JSONModel(successmsg);
                this.getOwnerComponent().setModel(successMsgMod, "SuccessMsgModel");
            }
            this.getOwnerComponent().setModel(util.materialsButtonEditModel(false), "ReviewRequsitionSoldToEditModel");

            this._oRouter = this.getOwnerComponent().getRouter();
            this._oModel = this.getOwnerComponent().getModel();

            //             this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            //  this._oRouter.attachRouteMatched(this.yurfunction, this);

            const route = UIComponent.getRouterFor(this).getRoute("RouteAddRequistion");
            route.attachPatternMatched(this._onRouteMatched, this);

            // this._oRouter.getRoute("RouteAddRequistion").attachMatched(this._onRouteMatched, this);
            var headerData = this.getOwnerComponent().getModel("AddrHeaderModel");

            if (headerData) {
                this.getView().byId("idSAPUserName").setText(headerData.AddrUserName);
                this.getView().byId("idCostCent").setValue(headerData.AddrCostCenter);
            }
        },


        _onRouteMatched: function (evt) {
            var fisrtName = sap.ushell.Container.getService("UserInfo").getUser().getFirstName();
            var lastName = sap.ushell.Container.getService("UserInfo").getUser().getLastName();
            var userId = sap.ushell.Container.getService("UserInfo").getId();

            var userName = fisrtName + " " + lastName;
            if (this.behFullName) {
                this.getView().byId("idSAPUserName").setText(this.behFullName);
            }
            if (this.behCartCode) {
                this.getView().byId("idSAPUserName").setText(this.behCartCode);
            }
            this.headerData = this.getOwnerComponent().getModel("AddrHeaderModel");


            var buttonClicked = jQuery.sap.buttonPressed;
            var tableLength = this.getView().byId("idReqDetailTable").getItems().length;


            if (buttonClicked == "cancel") {
                this.getView().byId("idSAPuserid").setVisible(true);
                this.getView().byId("idSAPuserid").setValue(userId);
                this.getView().byId("idSAPUserName").setText(userName);

                var sPath = "/LOGINDETLSSet('" + userId + "')";
                sap.ui.core.BusyIndicator.show();

                this._model.read(sPath, {
                    success: function (odata, ores) {
                        this.getView().byId("idCostCent").setValue(odata.COST_CEN);

                        sap.ui.core.BusyIndicator.hide();
                    }.bind(this),
                    error: function (ores) {
                        MessageBox.error(JSON.parse(ores.responseText).error.message.value);

                        sap.ui.core.BusyIndicator.hide();

                    }
                });



                this.getOwnerComponent().getModel("AddRequistionModel").setData(null);
                var oData = [];
                this.getView().getModel("AddRequistionModel").setData(oData);
                this.getOwnerComponent().getModel("AddRequistionModel").setData(oData);
                var AddRequistionModelRe = this.getOwnerComponent().getModel("AddRequistionModel");
                AddRequistionModelRe.refresh();
                this.getView().byId("idcomment").setVisible(false);
                this.getView().byId("idReviewReq").setVisible(false);
                this.getView().byId("idCancelReq").setVisible(false);
                this.getView().byId("idSaveReq").setVisible(false);

                if (this._ocommentDialog) {
                    sap.ui.getCore().byId("idComment").setValue();
                }

            }
            else if (buttonClicked == "back") {

                if (this.behFullName) {
                    this.getView().byId("idSAPUserName").setText(this.behFullName);
                }
                if (this.behCartCode) {
                    this.getView().byId("idSAPUserName").setText(this.behCartCode);
                }
                this.getView().byId("idcomment").setVisible(true);
                this.getView().byId("idReviewReq").setVisible(true);
                this.getView().byId("idCancelReq").setVisible(true);
                this.getView().byId("idSaveReq").setVisible(true);
                var headerData = this.getOwnerComponent().getModel("AddrHeaderModel");
                this.getView().byId("idSAPUserName").setText(headerData.AddrUserName);
                this.getView().byId("idCostCent").setValue(headerData.AddrCostCenter);
            }

            else {
                this.getView().byId("idSAPuserid").setVisible(true);
                this.getView().byId("idSAPuserid").setValue(userId);
                this.getView().byId("idSAPUserName").setText(userName);
                this.getView().byId("idcomment").setVisible(false);
                this.getView().byId("idReviewReq").setVisible(false);
                this.getView().byId("idCancelReq").setVisible(false);
                this.getView().byId("idSaveReq").setVisible(false);



                var sPath = "/LOGINDETLSSet('" + userId + "')";
                sap.ui.core.BusyIndicator.show();

                this._model.read(sPath, {
                    success: function (odata, ores) {
                        this.getView().byId("idCostCent").setValue(odata.COST_CEN);
                        this.adCostCen = odata.COST_CEN;
                        sap.ui.core.BusyIndicator.hide();
                    }.bind(this),
                    error: function (ores) {
                        MessageBox.error(JSON.parse(ores.responseText).error.message.value);

                        sap.ui.core.BusyIndicator.hide();

                    }
                });

                this.getOwnerComponent().getModel("AddRequistionModel").setData(null);
                var oData = [];
                this.getView().getModel("AddRequistionModel").setData(oData);
                this.getOwnerComponent().getModel("AddRequistionModel").setData(oData);
                var AddRequistionModelRe = this.getOwnerComponent().getModel("AddRequistionModel");
                AddRequistionModelRe.refresh();

                this.getView().byId("idcomment").setVisible(false);
                this.getView().byId("idReviewReq").setVisible(false);
                this.getView().byId("idCancelReq").setVisible(false);
                this.getView().byId("idSaveReq").setVisible(false);

                this.getOwnerComponent().setModel(util.materialsButtonEditModel(false), "ReviewRequsitionSoldToEditModel");
               
                if (this._ocommentDialog) {
                    sap.ui.getCore().byId("idComment").setValue();
                }
                this._ocommentDialog.destroy();
                delete this._ocommentDialog;

            }

            if (buttonClicked == "submit") {
                this.getView().byId("idSAPuserid").setVisible(true);
                this.getView().byId("idSAPuserid").setValue(userId);
                this.getView().byId("idSAPUserName").setText(userName);
                this.getView().byId("idcomment").setVisible(false);
                this.getView().byId("idReviewReq").setVisible(false);
                this.getView().byId("idCancelReq").setVisible(false);
                this.getView().byId("idSaveReq").setVisible(false);
                var sPath = "/LOGINDETLSSet('" + userId + "')";
                sap.ui.core.BusyIndicator.show();

                this._model.read(sPath, {
                    success: function (odata, ores) {
                        this.getView().byId("idCostCent").setValue(odata.COST_CEN);

                        sap.ui.core.BusyIndicator.hide();
                    }.bind(this),
                    error: function (ores) {
                        MessageBox.error(JSON.parse(ores.responseText).error.message.value);

                        sap.ui.core.BusyIndicator.hide();

                    }
                });


                this.getOwnerComponent().getModel("AddRequistionModel").setData(null);
                var oData = [];
                this.getView().getModel("AddRequistionModel").setData(oData);
                this.getOwnerComponent().getModel("AddRequistionModel").setData(oData);
                var AddRequistionModelRe = this.getOwnerComponent().getModel("AddRequistionModel");
                AddRequistionModelRe.refresh();

                this.getView().byId("idcomment").setVisible(false);
                this.getView().byId("idReviewReq").setVisible(false);
                this.getView().byId("idCancelReq").setVisible(false);
                this.getView().byId("idSaveReq").setVisible(false);

                this.getOwnerComponent().setModel(util.materialsButtonEditModel(false), "ReviewRequsitionSoldToEditModel");
                var c = sap.ushell.Container.getService("UserInfo").getId();

                if (this._ocommentDialog) {
                    sap.ui.getCore().byId("idComment").setValue();
                }

            }
            var tableLength = this.getView().byId("idReqDetailTable").getItems().length;
            if (tableLength === 0) {
                var userId = sap.ushell.Container.getService("UserInfo").getId();
                if (this._ocommentDialog) {
                    sap.ui.getCore().byId("idComment").setValue();
                }
                var fisrtName = sap.ushell.Container.getService("UserInfo").getUser().getFirstName();
                var lastName = sap.ushell.Container.getService("UserInfo").getUser().getLastName();
                var userName = fisrtName + " " + lastName;
                this.getView().byId("idSAPuserid").setVisible(true);
                this.getView().byId("idSAPuserid").setValue(userId);
                this.getView().byId("idSAPUserName").setText(userName);
                this.getView().byId("idCostCent").setValue(this.adCostCen);


            }
            else {
                this.getView().byId("idSAPuserid").setVisible(false);
            }

        },

        //  Developer added comment box code
        onPressComment: function (oEvent) {


            if (this._ocommentDialog) {
                var oComValue = sap.ui.getCore().byId("idComment").getValue();

                this._ocommentDialog.destroy();
                delete this._ocommentDialog;
            }



            if (!this._ocommentDialog) {
                this._ocommentDialog = sap.ui.xmlfragment("CTL.zcartcreaterequistion.fragments.commentBox", this);
                this.getView().addDependent(this._ocommentDialog);
            }

            this._ocommentDialog.open();
            if (oComValue) {
                sap.ui.getCore().byId("idComment").setValue(oComValue);
            }

        },

        onCommentSave: function (oEvent) {
            this.hText = sap.ui.getCore().byId("idComment").getValue();
            // var items = this.getView().byId("idReqDetailTable").getItems();  
            //          items[0].ITEM_TXT =  this.hText;            

            //  var oFavElementData = {

            //     ITEM_TEXT: this.hText
            // };
            // // this.oEntry = this.getOwnerComponent().getModel("ReviewReqPayload");
            // this._oModel.create("/ADD_REQUWset",
            //     oFavElementData,

            //     {
            //         success: function (oData) {
            MessageToast.show("Data is saved");
            this._ocommentDialog.close();
            //             // this.favouriteElementSet();

            //         },
            //         error: function (oError) {

            //             MessageToast.show(JSON.parse(oError.responseText).error.message.value);

            //         }
            //     }
            // );

        },

        onCancelComment: function (oEvent) {
            this._ocommentDialog.close();
        },


        //Aksharaa added handlevalue help function
        handleValueHelp: function (oEvent) {

            this._sInputId = oEvent.getSource().getId();
            if (!this._userid) {
                this._userid = sap.ui.xmlfragment("CTL.zcartcreaterequistion.fragments.userid",
                    this);
                this.getView().addDependent(this._userid);
            }
            this._userid.open();

            var elementJSON = new sap.ui.model.json.JSONModel();
            // var userId = "";
            // var sPath = "/LOGINDETLSSet('" + userId + "')";

            var that = this;

            that._model.read("/LOGINDETLSSet", {

                success: function (oData) {
                    //akshara2 added function for elements

                    elementJSON.setData(oData);
                    that.getView().setModel(elementJSON, "elementJSON");
                    sap.ui.getCore().setModel(elementJSON, "elementJSON");

                }.bind(this),
                error: function (oError) {
                    that.hideBusyIndicator();
                    MessageToast.show(JSON.parse(oError.responseText).error.message.value);
                }
            });
        },

        _handleValueHelpSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var PMFilter = [new Filter("BNAME", "Contains", sValue), new Filter("FULLNAME", "Contains", sValue)];
            var oFilter = new Filter({
                filters: PMFilter
            });

            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter(oFilter);
            oEvent.getSource().getBinding("items").filter([oFilter]);
        },

        _handleValueHelpClose: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            if (oSelectedItem) {
                var productInput = this.byId(this._sInputId);
                productInput.setValue(oSelectedItem.getTitle());
                this.beFullName = oSelectedItem.getDescription();
            }
            oEvent.getSource().getBinding("items").filter([]);
            this.onSearchSUserId();
        },

        onReviewRequistion: function (oevt) {
            this.behFullName = this.getView().byId("idSAPUserName").getText();
            this.behCartCode = this.getView().byId("idCostCent").getValue();
            sap.ui.core.BusyIndicator.show();
            var Bname = this.getView().byId("idSAPuserid").getValue();
            var CARTCODE = this.getView().byId("idCartItem").getValue();
            var matnr = this.getView().byId("idMaterial").getValue();
            var matDesc = this.getView().byId("idMaterialDesc").getValue();
            var manfacNo = this.getView().byId("idManufac").getValue();
            // var questmat = this.getView().byId("idQuestMaterial").getValue();
            var fav = this.getView().byId("idFavList").getValue();
            var idTable = this.getView().byId("idReqDetailTable").getSelectedItems();
            var tableModel = this.getView().byId("idReqDetailTable").getModel("AddRequistionModel");

            if (idTable.length !== 0) {
                var check;
                var aMockMessages = [];
                var items = tableModel.getProperty("/results");
                var valid;
                //items.forEach(function (cartItem) {
                for (var i = 0; i < items.length; i++) {
                    var cartItem = items[i];
                    var zmatnr = cartItem.MATNR;
                    var cartCode = cartItem.CARTCODE;
                    var maktx = cartItem.ZMAKTX;
                    var manfacNo = cartItem.MFRPN;
                    if (cartCode === "" || zmatnr === "" || maktx === "" || manfacNo === "") {
                        valid = true;
                        this.getView().byId("idReqDetailTable").getItems()[i].setHighlight(sap.ui.core.MessageType.Error);
                        this.getView().byId("idReqDetailTable").getItems()[i].getCells()[0].setValueState("Error");
                        this.getView().byId("idReqDetailTable").getItems()[i].getCells()[1].setValueState("Error");
                        this.getView().byId("idReqDetailTable").getItems()[i].getCells()[10].setValueState("Error");
                        sap.m.MessageToast.show("Please Fill The cart item " + (i + 1), {
                            at: "center center"
                        });
                        break;
                    } else {
                        valid = false;
                    }
                }
                if (valid) {
                    sap.ui.core.BusyIndicator.hide();
                    return true;
                }
                // Quantity validation at line item
                idTable.forEach(function (lineitems) {
                    var path = lineitems.getBindingContextPath();
                    var data = tableModel.getProperty(path);
                    var minQty = data.ORD_MIN;
                    var maxQty = data.ORD_MAX;
                    var quantity = data.QUANTITY.trim();
                    var matnr = data.MATNR;
                    var cartCode = data.CARTCODE;
                    var ordMultiple = data.ORD_MUL;
                    //Surya Add Check for Order Multiple Zero   
                    if (Number(ordMultiple) === 0) {
                        var mulVal = 0;
                    }
                    else {
                        mulVal = quantity % ordMultiple;
                    };

                    if (mulVal !== 0) {
                        var str = {
                            type: 'Error',
                            title: cartCode + ' Quantity Validation',
                            description: 'Quantity is not a multiple of Order Multiple. Please enter the suitable value',
                            subtitle: 'Quantity should be a multiple of Order'
                        };
                        aMockMessages.push(str);
                        // MessageBox.error("");

                    }
                    //Surya


                    var costCenter = data.COST_CEN;
                    if (costCenter === "") {
                        var str = {
                            type: 'Error',
                            title: 'Cost Center Validation',
                            description: 'Maintain Cost Center for the User ID',
                            subtitle: 'Maintain Cost Center for the User ID'
                        };
                        aMockMessages.push(str);
                    }




                    if (quantity === "0" || quantity === "") {
                        var str = {
                            type: 'Error',
                            title: cartCode + ' Quantity Validation',
                            description: 'Quantity should be greater than zero',
                            subtitle: 'Quantity should be greater than zero'
                        };
                        aMockMessages.push(str);
                    }
                    //Akshara added number to the quantity                    
                    if (Number(minQty) !== 0) {
                        if (Number(maxQty) !== 0) {

                            if (!(Number(maxQty) >= Number(quantity) && Number(minQty) <= Number(quantity))) {
                                var str = {
                                    type: 'Error',
                                    title: 'Cart Item( ' + cartCode + ' )Quantity Validation',
                                    description: 'Please enter quantity between ' + minQty + ' to ' + maxQty + " for material " + matnr,
                                    subtitle: 'Please enter quantity between ' + minQty + ' to ' + maxQty + " for material " + matnr
                                };
                                aMockMessages.push(str);
                            }
                        }
                    }
                });

                var oMessageTemplate = new sap.m.MessageItem({
                    type: '{type}',
                    title: '{title}',
                    description: '{description}',
                    subtitle: '{subtitle}',
                    counter: '{counter}',
                    markupDescription: '{markupDescription}'
                });

                var oModel = new sap.ui.model.json.JSONModel();

                oModel.setData(aMockMessages);

                var oMessageView = new sap.m.MessageView({

                    showDetailsPageHeader: false,
                    items: {
                        path: "/",
                        template: oMessageTemplate
                    }
                });

                oMessageView.setModel(oModel);

                this.oDialog = new sap.m.Dialog({
                    resizable: true,
                    content: oMessageView,
                    state: 'Error',
                    title: 'Quantity Validation',
                    beginButton: new sap.m.Button({
                        press: function () {
                            this.getParent().close();
                        },
                        text: "Close"
                    }),
                    customHeader: new sap.m.Bar({
                        contentMiddle: [
                            new Text({
                                text: "Error"
                            })
                        ]
                    }),
                    contentHeight: "25%",
                    contentWidth: "30%",
                    verticalScrolling: false
                });

                sap.ui.core.BusyIndicator.hide();
                if (aMockMessages.length !== 0) {
                    this.oDialog.open();
                    return false;
                }

            } else {
                MessageBox.error("Please select The Items");
                sap.ui.core.BusyIndicator.hide();
                return false;
            }
            var lineItems = [];

            //    this.getView().byId(totPrice).setText(ToT_Price);
            var grandPrice = 0;
            for (var i = 0; i < idTable.length; i++) {
                var contextPath = this.getView().byId("idReqDetailTable").getSelectedItems()[i].getBindingContextPath();
                var contextData = tableModel.getProperty(contextPath);
                var data = {};
                data.AUFNR = contextData.AUFNR;
                data.AUFNR1 = contextData.AUFNR1;
                data.AUFNR2 = contextData.AUFNR2;
                data.BNAME = contextData.BNAME;
                data.CARTCODE = contextData.CARTCODE;
                data.COST_CEN = contextData.COST_CEN;
                data.GENERAL_CEN = contextData.GENERAL_CEN;
                data.MATNR = contextData.MATNR;
                data.MEINS = contextData.MEINS;
                data.MENGE = contextData.MENGE;
                data.NETPR = contextData.NETPR;
                data.MFRPN = contextData.MFRPN;
                data.ZMFNAME = contextData.ZMFNAME;
                data.ORD_MAX = contextData.ORD_MAX;
                data.ORD_MIN = contextData.ORD_MIN;
                data.ORD_MUL = contextData.ORD_MUL;
                data.PEINH = contextData.PEINH;
                data.PSPNR = contextData.PSPNR;
                data.QMATNR = contextData.QMATNR;
                data.QUANTITY = contextData.QUANTITY;
                data.REQ_TYP = contextData.REQ_TYP;
                data.SAKNR = contextData.SAKNR;
                data.SUM_PRICE = contextData.SUM_PRICE;
                data.S_MODE = contextData.S_MODE;
                if (i == 0) {
                    data.ITEM_TXT = this.hText;
                }
                //Akshara coded for TOTAL price
                var ToT_Price = (data.NETPR) * (data.QUANTITY) / (data.PEINH);


                grandPrice = grandPrice + ToT_Price;
                var grandTotal = String(grandPrice);

                var totalPrice = String(ToT_Price.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                // String(gPrice.toFixed(2).replace('.',','));
                data.TOT_PRICE = totalPrice;
                data.WERKS = contextData.WERKS;
                data.WORK_CEN = contextData.WORK_CEN;
                data.ZKEY = contextData.ZKEY;
                data.ZMAKTX = contextData.ZMAKTX;

                data.ZVARIANT = contextData.ZVARIANT;
                // data.ITEM_TXT = this.hText;
                // data.GPrice = grandTotal;
                // this.getView().byId("totPrice").setText(grandTotal);

                lineItems.push(data);
            }
            var payLoad = {
                "BNAME": Bname.toString(),
                "CARTCODE": CARTCODE.toString(),
                "ZMATNR": matnr.toString(),
                "ZMAKTX": matDesc.toString(),
                "MFRPN": manfacNo.toString(),
                "ZVARIANT": fav.toString(),
                "QMATNR": "",
                "ZMAT_SRCHSet": lineItems
            };
            this.getOwnerComponent().setModel(payLoad, "ReviewReqPayload");
            this._router.navTo("RouteViewRequistion", {
                isAddressUpdated: false
            });


        },
        onQuantityValidation: function (oevt) {
            var quantity = oevt.getSource().getValue();
            var numbers = /^[0-9]+$/;
            if (quantity !== "") {
                if (!quantity.match(numbers)) {
                    MessageBox.error("Enter numeric Values only ");
                    oevt.getSource().setValue(0);
                }
            }
        },
        onMaterialValueHelpDialog: function (oevt) {
            this._matId = oevt.getSource().getId();
            if (!this._oValueHelpDialog) {
                this._oValueHelpDialog = sap.ui.xmlfragment("CTL.zcartcreaterequistion.fragments.materialHelp", this);
                this.getView().addDependent(this._oValueHelpDialog);
            }
            this._dialogMaterialHeaderorItem = "Header";
            var materilHeaderData = {
                oldmatno: "",
                matnr: "",
                l3matcode: "",
                longdesc: "",
                hecicode: "",
                aiccode: "",
                icccode: "",
                mastermarno: ""
            };
            var materailf4data = new sap.ui.model.json.JSONModel(materilHeaderData);
            this.getOwnerComponent().setModel(materailf4data, "Matf4Model");
            var materailModel = this.getOwnerComponent().getModel("MaterailModel");
            if (typeof (materailModel) !== "undefined") {
                materailModel.setData(null);
            }
            this._oValueHelpDialog.open();
        },
        onClearMatf4: function (oevt) {
            var materilHeaderData = {
                oldmatno: "",
                matnr: "",
                l3matcode: "",
                longdesc: "",
                hecicode: "",
                aiccode: "",
                icccode: "",
                mastermarno: ""
            };
            var materailf4data = new sap.ui.model.json.JSONModel(materilHeaderData);
            this.getOwnerComponent().setModel(materailf4data, "Matf4Model");
            this.getOwnerComponent().getModel("MaterailModel").setData(null);
        },
        materialValueHelp: function (oevt) {
            this._matId = oevt.getSource().getId();
            if (!this._oMaterialValHelpDialog) {
                this._oMaterialValHelpDialog = sap.ui.xmlfragment("CTL.zcartcreaterequistion.fragments.materialHelp", this);
                this.getView().addDependent(this._oMaterialValHelpDialog);
            }
            this._dialogMaterialHeaderorItem = "Item";
            this._parentControl = oevt.getSource().getParent();
            var materilHeaderData = {
                oldmatno: "",
                matnr: "",
                l3matcode: "",
                longdesc: "",
                hecicode: "",
                aiccode: "",
                icccode: "",
                mastermarno: ""
            };
            var materailf4data = new sap.ui.model.json.JSONModel(materilHeaderData);
            this.getOwnerComponent().setModel(materailf4data, "Matf4Model");
            var materailModel = this.getOwnerComponent().getModel("MaterailModel");
            if (typeof (materailModel) !== "undefined") {
                materailModel.setData(null);
            }
            this._oMaterialValHelpDialog.open();
        },
        onFilterBarSearch: function (oevt) {
            var oTable = this._oValueHelpDialog.getTable();

            var data = {
                rows: this.getOwnerComponent().getModel("JSONREQ").getProperty("/").MaterialsList,
                columns: this.getOwnerComponent().getModel("JSONREQ").getProperty("/").ColumnsData
            };
            var oModel = new sap.ui.model.json.JSONModel(data);
            oTable.setModel(oModel);
            oTable.bindRows("/rows");
            this._oValueHelpDialog.update();
        },
        onValueHelpCancelPress: function (oevt) {
            this._oValueHelpDialog.close();
        },
        onValueHelpOkPress: function (oevt) {

            var selectedItemLength = oevt.getParameter("tokens").length;
            if (selectedItemLength <= 1) {
                var material = oevt.getParameter("tokens")[0].getKey();
                this._oValueHelpDialog.close();
            } else {
                MessageBox.error("Please select the one item");
                return false;
            }

        },
        onFavListValueHelp: function (oevt) {
            var suserid = this.getView().byId("idSAPuserid").getValue();
            var IDregex = /^[A-Za-z]{3}[0-9]{6}/;
            //Akshara commented start
            // if (!suserid.match(IDregex)) {
            // 	MessageBox.error("Please Enter correct SAPID Eg..SAP123456");
            // 	return false;
            // }
            //Akshara commented end
            sap.ui.core.BusyIndicator.show();
            var that = this;
            if (!this._oFavListDialog) {
                this._oFavListDialog = sap.ui.xmlfragment("CTL.zcartcreaterequistion.fragments.favourites", this);
                this.getView().addDependent(this._oFavListDialog);
            }
            var sPath = "/ZVAR_F4HLPSet";
            var filter = "(BNAME eq '" + suserid + "' and ZVARIANT eq '*')";
            this._model.read(sPath, {
                urlParameters: {
                    $filter: filter
                },
                success: function (odata) {

                    var jsonVaraintModel = new sap.ui.model.json.JSONModel(odata);
                    that.getOwnerComponent().setModel(jsonVaraintModel, "VaraintModel");
                    that._oFavListDialog.open();
                    sap.ui.core.BusyIndicator.hide();
                },
                error: function (ores) {
                    MessageBox.error(JSON.parse(ores.responseText).error.message.value);
                    sap.ui.core.BusyIndicator.hide();

                }
            });

        },
        onSelectVaraint: function (oevt) {
            var varaintname = oevt.getParameter("selectedItems")[0].getCells()[0].getText();
            this.getView().byId("idFavList").setValue(varaintname);
        },
        handleVariantSearch: function (oevt) {

            var searchValue = oevt.getParameters().value;
            var oFilter1 = new sap.ui.model.Filter("ZVARIANT", sap.ui.model.FilterOperator.Contains, searchValue);
            var oFilter2 = new sap.ui.model.Filter("VARI_DES", sap.ui.model.FilterOperator.Contains, searchValue);
            var allFilter = new sap.ui.model.Filter([oFilter1, oFilter2], false);
            var oBinding = oevt.getSource().getBinding("items");
            oBinding.filter(allFilter);
        },
        favDialogClose: function (oevt) {
            oevt.getSource().getBinding("items").filter([]);
            this.getView().byId("idVaraintName").setValue("");
            this.getView().byId("idVaraintDescription").setValue("");
        },
        onAddRequisition: function (oevt) {
            var sUserId = this.getView().byId("idSAPuserid").getValue();
            var matnr = this.getView().byId("idMaterial").getValue().toUpperCase();
            // var qmatnr = this.getView().byId("idQuestMaterial").getValue().toUpperCase();
            var matDesc = this.getView().byId("idMaterialDesc").getValue().toUpperCase();
            var manfacNo = this.getView().byId("idManufac").getValue();
            var favList = this.getView().byId("idFavList").getValue();
            var cartCode = this.getView().byId("idCartItem").getValue();
            var IDregex = /^[A-Za-z]{3}[0-9]{6}/;
            var userId = this.getView().byId("idSAPuserid").getValue();
            //Akshara commented start
            // if (!sUserId.match(IDregex)) {
            // 	MessageBox.error("Please Enter correct SAPID Eg..SAP123456");
            // 	return false;
            // }
            //Akshara commented end
            var that = this;
            var model = this.getOwnerComponent().getModel("AddRequistionModel");
            var existed = false;
            var tableLength = this.getView().byId("idReqDetailTable").getItems().length;

            var IDregex = /^[A-Za-z]{3}[0-9]{6}/;
            //Akshara added userID validation            

            var sPath = "/LOGINDETLSSet('" + userId + "')";
            sap.ui.core.BusyIndicator.show();

            this._model.read(sPath, {
                success: function (odata, ores) {
                    var userInfo = {
                        userId: odata.BNAME,
                        userName: odata.FULLNAME,
                        costCenter: odata.COST_CEN
                    };
                    var jsonUser = new sap.ui.model.json.JSONModel(userInfo);
                    that.getOwnerComponent().setModel(jsonUser, "UserModel");
                    sap.ui.core.BusyIndicator.hide();
                    that.onUserValSuccess();
                    // var tableLength = this.getView().byId("idReqDetailTable").getItems().length;
                    //Akshara added code 
                    if (tableLength > 0) {
                        that.getView().byId("idSAPuserid").setVisible(false);
                    }
                    that.onClearFilter();
                    //Akshara end
                }.bind(this),
                error: function (ores) {
                    // MessageBox.error(JSON.parse(ores.responseText).error.message.value);
                    MessageBox.error("Please Enter Valid User ID");
                    var userInfo = {
                        userId: "",
                        userName: "",
                        costCenter: ""
                    };
                    var jsonUser = new sap.ui.model.json.JSONModel(userInfo);
                    that.getOwnerComponent().setModel(jsonUser, "UserModel");
                    sap.ui.core.BusyIndicator.hide();
                    this.onClearFilter();
                }
            });

        },

        //Akshara added function onUserValSuccess for userID validation                
        onUserValSuccess: function () {

            var sUserId = this.getView().byId("idSAPuserid").getValue();
            var matnr = this.getView().byId("idMaterial").getValue().toUpperCase();
            // var qmatnr = this.getView().byId("idQuestMaterial").getValue().toUpperCase();
            var matDesc = this.getView().byId("idMaterialDesc").getValue().toUpperCase();
            var favList = this.getView().byId("idFavList").getValue();
            var cartCode = this.getView().byId("idCartItem").getValue();
            var manfacNo = this.getView().byId("idManufac").getValue();
            var IDregex = /^[A-Za-z]{3}[0-9]{6}/;
            var userId = this.getView().byId("idSAPuserid").getValue();
            //Akshara commented start
            // if (!sUserId.match(IDregex)) {
            // 	MessageBox.error("Please Enter correct SAPID Eg..SAP123456");
            // 	return false;
            // }
            //Akshara commented end
            var that = this;
            var model = this.getOwnerComponent().getModel("AddRequistionModel");
            var existed = false;
            var tableLength = this.getView().byId("idReqDetailTable").getItems().length;
            if (tableLength !== 0) {
                var length = model.getData().results.length;
                for (var j = 0; j < length; j++) {
                    if (cartCode !== model.getData().results[j].CARTCODE) {
                        existed = false;
                    } else {
                        MessageBox.error("Cart Item " + cartCode + "  already exists");
                        existed = true;
                        break;
                    }
                    if (matnr !== model.getData().results[j].MATNR) {
                        existed = false;
                    } else {
                        MessageBox.error("Material " + matnr + "  already exists");
                        existed = true;
                        break;
                    }
                    if (matDesc !== model.getData().results[j].ZMAKTX) {
                        existed = false;
                    } else {
                        MessageBox.error("Material " + matDesc + "  already exists");
                        existed = true;
                        break;
                    }
                    if (manfacNo !== model.getData().results[j].MFRPN) {
                        existed = false;
                    } else {
                        MessageBox.error("Material " + manfacNo + "  already exists");
                        existed = true;
                        break;
                    }
                    // if (qmatnr !== model.getData().results[j].MATNR) {
                    // 	existed = false;
                    // } else {
                    // 	MessageBox.error("Material " + qmatnr + " is already existed");
                    // 	existed = true;
                    // 	break;
                    // }
                }
            }
            if (existed) {
                return true;
            }
            if (cartCode.trim() !== "" || matnr.trim() !== "" || matDesc.trim() !== "" || manfacNo.trim() !== "" || favList.trim() !== "") {
                sap.ui.core.BusyIndicator.show();
                var sPath = "/ZVAR_SRCHSet";
                var filter = "(BNAME eq '" + sUserId + "' and MFRPN eq '" + manfacNo + "' and ZMATNR eq '" + matnr + "' and QMATNR eq '' and ZMAKTX eq '" + matDesc +
                    "' and CARTCODE eq '" + cartCode + "' and ZVARIANT eq '" + favList + "')";
                this._model.read(sPath, {
                    urlParameters: {
                        $filter: filter
                    },
                    success: function (odata, ores) {
                        var jsonMaterial = new sap.ui.model.json.JSONModel();
                        if (odata.results.length == 0) {
                            if (cartCode.trim() !== "" && matnr.trim() !== "" && matDesc.trim() == "" && manfacNo.trim() == "") {
                                MessageBox.error("Material number does not belong to the CART ID")

                            }
                            else if (cartCode.trim() !== "" && matnr.trim() == "" && matDesc.trim() !== "" && manfacNo.trim() == "") {
                                MessageBox.error("Material description does not belong CART ID")

                            }
                            else if (cartCode.trim() !== "" && matnr.trim() == "" && matDesc.trim() == "" && manfacNo.trim() !== "") {
                                MessageBox.error("Manufacturing part number does not belong CART ID")

                            }
                            else {
                                MessageBox.error("No Item exits for entered filters")
                            }
                        }
                        if (tableLength !== 0) {
                            if (favList === "") {
                                var data = [];
                                var existedVal = false;
                                var modelLength = model.getData().results;
                                var cartValidString = "";
                                for (var k1 = 0; k1 < odata.results.length; k1++) { // odata data
                                    var cartItemfromOdata = odata.results[k1].CARTCODE;
                                    data = [];
                                    for (var k2 = 0; k2 < tableLength; k2++) { // table data
                                        var cartitemtable = model.getData().results[k2].CARTCODE;
                                        if (cartitemtable !== cartItemfromOdata) {
                                            existedVal = false;
                                        } else {
                                            existedVal = true;
                                            break;
                                        }
                                    }
                                    if (existedVal) {
                                        cartValidString = cartValidString + cartItemfromOdata + ",";
                                        //MessageBox.error("Cart Item /Material is already existed");
                                        //break;
                                    } else {
                                        odata.results[k1].ZEDITABLE = false;
                                        odata.results[k1].ZVAlSTATE = "None";
                                        model.getData().results.push(odata.results[k1]);
                                    }
                                }
                                // if (cartValidString != "") {
                                // 	//if (favList === "") {
                                // 	MessageBox.error("Cart Item " + cartValidString.slice(0, -1) + " already exists");
                                // 	//	}

                                // }
                                //model.getData().results.push(data);
                                odata.results = model.getData().results;
                                odata.NOOF_ITEMS = "Order Data(" + odata.results.length + ")";
                                jsonMaterial.setData(odata);
                            } else {
                                odata.NOOF_ITEMS = "Order Data(" + odata.results.length + ")";
                                for (var i = 0; i < odata.results.length; i++) {
                                    odata.results[i].ZEDITABLE = false;
                                    odata.results[i].ZVAlSTATE = "None";
                                }
                                jsonMaterial.setData(odata);
                            }
                        } else {
                            odata.NOOF_ITEMS = "Order Data(" + odata.results.length + ")";
                            for (var i = 0; i < odata.results.length; i++) {
                                odata.results[i].ZEDITABLE = false;
                                odata.results[i].ZVAlSTATE = "None";
                            }
                            jsonMaterial.setData(odata);
                        }

                        that.getOwnerComponent().setModel(jsonMaterial, "AddRequistionModel");
                        var successmsg = {
                            MSG: "",
                            SHOW: false
                        };
                        var successMsgMod = new sap.ui.model.json.JSONModel(successmsg);
                        that.getOwnerComponent().setModel(successMsgMod, "SuccessMsgModel");
                        that.getOwnerComponent().setModel(util.materialsButtonEditModel(true), "ReviewRequsitionSoldToEditModel");
                        //Surya begin of added code
                        that.getView().byId("idSAPuserid").setVisible(false);
                        //Surya end of added code
                        sap.ui.core.BusyIndicator.hide();
                        // that.getView().byId("idReqDetailTable").setSelected(true);
                    },
                    error: function (ores) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageBox.error(JSON.parse(ores.responseText).error.message.value);
                    }
                });
            } else {
                MessageBox.error("Enter SAP Material Number, CART Item, Material Description or Favorite");
                return false;
            }
        },
        onFilterReqItems: function (oevt) {
            var searchValue = oevt.getSource().getValue();
            var oFilter1 = new sap.ui.model.Filter("CARTCODE", sap.ui.model.FilterOperator.Contains, searchValue);
            var oFilter2 = new sap.ui.model.Filter("MATNR", sap.ui.model.FilterOperator.Contains, searchValue);
            var oFilter3 = new sap.ui.model.Filter("ZMAKTX", sap.ui.model.FilterOperator.Contains, searchValue);
            var oFilter4 = new sap.ui.model.Filter("SAKNR", sap.ui.model.FilterOperator.Contains, searchValue);
            var oFilter5 = new sap.ui.model.Filter("MFRPN", sap.ui.model.FilterOperator.Contains, searchValue);
            var allFilter = new sap.ui.model.Filter([oFilter1, oFilter2, oFilter3, oFilter4, oFilter5], false);
            var oBinding = this.getView().byId("idReqDetailTable").getBinding("items");
            oBinding.filter(allFilter);
        },
        onDeleteVaraint: function (oevt) {

            var spath = oevt.getSource().getParent().getBindingContextPath();
            var variantData = oevt.getSource().getModel("VaraintModel").getProperty(spath);
            this.varaintName = variantData.ZVARIANT;
            this.varaintDescription = variantData.VARI_DES;
            var suserid = this.getView().byId("idSAPuserid").getValue();
            if (!this.mDialog) {
                this.mDialog = new sap.m.Dialog({
                    content: [
                        new sap.m.Text({
                            id: "idDeleteVaraint",
                            //    Akshara changed the text                        
                            text: "Do you want to Delete the Item from Favourite?"
                        })
                    ],
                    beginButton: [
                        new sap.m.Button({
                            text: "OK",
                            press: function (oevt) {
                                this.onDeleteVaraintOk(this.varaintName, suserid);
                            }.bind(this)
                        })
                    ]
                });
            };
            this.mDialog.open();
        },
        onDeleteVaraintOk: function (varaintName, suserid) {

            sap.ui.core.BusyIndicator.show();
            var that = this;
            var oEntry = {};
            oEntry.BNAME = suserid.toString();
            oEntry.CARTCODE = "";
            oEntry.ZMATNR = "";
            oEntry.ZMAKTX = "";
            oEntry.MFRPN = "";
            oEntry.ZVARIANT = varaintName.toString();
            var varaint = varaintName.replace(/[&\/\\#,+()$~%.'":*?<>{}@]/g, '');
            var sPath = "/ZVAR_SRCHSet('" + varaint + "')";
            this._model.update(sPath, oEntry, {
                method: "PUT",
                success: function (data, ores) {

                    that.mDialog.close();
                    var results = that._oFavListDialog.getModel("VaraintModel").getProperty("/results");
                    var varaintResults = [];
                    for (var i = 0; i < results.length; i++) {
                        var varaintItems = results[i];
                        if (varaintName !== varaintItems.ZVARIANT) {
                            varaintResults.push(varaintItems);
                        }
                    }
                    that._oFavListDialog.getModel("VaraintModel").setProperty("/results", varaintResults);
                    sap.ui.core.BusyIndicator.hide();
                },
                error: function (e) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageBox.error(JSON.parse(e.responseText).error.message.value);
                    that.mDialog.close();
                }
            });

        },
        onRemoveItem: function () {
            // sap.ui.getCore().byId("idComment").setValue();
            if (this._ocommentDialog) {
                sap.ui.getCore().byId("idComment").setValue();
            }
            var oTable = this.getView().byId("idReqDetailTable");

            var selectedIndicies = oTable.getSelectedItems().map(function (item) {
                var path = item.getBindingContextPath();
                return parseInt(path.substring(path.lastIndexOf('/') + 1));
            });
            if (selectedIndicies.length === 0) {
                MessageBox.error("Please Select Any Item");
                return false;
            }
            var oModel = oTable.getModel("AddRequistionModel");
            var oItems = oModel.getProperty('/results');
            for (var i = selectedIndicies.length - 1; i >= 0; --i) {
                oItems.splice(selectedIndicies[i], 1);
            }
            oModel.setProperty('/results', oItems);
            oModel.setProperty("/NOOF_ITEMS", "Order Data(" + oModel.getProperty("/results").length + ")");
            oTable.removeSelections();
            //Surya Begin of Change          
            var items = this.getView().byId("idReqDetailTable").getItems();
            if (items.length === 0) {
                this.getView().byId("idSAPuserid").setVisible(true);
            }
            //Surya End of Change                                  
        },
        onAddItem: function (oEvt) {
            var oModel = this.getOwnerComponent().getModel("AddRequistionModel");
            var reqItems = oModel.getProperty("/results");
            var valid;
            for (var i = 0; i < reqItems.length; i++) {
                var cartCode = reqItems[i].CARTCODE;
                var MATNR = reqItems[i].MATNR;
                var ZMAKTX = reqItems[i].ZMAKTX;
                var MFRPN = reqItems[i].MFRPN;
                if (cartCode === "" || MATNR === "" || ZMAKTX === "" || MFRPN === "") {
                    valid = true;
                    this.getView().byId("idReqDetailTable").getItems()[i].setHighlight(sap.ui.core.MessageType.Error);
                    this.getView().byId("idReqDetailTable").getItems()[i].getCells()[0].setValueState("Error");
                    this.getView().byId("idReqDetailTable").getItems()[i].getCells()[1].setValueState("Error");
                    this.getView().byId("idReqDetailTable").getItems()[i].getCells()[10].setValueState("Error");
                    sap.m.MessageToast.show("Please Fill The cart item " + (i + 1), {
                        at: "center center"
                    });
                    break;
                } else {
                    this.getView().byId("idReqDetailTable").getItems()[i].setHighlight(sap.ui.core.MessageType.None);
                    // this.getView().byId("idReqDetailTable").getItems()[i].getCells()[0].setValueState("None");
                    // this.getView().byId("idReqDetailTable").getItems()[i].getCells()[1].setValueState("None");
                    // this.getView().byId("idReqDetailTable").getItems()[i].getCells()[10].setValueState("None");
                    valid = false;
                }
            }
            if (valid) {
                return false;
            }
            var json = {
                AUFNR: "",
                AUFNR1: "",
                AUFNR2: "",
                BNAME: "",
                CARTCODE: "",
                COST_CEN: "",
                GENERAL_CEN: "",
                MATNR: "",
                MEINS: "",
                MENGE: "",
                NETPR: "",
                MFRPN: "",
                ZMFNAME: "",
                ORD_MAX: "",
                ORD_MIN: "",
                ORD_MUL: "",
                PEINH: "",
                PSPNR: "",
                QMATNR: "",
                QUANTITY: "",
                REQ_TYP: "",
                SAKNR: "",
                SUM_PRICE: "",
                S_MODE: "",
                TOT_PRICE: "",
                WERKS: "",
                WORK_CEN: "",
                ZKEY: "",
                ZMAKTX: "",
                MFRPN: "",
                ZMATNR: "",
                ZVARIANT: "",
                ZEDITABLE: true
            };
            reqItems.push(json);
            oModel.setProperty("/results", reqItems);
        },
        onSubmitCartCode: function (evt) {
            var cartCode = evt.getSource().getValue();
            var items = this.getView().byId("idReqDetailTable").getItems();
            var oModel = this.getOwnerComponent().getModel("AddRequistionModel");
            var cartValidation;
            for (var i = 0; i < items.length; i++) {
                var contextPath = items[i].getBindingContextPath();
                var data = oModel.getProperty(contextPath);
                var cartCodeItem = data.CARTCODE;
                if (!data.ZEDITABLE) {
                    if (cartCode === cartCodeItem) {
                        cartValidation = true;
                        break;
                    } else {
                        cartValidation = false;
                    }
                }
            }
            if (cartValidation) {
                MessageBox.error(cartCode + " Cart Code are already existed");
                return false;
            }
            var parent = evt.getSource().getParent();
            var matnr = "";
            var sUserId = this.getView().byId("idSAPuserid").getValue();
            var IDregex = /^[A-Za-z]{3}[0-9]{6}/;
            //Akshara commented start
            // if (!sUserId.match(IDregex)) {
            // 	MessageBox.error("Please Enter correct SAPID Eg..SAP123456");
            // 	return false;
            // }
            //Akshara commented end
            if (cartCode === "") {
                MessageBox.error("Please Enter CartItem");
                return false;
            }
            this.onItemAddTable(cartCode, matnr, sUserId, parent);
        },
        onSubmitMaterialItem: function (evt) {

            var matnr = evt.getSource().getValue();
            var cartCode = "";
            var items = this.getView().byId("idReqDetailTable").getItems();
            var oModel = this.getOwnerComponent().getModel("AddRequistionModel");
            var matnrValidation;
            for (var i = 0; i < items.length; i++) {
                var contextPath = items[i].getBindingContextPath();
                var data = oModel.getProperty(contextPath);
                var matnrItem = data.MATNR;
                if (!data.ZEDITABLE) {
                    if (matnr === matnrItem) {
                        matnrValidation = true;
                        break;
                    } else {
                        matnrValidation = false;
                    }
                }
            }
            if (matnrValidation) {
                MessageBox.error(matnr + " Material are already existed");
                return false;
            }
            var parent = evt.getSource().getParent();
            var sUserId = this.getView().byId("idSAPuserid").getValue();
            var IDregex = /^[A-Za-z]{3}[0-9]{6}/;
            //Akshara commented start
            // if (!sUserId.match(IDregex)) {
            // 	MessageBox.error("Please Enter correct SAPID Eg..SAP123456");
            // 	return false;
            // }
            //Akshara commented end
            if (matnr === "") {
                MessageBox.error("Please Enter Material");
                return false;
            }
            this.onItemAddTable(cartCode, matnr, sUserId, parent);
        },
        onItemAddTable: function (cartCode, matnr, sUserId, parent) {
            var that = this;
            var columnlist = parent;
            //var idrow = columnlist.getId()
            var contextPath = parent.getBindingContextPath();
            sap.ui.core.BusyIndicator.show();
            var sPath = "/ZVAR_SRCHSet";
            var filter = "(BNAME eq '" + sUserId + "' and ZMATNR eq '" + matnr + "' and QMATNR eq '' and ZMAKTX eq '' and CARTCODE eq '" +
                cartCode + "' and ZVARIANT eq '')";
            this._model.read(sPath, {
                urlParameters: {
                    $filter: filter
                },
                success: function (odata, ores) {
                    var oModel = that.getOwnerComponent().getModel("AddRequistionModel");
                    var aData = oModel.getData();
                    var data = [];

                    var json = {
                        AUFNR: odata.results[0].AUFNR,
                        AUFNR1: odata.results[0].AUFNR1,
                        AUFNR2: odata.results[0].AUFNR2,
                        BNAME: odata.results[0].BNAME,
                        CARTCODE: odata.results[0].CARTCODE,
                        COST_CEN: odata.results[0].COST_CEN,
                        GENERAL_CEN: odata.results[0].GENERAL_CEN,
                        MATNR: odata.results[0].MATNR,
                        MEINS: odata.results[0].MEINS,
                        MENGE: odata.results[0].MENGE,
                        NETPR: odata.results[0].NETPR,
                        MFRPN: odata.results[0].MFRPN,
                        ZMFNAME: odata.results[0].ZMFNAME,
                        ORD_MAX: odata.results[0].ORD_MAX,
                        ORD_MIN: odata.results[0].ORD_MIN,
                        ORD_MUL: odata.results[0].ORD_MUL,
                        PEINH: odata.results[0].PEINH,
                        PSPNR: odata.results[0].PSPNR,
                        QMATNR: odata.results[0].QMATNR,
                        QUANTITY: odata.results[0].QUANTITY,
                        REQ_TYP: odata.results[0].REQ_TYP,
                        SAKNR: odata.results[0].SAKNR,
                        SUM_PRICE: odata.results[0].SUM_PRICE,
                        S_MODE: odata.results[0].S_MODE,
                        TOT_PRICE: odata.results[0].TOT_PRICE,
                        WERKS: odata.results[0].WERKS,
                        WORK_CEN: odata.results[0].WORK_CEN,
                        ZKEY: odata.results[0].ZKEY,
                        ZMAKTX: odata.results[0].ZMAKTX,
                        MFRPN: odata.results[0].MFRPN,
                        ZMATNR: odata.results[0].ZMATNR,
                        ZVARIANT: odata.results[0].ZVARIANT,
                        ZEDITABLE: false, // Custom property for validation
                        ZVAlSTATE: "None" // Custom property for adding item to cart
                    };
                    oModel.setProperty(contextPath, json);
                    oModel.setProperty("/NOOF_ITEMS", "Order Data(" + oModel.getProperty("/results").length + ")");
                    //aData.results.push(json);
                    // that.getView().byId("idReqDetailTable").removeItem(sap.ui.getCore().byId(idrow));
                    // var model = new sap.ui.model.json.JSONModel(aData);
                    // that.getOwnerComponent().setModel(model, "AddRequistionModel");
                    sap.ui.core.BusyIndicator.hide();
                },
                error: function (ores) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageBox.error(JSON.parse(ores.responseText).error.message.value);
                    // that.getOwnerComponent().setModel("", "AddRequistionModel");
                }
            });
        },
        onSearchSUserId: function (evt) {

            var that = this;
            // var userId = evt.getSource().getValue();
            //Surya Begin of Code Change
            // var items = that.getView().byId("idReqDetailTable").getItems();

            // if (items.length === 0) {
            //Surya End of Code Change            
            var userId = that.getView().byId("idSAPuserid").getValue();
            var IDregex = /^[A-Za-z]{3}[0-9]{6}/;
            //Akshara commented start
            // if (!userId.match(IDregex)) {
            // 	if (userId !== "") {
            // 		MessageBox.error("Please Enter correct SAPID Eg..SAP123456");
            // 	}
            // 	return false;
            // }
            //Akshara commented end
            var sPath = "/LOGINDETLSSet('" + userId + "')";
            sap.ui.core.BusyIndicator.show();
            this._model.read(sPath, {
                success: function (odata, ores) {
                    var userInfo = {
                        userId: odata.BNAME,
                        userName: odata.FULLNAME,
                        costCenter: odata.COST_CEN
                    };
                    var jsonUser = new sap.ui.model.json.JSONModel(userInfo);
                    that.getOwnerComponent().setModel(jsonUser, "UserModel");
                    sap.ui.core.BusyIndicator.hide();
                    // this.getView().byId("idSAPUserName")			
                }.bind(this),
                error: function (ores) {
                    // MessageBox.error(JSON.parse(ores.responseText).error.message.value);
                    MessageBox.error("Please Enter Valid User ID");
                    var userInfo = {
                        userId: "",
                        userName: "",
                        costCenter: ""
                    };
                    var jsonUser = new sap.ui.model.json.JSONModel(userInfo);
                    that.getOwnerComponent().setModel(jsonUser, "UserModel");
                    sap.ui.core.BusyIndicator.hide();
                }
            });
            //Surya Begin of Code Change
            // }

            // else {
            //     MessageBox.error("Please do not change  requester User ID after adding line items");
            //     var userInfo = {
            // 		userId: curUser,
            // 		userName: curUserName
            // 	};
            // 	var jsonUser = new sap.ui.model.json.JSONModel(userInfo);
            // 	that.getOwnerComponent().setModel(jsonUser, "UserModel");
            // 	sap.ui.core.BusyIndicator.hide();
            //     return false;
            // }
            //Surya End of Code Change


        },
        onSaveVaraint: function (oevt) {

            var items = this.getView().byId("idReqDetailTable").getSelectedItems();
            if (items.length === 0) {
                MessageBox.error("Select One Order item");
                return false;
            }
            if (!this.oVaraintDialog) {
                this.oVaraintDialog = new sap.m.Dialog({
                    title: "Save Variant",
                    id: "idVaraintDialog",
                    draggable: true,
                    content: [
                        new sap.m.HBox({
                            justifyContent: "Center",
                            items: [

                                new sap.m.VBox({
                                    justifyContent: "Center",

                                    items: [
                                        new sap.m.Label({
                                            text: "Variant Name",
                                            required: true

                                        }),
                                        new sap.m.Input({
                                            id: "idVaraintName",
                                            value: "",
                                            showSuggestion: true
                                        }),
                                        new sap.m.Label({
                                            text: "Variant Description",
                                            required: true
                                        }),
                                        new sap.m.Input({
                                            id: "idVaraintDescription",
                                            value: "",
                                            showSuggestion: true
                                        })
                                    ]
                                })

                            ]
                        }),
                    ],
                    beginButton: new sap.m.Button({
                        type: sap.m.ButtonType.Emphasized,
                        text: "Save",
                        press: function (oevt) {
                            this.onVaraintSaveOk();
                        }.bind(this)
                    }),
                    endButton: new sap.m.Button({
                        text: "Cancel",
                        press: function () {
                            this.oVaraintDialog.close();
                        }.bind(this)
                    })
                });
            }
            // if (!this.oVaraintDialog) {
            // 	this.oVaraintDialog = new sap.m.Dialog({
            // 		contentWidth:"20%",
            // 		title: "Save Varaint",
            // 		id: "idVaraintDialog",
            // 		content: [
            // 			new sap.ui.layout.form.SimpleForm({

            // 				layout: "ResponsiveGridLayout",
            // 				// labelSpanXL: 3,
            // 				// labelSpanL: 3,
            // 				// labelSpanM: 3,
            // 				// labelSpanS: 12,
            // 				// adjustLabelSpan: false,
            // 				// emptySpanXL: 4,
            // 				// emptySpanL:4,
            // 				// emptySpanM: 4,
            // 				// emptySpanS: 0,
            // 				// columnsXL: 1,
            // 				// columnsL: 1,
            // 				// columnsM: 1,
            // 				content: [
            // 					new sap.m.Label({
            // 						text: "Varaint Name",
            // 						required: true
            // 					}),
            // 					new sap.m.Input({
            // 						id: "idVaraintName",
            // 						value: ""
            // 					}),
            // 					new sap.m.Label({
            // 						text: "Varaint Description",
            // 						required: true
            // 					}),
            // 					new sap.m.Input({
            // 						id: "idVaraintDescription",
            // 						value: ""
            // 					})
            // 				]
            // 			})
            // 		],
            // 		beginButton: new sap.m.Button({
            // 			type: sap.m.ButtonType.Emphasized,
            // 			text: "Save",
            // 			press: function (oevt) {
            // 				this.onVaraintSaveOk();
            // 			}.bind(this)
            // 		}),
            // 		endButton: new sap.m.Button({
            // 			text: "Cancel",
            // 			press: function () {
            // 				this.oVaraintDialog.close();
            // 			}.bind(this)
            // 		})
            // 	});
            // }
            this.oVaraintDialog.open();
        },
        onVaraintSaveOk: function () {

            var that = this;
            sap.ui.core.BusyIndicator.show();
            var varaintName = sap.ui.getCore().byId("idVaraintName").getValue();
            var varaintDesc = sap.ui.getCore().byId("idVaraintDescription").getValue();
            var suserid = this.getView().byId("idSAPuserid").getValue();
            if (varaintName.trim() === "" || varaintDesc.trim() === "") {
                MessageBox.error("Please Enter Varaint Details");
                sap.ui.core.BusyIndicator.hide();
                return true;
            }
            var oTable = this.getView().byId("idReqDetailTable");
            var oModelTable = oTable.getModel("AddRequistionModel");
            var items = [];
            var selectedItems = oTable.getSelectedItems();
            for (var i = 0; i < selectedItems.length; i++) {
                var sProperty = selectedItems[i].getBindingContextPath();
                var data = oModelTable.getProperty(sProperty);
                var str = {
                    "BNAME": suserid,
                    "ZVARIANT": varaintName,
                    "SEQ": "",
                    "VARI_DES": varaintDesc,
                    "CARTCODE": data.CARTCODE,
                    "LVORM": ""

                };
                items.push(str);
            }
            var payLoad = {
                "BNAME": suserid,
                "CARTCODE": "",
                "ZMATNR": "",
                "ZMAKTX": "",
                "MFRPN": "",
                "ZVARIANT": varaintName,
                "ZVAR_F4HLPSet": items
            };
            this._model.create("/ZVAR_SRCHSet", payLoad, {
                success: function (odata, ores) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageBox.success("Variant Created Successfully");
                    that.oVaraintDialog.close();
                },
                error: function (ores) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageBox.error("Favorite Name Should be of Length 12 Charecters");
                    that.oVaraintDialog.close();
                }
            });

        },
        onEditAccountAssign: function (evt) {
            var that = this;
            var oTable = this.getView().byId("idReqDetailTable");
            var oModelTable = oTable.getModel("AddRequistionModel");
            var items = [];
            var selectedItems = oTable.getSelectedItems();
            if (selectedItems.length > 1 || selectedItems.length === 0) {
                MessageBox.error("Please Select One Order item");
                return true;
            }

            var suserid = this.getView().byId("idSAPuserid").getValue();
            var IDregex = /^[A-Za-z]{3}[0-9]{6}/;
            //Akshara commented start
            // if (!suserid.match(IDregex)) {
            // 	MessageBox.error("Please Enter correct SAPID Eg..SAP123456");
            // 	return false;
            // }
            //Akshara commented end

            if (!this._editAccDialog) {
                this._editAccDialog = sap.ui.xmlfragment("CTL.zcartcreaterequistion.fragments.editAccountAssignment", this);
                this.getView().addDependent(this._editAccDialog);
            }

            this.contextPath = selectedItems[0].getBindingContextPath();
            var data = oModelTable.getProperty(this.contextPath);
            if (data.CARTCODE === "" && data.MATNR === "") {
                MessageBox.error("Please Enter Cart Item");
                return false;
            }
            sap.ui.core.BusyIndicator.show();
            var modeljson = new sap.ui.model.json.JSONModel(data);
            that.getOwnerComponent().setModel(modeljson, "AccountAssignModel");
            var sPath = "/AS_DDPLANTSet";
            var filter = "(UNAME eq '" + suserid + "')";
            this._model.read(sPath, {
                urlParameters: {
                    $filter: filter
                },
                success: function (odata, ores) {
                    var plantgrp = new sap.ui.model.json.JSONModel(odata);
                    that.getOwnerComponent().setModel(plantgrp, "PlantGrpModel");
                },
                error: function (ores) {
                    MessageBox.error(JSON.parse(ores.responseText).error.message.value);
                }
            });

            that._editAccDialog.open();
            sap.ui.core.BusyIndicator.hide();
        },
        onUpdateAccount: function (evt) {
            this.onUpdateAccountAssign().bind(this, evt);
        },
        onUpdateAccountAssign: function (evt) {
            var dialog = evt.getSource().getParent();
            var that = this;
            var model = this.getOwnerComponent().getModel("AccountAssignModel");
            var data = model.getProperty("/");
            var items = [];
            sap.ui.core.BusyIndicator.show();
            var suserid = this.getView().byId("idSAPuserid").getValue();
            var str = {
                "WERKS": data.WERKS,
                "MATNR": data.MATNR,
                "CARTCODE": data.CARTCODE,
                "ZMAKTX": data.ZMAKTX,
                "MFRPN": data.MFRPN,
                "MEINS": data.MEINS,
                "NETPR": data.NETPR,
                "ZMFNAME": data.ZMFNAME,
                "PEINH": data.PEINH,
                "SAKNR": data.SAKNR,
                "ZKEY": data.ZKEY,
                "COST_CEN": data.COST_CEN,
                "WORK_CEN": data.WORK_CEN,
                "GENERAL_CEN": data.GENERAL_CEN,
                "MENGE": data.MENGE,
                "AUFNR": data.AUFNR,
                "AUFNR1": data.AUFNR1,
                "AUFNR2": data.AUFNR2,
                "PSPNR": data.PSPNR,
                "REQ_TYP": data.REQ_TYP,
                "ORD_MIN": data.ORD_MIN,
                "ORD_MUL": data.ORD_MUL,
                "ORD_MAX": data.ORD_MAX,
                "QUANTITY": data.QUANTITY,
                "BNAME": data.BNAME,
                "ZMATNR": data.ZMATNR,
                "QMATNR": data.QMATNR,
                "S_MODE": data.S_MODE,
                "ZVARIANT": data.ZVARIANT,
                "TOT_PRICE": data.TOT_PRICE,
                "SUM_PRICE": data.SUM_PRICE
            };
            items.push(str);
            var payLoad = {
                "BNAME": suserid.toString(),
                "CARTCODE": data.CARTCODE,
                "ACCT_ASSGNSet": items
            };
            var sPath = "/ACCT_HDRSet";
            this._model.create(sPath, payLoad, {
                success: function (odata) {
                    odata.ACCT_ASSGNSet.results[0].ZEDITABLE = false;
                    var data1 = odata.ACCT_ASSGNSet.results[0];
                    that.getOwnerComponent().getModel("AddRequistionModel").setProperty(that.contextPath, data1);
                    dialog.close();
                    sap.ui.core.BusyIndicator.hide();
                },
                error: function (ores) {
                    MessageBox.error(JSON.parse(ores.responseText).error.message.value);
                    sap.ui.core.BusyIndicator.hide();

                }
            });

        },
        onCancelAccoutAssign: function (evt) {

            evt.getSource().getParent().close();
        },
        onClearFilter: function (evt) {

            this.getView().byId("idMaterial").setValue("");
            // this.getView().byId("idQuestMaterial").setValue("");
            this.getView().byId("idMaterialDesc").setValue("");
            this.getView().byId("idManufac").setValue("");
            this.getView().byId("idFavList").setValue("");
            this.getView().byId("idCartItem").setValue("");
        },
        onBeforeRendering: function (oevt) {

            var items = this.getView().byId("idReqDetailTable").getItems();
            if (items.length != 0) {
                this.getView().byId("idTableSearchField").setVisible(true);
                //	this.getView().byId("idAddItemBtn").setVisible(true);
                this.getView().byId("idRemoveItemBtn").setVisible(true);
                //Akshara commented ideditacc
                // this.getView().byId("idEditAcc").setVisible(true);
                this.getView().byId("idReviewReq").setVisible(true);
                this.getView().byId("idCancelReq").setVisible(true);
                this.getView().byId("idSaveReq").setVisible(true);
            } else {
                this.getView().byId("reqTableHeaderText").setText("Order Data");
                this.getView().byId("idTableSearchField").setVisible(false);
                //	this.getView().byId("idAddItemBtn").setVisible(false);
                this.getView().byId("idRemoveItemBtn").setVisible(false);
                //Akshara commented ideditacc                
                // this.getView().byId("idEditAcc").setVisible(false);
                this.getView().byId("idReviewReq").setVisible(false);
                this.getView().byId("idCancelReq").setVisible(false);
                this.getView().byId("idSaveReq").setVisible(false);
            }
            var oFilter = this.getView().byId("idFilterbar");
            oFilter.addEventDelegate({
                "onAfterRendering": function (oEvent) {
                    oEvent.srcControl.getContent()[0].getContent()[0].setWidth("5rem");
                    oEvent.srcControl.getContent()[0].getContent()[1].setWidth("8rem");
                    oEvent.srcControl.getContent()[0].getContent()[2].setWidth("8rem");
                    oEvent.srcControl.getContent()[0].getContent()[3].setWidth("8rem");
                    // oEvent.srcControl.getContent()[0].getContent()[4].setWidth("5rem");
                    //Akshara commented start
                    // oEvent.srcControl.getContent()[0].getContent()[4].getContent()[1].getContent()[3].setText("Add To Order");
                    // oEvent.srcControl.getContent()[0].getContent()[4].getContent()[1].getContent()[3].setIcon("sap-icon://cart");
                    // oEvent.srcControl.getContent()[0].getContent()[4].getContent()[1].getContent()[0].setType("Emphasized");
                    // oEvent.srcControl.getContent()[0].getContent()[4].getContent()[1].getContent()[0].setIcon("sap-icon://sys-cancel");
                    //Akshara commented end
                }
            });
        },
        onNavToTileGroup: function (oevt) {
            this._router.navTo("CartTilesGroup");
        },
        onCancelRequisition: function (oevt) {
            if (this._ocommentDialog) {
                sap.ui.getCore().byId("idComment").setValue();
            }

            var filterJson = {
                cartitem: "",
                material: "",
                matDescr: "",
                manfacNo: "",
                // questMat: "",
                favourite: ""
            };
            var jsonFilter = new sap.ui.model.json.JSONModel(filterJson);
            this.getOwnerComponent().setModel(jsonFilter, "FilterModel");
            //this.getView().byId("idReqDetailTable").destroyItems();
            this.getOwnerComponent().getModel("AddRequistionModel").setData(null);
            this.getView().byId("idTableSearchField").setVisible(false);
            //	this.getView().byId("idAddItemBtn").setVisible(false);
            this.getView().byId("idRemoveItemBtn").setVisible(false);
            //Akshara commented ideditacc
            // this.getView().byId("idEditAcc").setVisible(false);
            this.getView().byId("idReviewReq").setVisible(false);
            this.getView().byId("idCancelReq").setVisible(false);
            this.getView().byId("idSaveReq").setVisible(false);
            this.getView().byId("reqTableHeaderText").setText("Order Data");
            //Surya added BES-73
            this.getView().byId("idSAPuserid").setVisible(true);
            var fisrtName = sap.ushell.Container.getService("UserInfo").getUser().getFirstName();
            var lastName = sap.ushell.Container.getService("UserInfo").getUser().getLastName();
            var userId = sap.ushell.Container.getService("UserInfo").getId();

            var userName = fisrtName + " " + lastName;
            // this.getView().byId("idSAPuserid").setVisible(true);
            this.getView().byId("idSAPuserid").setValue(userId);
            this.getView().byId("idSAPUserName").setText(userName);
            var sPath = "/LOGINDETLSSet('" + userId + "')";
            sap.ui.core.BusyIndicator.show();

            this._model.read(sPath, {
                success: function (odata, ores) {
                    this.getView().byId("idCostCent").setValue(odata.COST_CEN);

                    sap.ui.core.BusyIndicator.hide();
                }.bind(this),
                error: function (ores) {
                    MessageBox.error(JSON.parse(ores.responseText).error.message.value);

                    sap.ui.core.BusyIndicator.hide();

                }
            });
        },
        //Akshara commented start
        // onAccountAssignLink: function (oevt) {
        // 	sap.ui.core.BusyIndicator.show();
        // 	this.contextPath = oevt.getSource().getParent().getBindingContextPath();
        // 	var cellData = this.getOwnerComponent().getModel("AddRequistionModel").getProperty(this.contextPath);
        // 	var jsonModel = new sap.ui.model.json.JSONModel(cellData);
        // 	this.getOwnerComponent().setModel(jsonModel, "AccountAssignModel");
        // 	if (!this._linkAccDialog) {
        // 		this._linkAccDialog = sap.ui.xmlfragment("CTL.zcartcreaterequistion.fragments.editAccountAssignment", this);
        // 		this.getView().addDependent(this._linkAccDialog);
        // 	}
        // 	this._linkAccDialog.open();
        // 	sap.ui.core.BusyIndicator.hide();
        // },
        //Akshara commented end
        onMaterailSearch: function (oevt) {
            var that = this;
            var validArray;
            var filterItems = oevt.getSource().getFilterGroupItems();
            for (var i = 0; i < filterItems.length; i++) {
                if (filterItems[i].getControl().getValue() !== "") {
                    validArray = "Y";
                    break;
                } else {
                    validArray = "X";
                }
            }
            if (validArray === "X") {
                MessageBox.error("Please Enter any input field");
                return true;
            }
            //	var oldMatNo = filterItems[0].getControl().getValue();
            var materialNo = filterItems[0].getControl().getValue().toUpperCase();
            //var l3MatCode = filterItems[2].getControl().getValue();
            var longDesc = filterItems[1].getControl().getValue().toUpperCase();
            //Akshara commented start          
            // var heciCode = filterItems[2].getControl().getValue().toUpperCase();
            // var aicCode = filterItems[3].getControl().getValue().toUpperCase();
            // var iccCode = filterItems[4].getControl().getValue().toUpperCase();
            // var masterMatNo = filterItems[5].getControl().getValue().toUpperCase();
            //Akshara commented end            
            sap.ui.core.BusyIndicator.show();
            var sPath = "/F4MATERIALSet";
            //Akshara removed unwanted fields
            var filter = "(BISMT eq '' and ZGTECD eq '' and ZHECI_CODE eq '' and ZICC_CODE eq '' and MATNR eq '" + materialNo + "' and ZMAKTX eq '" + longDesc + "' and ZAIC_CODE eq '' and ZMMATNR eq '' )";
            this._model.read(sPath, {
                urlParameters: {
                    $filter: filter
                },
                success: function (odata, ores) {
                    var modeljson = new sap.ui.model.json.JSONModel(odata);
                    that.getOwnerComponent().setModel(modeljson, "MaterailModel");
                    sap.ui.core.BusyIndicator.hide();
                },
                error: function (ores) {
                    MessageBox.error(JSON.parse(ores.responseText).error.message.value);
                    var matModel = that.getOwnerComponent().getModel("MaterailModel");
                    if ((typeof (matModel) !== "undefined")) {
                        matModel.setData(null);
                    }
                    sap.ui.core.BusyIndicator.hide();
                }
            });
        },
        onMaterialSelectOk: function (evt) {
            var matTableContextPath = evt.getSource().getParent().getContent()[1].getSelectedItem().getBindingContextPath();
            var matnr = this.getOwnerComponent().getModel("MaterailModel").getProperty(matTableContextPath).MATNR;
            if (this._dialogMaterialHeaderorItem === "Item") {
                var items = this.getView().byId("idReqDetailTable").getItems();
                var oModel = this.getOwnerComponent().getModel("AddRequistionModel");
                var matnrValidation;
                for (var i = 0; i < items.length; i++) {
                    var contextPath = items[i].getBindingContextPath();
                    var data = oModel.getProperty(contextPath);
                    var matnrItem = data.MATNR;
                    if (!data.ZEDITABLE) {
                        if (matnr.trim() === matnrItem.trim()) {
                            matnrValidation = true;
                            break;
                        } else {
                            matnrValidation = false;
                        }
                    }
                }
                if (matnrValidation) {
                    MessageBox.error(matnr + " Material are already existed in Cart");
                    return false;
                }
                var parent = this._parentControl;
                //var matnr = "";
                var sUserId = this.getView().byId("idSAPuserid").getValue();
                var cartCode = "";
                var IDregex = /^[A-Za-z]{3}[0-9]{6}/;
                //Akshara commented start
                // if (!sUserId.match(IDregex)) {
                // 	MessageBox.error("Please Enter correct SAPID Eg..SAP123456");
                // 	return false;
                // }
                //Akshara commented end
                this.onItemAddTable(cartCode, matnr, sUserId, parent);
                this._oMaterialValHelpDialog.close();
            }
            if (this._dialogMaterialHeaderorItem === "Header") {
                sap.ui.getCore().byId(this._matId).setValue(matnr.trim());
                this._oValueHelpDialog.close();
            }

        },
        onMateriaDialogClose: function (evt) {
            if (this._dialogMaterialHeaderorItem === "Item") {
                this._oMaterialValHelpDialog.close();
            }
            if (this._dialogMaterialHeaderorItem === "Header") {
                this._oValueHelpDialog.close();
            }
            this.getOwnerComponent().getModel("MaterailModel").setData(null);
        },

        onGLAccountValueHelp: function (evt) {
            var that = this;
            sap.ui.core.BusyIndicator.show();
            if (!this._oGLValueHelpDialog) {
                this._oGLValueHelpDialog = sap.ui.xmlfragment("CTL.zcartcreaterequistion.fragments.GLAccount", this);
                this.getView().addDependent(this._oGLValueHelpDialog);
            }
            var sPath = "/HT004Set";
            this._model.read(sPath, {
                success: function (oData, ores) {
                    var model = new sap.ui.model.json.JSONModel(oData);
                    that.getOwnerComponent().setModel(model, "ChartAccModel");
                },
                error: function (ores) {
                    MessageBox.error(JSON.parse(ores.responseText).error.message.value);
                }
            });

            this._oGLValueHelpDialog.open();
            sap.ui.core.BusyIndicator.hide();
        },
        onSelectGLAccount: function (evt) {

            var contextpPath = sap.ui.getCore().byId("idGLAccountTable").getSelectedItem().getBindingContextPath();
            var SAKNR = this.getOwnerComponent().getModel("GLAccountModel").getProperty(contextpPath).SAKNR;
            this.getOwnerComponent().getModel("AccountAssignModel").setProperty("/SAKNR", SAKNR);
            this._oGLValueHelpDialog.close();
        },
        onCloseGLAccount: function (evt) {
            sap.ui.getCore().byId("idGLAcoountInput").setValue("");
            sap.ui.getCore().byId("idChartAccInput").setSelectedKey("");
            this.getOwnerComponent().getModel("GLAccountModel").setData(null);
            this._oGLValueHelpDialog.close();
        },
        onGLSearch: function (evt) {
            var that = this;
            sap.ui.core.BusyIndicator.show();
            var glAccount = sap.ui.getCore().byId("idGLAcoountInput").getValue();
            var chartofaccounts = sap.ui.getCore().byId("idChartAccInput").getSelectedKey();
            var sPath = "/F4GLACCTSet";
            var filter = "(KTOPL eq '" + chartofaccounts + "' and SAKNR eq '" + glAccount + "' )";
            this._model.read(sPath, {
                urlParameters: {
                    $filter: filter
                },
                success: function (odata, ores) {
                    var jsonModel = new sap.ui.model.json.JSONModel(odata);
                    that.getOwnerComponent().setModel(jsonModel, "GLAccountModel");
                    sap.ui.core.BusyIndicator.hide();
                },
                error: function (ores) {
                    MessageBox.error(JSON.parse(ores.responseText).error.message.value);
                    sap.ui.core.BusyIndicator.hide();
                }
            });
        },
        onGLClear: function (evt) {
            sap.ui.getCore().byId("idGLAcoountInput").setValue("");
            sap.ui.getCore().byId("idChartAccInput").setSelectedKey("");
            this.getOwnerComponent().getModel("GLAccountModel").setData(null);
        },
        cartItemRegExpValid: function (evt) {
            var cartItem = evt.getSource().getValue().trim();
            var numbers = /^[0-9]+$/;
            if (cartItem !== "") {
                if (!cartItem.toString().match(numbers)) {
                    MessageBox.error("Enter numeric values only");
                    evt.getSource().setValue("");
                }
            }
        },
        materialRegExpValid: function (evt) {
            var material = evt.getSource().getValue();
            var numbers = /^[a-zA-Z0-9]+$/;
            if (material !== "") {
                if (!material.match(numbers)) {
                    MessageBox.error("Enter Alpha numeric characters only");
                    evt.getSource().setValue("");
                }
            }
        }
    });
});