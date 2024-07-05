const express = require('express');
const MaintenanceRouter = express.Router()
const {AddMachineData, MachineDetailById, GetMachineModelNumberById} = require('../Controller/MachineController');
const {AddParty} = require('../Controller/PartyController');
const {UploadImage,AddSpareParts,GetImage,getEquivalent} = require('../Controller/SparePartController');
const {upload} = require('../Middleware/Maintenance.middleware');


/**Route to Add Party */
MaintenanceRouter.post('/AddParty',AddParty);

/**Route to Add Machine */
MaintenanceRouter.post('/AddMachine',AddMachineData);

/**Router To Get Machine Detail By Id */
MaintenanceRouter.get('/MachineDetailById',MachineDetailById);

/**Router To Get Machine Model Number by ID */
MaintenanceRouter.post('/GetMachineModelNumber',GetMachineModelNumberById);

/**Router To Upload Image for Spare Parts */
MaintenanceRouter.post('/SparePartsImage',upload,UploadImage)

/**Router To Add Add Spare Parts */
MaintenanceRouter.post('/AddSparePart',AddSpareParts)

/**Router To Get Upload FIle FROM Spare Parts */
MaintenanceRouter.get('/File/:filename',GetImage)

/**Router to Get Equivalent data */
MaintenanceRouter.post('/Equ',getEquivalent)


module.exports = {MaintenanceRouter}
