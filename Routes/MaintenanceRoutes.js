const express = require('express');
const MaintenanceRouter = express.Router()
const {AddMachineData, MachineDetailById, GetMachineModelNumberById, GetMachineList, GetMachineListById} = require('../Controller/MachineController');
const {AddParty,getCurrency,getPartyNames, getPartyListById} = require('../Controller/PartyController');
const {UploadImage,AddSpareParts,GetImage,getEquivalent,SparePartList, getSpecificSparePart,
    getSparePartNamesByMachineName,
     SparePartIn, getStockList, SparePartOut,
    SparePartStockList, getMachineMaintenanceList} = require('../Controller/SparePartController');
const {upload} = require('../Middleware/Maintenance.middleware');
const {getVoucherNumber,AddPurchaseOrder, getPurchaseOrderList, getPurchaseOrderById, getFile, VoucherList, GetPurchaseDetailByVoucher} = require('../Controller/PurchaceOrderController')


/**Route to Add Party */
MaintenanceRouter.post('/AddParty',AddParty);

/**Route to Add Machine */
MaintenanceRouter.post('/AddMachine',AddMachineData);

/**Router To Get Machine Detail By Id */
MaintenanceRouter.get('/MachineDetailById',MachineDetailById);

/**Router To Get Machine List */
MaintenanceRouter.get('/MachineList',GetMachineList);  


/**Router To Get Machine List By Id */
MaintenanceRouter.post('/MachineListById',GetMachineListById);  

/**Router To Get Machine Model Number by ID */
MaintenanceRouter.post('/GetMachineModelNumber',GetMachineModelNumberById);

/**Router To Upload Image for Spare Parts */
MaintenanceRouter.post('/SparePartsImage',upload,UploadImage)

/**Router To Add Add Spare Parts */
MaintenanceRouter.post('/AddSparePart',AddSpareParts)

// /**Router To Get Upload FIle FROM Spare Parts */
MaintenanceRouter.get('/File/:filename',GetImage)

/**Router to Get Equivalent data */
MaintenanceRouter.post('/Equ',getEquivalent)

/**Router to get Spare List & Brand Name & Spare Model Number */
MaintenanceRouter.post('/GetAutoData',SparePartList)

/**Router to Get Currency */
MaintenanceRouter.get('/GetCurrency',getCurrency);

/**Router To Get All Party Names */
MaintenanceRouter.get('/GetParty',getPartyNames);

/**Router To Get All Party Names */
MaintenanceRouter.post('/GetPartyListById',getPartyListById);

/**Router to get Voucher Number */
MaintenanceRouter.get('/GetVoucherNumber',getVoucherNumber)

/**Router to Add Purchase Data  */
MaintenanceRouter.post('/AddPurchaseOrder', AddPurchaseOrder)

/**Router to Get Purchase Order List */
MaintenanceRouter.get('/GetPurchaseOrderList', getPurchaseOrderList)

/**Router to Get Purchase Order By PO Id For Edit PO */
MaintenanceRouter.post('/GetPurchaseOrderById', getPurchaseOrderById)

/**Router to Get Files, Pdf etc. */
MaintenanceRouter.get('/getFile/:filename', getFile);

/**Router to Get Spare Part By ID */
MaintenanceRouter.post('/GetSpecificSparePart',getSpecificSparePart)

/**Router to Get Voucher List  */
MaintenanceRouter.post('/GetVoucherList',VoucherList);

/**Router to Get Purchase ORder detail and Spare Part detail */
MaintenanceRouter.post('/GetPO&SparePartDetail',GetPurchaseDetailByVoucher);

/**Router to Spare Part IN */
MaintenanceRouter.post('/SparePartIn',SparePartIn)

/**Router to Get Stock List */
MaintenanceRouter.post('/GetStockList',getStockList);

/**Router to Get Stock based on machine name */
MaintenanceRouter.post('/GetStockByMachine',getSparePartNamesByMachineName)

/**Router to Deduct Spare Parrt FRom Stock */
MaintenanceRouter.post('/SparePartOut',SparePartOut);

/**Router to get Spare pare Stock List */
MaintenanceRouter.get('/SparePartStockList',SparePartStockList);

/**Router to Get Machine List */
MaintenanceRouter.get('/GetMachineMaintenanceList', getMachineMaintenanceList)

module.exports = {MaintenanceRouter}
