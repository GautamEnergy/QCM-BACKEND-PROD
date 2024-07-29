/**
 * @swagger
 * /Maintenance/GetAutoData:
 *   post:
 *     summary: Retrieve spare part information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MachineId:
 *                 type: string
 *                 example: "1234"
 *               SparePartId:
 *                 type: string
 *                 example: "5678"
 *               required:
 *                 type: string
 *                 enum: [Spare Part Name, Spare Part Brand Name, Spare Part Model No, Spare Part Specification]
 *                 example: "Spare Part Name"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       SparePartName:
 *                         type: string
 *                         example: "Part A"
 *                       SparPartId:
 *                         type: string
 *                         example: "5678"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: "Error message"
 */

/**
 * @swagger
 * /Maintenance/AddParty:
 *   post:
 *     summary: to Add New Party
 *     description: Duplicate Party Name is not allowed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               PartyName:
 *                 type: string
 *                 example: "Gautam Solar Pvt"
 *               GSTNumber:
 *                 type: string
 *                 example: "AP567856565656"
 *               PANNumber:
 *                 type: string
 *                 example: "5678565"
 *               Address:
 *                 type: string,
 *                 example: "OKhla Phase-1"
 *               Country:
 *                 type: string,
 *                 enum: [India, China]
 *                 example: "India"
 *               State:
 *                 type: string,
 *                 example: "Delhi"
 *               Email:
 *                 type: string,
 *                 example: "krishu7827@gmail.com"
 *               MobileNumber:
 *                 type: string,
 *                 example: "9868027571"
 *               Status:
 *                 type: string,
 *                 Enum: [Active,InActive]
 *                 example: "Active"
 *               CurrentUser:
 *                 type: string,
 *                 example: "+91"
 *               CountryCode:
 *                 type: string,
 *                 example: "UUID"
 *               PinCode:
 *                 type: string,
 *                 example: "UUID"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *              schema:
 *                type: object
 *                properties:
 *                   msg:
 *                      type: string
 *                      example: "Inserted Succesfully!"
 *                   PartyNameId:
 *                      type: string
 *                      example: "UUID"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: "Error message"
 */

/**
 * @swagger
 * /Maintenance/AddMachine:
 *   post:
 *     summary: Add New Machine
 *     description: Duplicate Machine Name & Model Number are not allowed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MachineName:
 *                 type: string
 *                 example: "Stringer"
 *               MachineBrandName:
 *                 type: string
 *                 example: "Zing Company"
 *               MachineModelNumber:
 *                 type: string
 *                 example: "XXX5678565"
 *               MachineNumber:
 *                 type: string
 *                 example: "556677"
 *               Status:
 *                 type: string
 *                 enum: [Active, InActive]
 *                 example: "Active"
 *               CurrentUser:
 *                 type: string
 *                 example: "UUID"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Inserted Successfully!"
 *                 MachineId:
 *                   type: string
 *                   example: "UUID"
 *       409:
 *         description: Duplicate Machine Name or Model Number
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     msg:
 *                       type: string
 *                       example: "Duplicate Machine Name"
 *                 - type: object
 *                   properties:
 *                     msg:
 *                       type: string
 *                       example: "Duplicate Machine Model Number"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: "Error message"
 */

/**
 * @swagger
 * /Maintenance/MachineDetailById:
 *   get:
 *     summary: Get Machine Names With UUID
 *     description: Retrieve machine names and UUIDs.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       MachineId:
 *                         type: string
 *                         example: "UUID1"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: "Error message"
 */


/** Machine Model Number */

/**
 * @swagger
 * /Maintenance/GetMachineModelNumber:
 *   post:
 *     summary: Retrieve Machine Model Number by MachineId
 *     description: |
 *       Sends a MachineId to retrieve the corresponding Machine Model Number. 
 *       Note: Key name is case-sensitive.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MachineId:
 *                 type: string
 *                 example: "039b2111-93db-4615-be4e-286d6495d703"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   MachineModelNumber:
 *                     type: string
 *                     example: "123ccvgdfgdfgerqw4w"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: "Error message"
 */



/**Get Currency */
/**
 * @swagger
 * /Maintenance/GetCurrency:
 *   get:
 *     summary: Retrieve Currency data
 *     description: |
 *       Endpoint Name is case-sensitive. 
 *       Note: Key name is case-sensitive.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   CurrencyId:
 *                     type: string
 *                     example: "123ccvgdfgdfgerqw4w"
 *                   Currency:
 *                     type: string
 *                     enum: [₹,$,¥]
 *                     example: "₹"
 *                   Country:
 *                     type: string
 *                     enum: [India,China,USA]
 *                     example: "India"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: "Error message"
 */


/**Api to Add Spare Part */
/**
 * @swagger
 * /Maintenance/AddSparePart:
 *   post:
 *     summary: Add New Spare Part
 *     description: Duplicate Spare Model Number is not allowed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               SparePartName:
 *                 type: string
 *                 example: "gear"
 *               SpareNumber:
 *                 type: string
 *                 example: "XXXX90"
 *                 description: Here You have to Put Spare Model Number and it should be unique
 *               Specification:
 *                 type: string
 *                 example: "Specification_gear"
 *               BrandName:
 *                 type: string
 *                 example: "Zing Zang Pvt Ltd."
 *               MachineName:
 *                 type: string
 *                 example: "UUID"
 *               MasterSparePartName:
 *                 type: string
 *                 example: "Master Spare Part Name"
 *               NumberOfPcs:
 *                 type: string
 *                 example: "8"
 *               CycleTime:
 *                 type: string
 *                 example: "2"
 *               Equivalent:
 *                 type: array
 *                 example: ["UUID1", "UUID2"]
 *               CurrentUser:
 *                 type: string
 *                 example: "UUID"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Inserted Succesfully!"
 *                 SparePartId:
 *                   type: string
 *                   example: "UUID"
 *       409:
 *         description: Duplicate Spare Model Number Error
 *         content:
 *           application/json:
 *            schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Duplicate Spare Model Number"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: "Error message"
 */



/** Upload Spare Parts Image*/
/**
 * @swagger
 * /Maintenance/SparePartsImage:
 *   post:
 *     summary: Upload Spare Part Image and its Drawing Image
 *     description: |
 *       Endpoint name is case-sensitive. 
 *       Note: Key name is case-sensitive.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               SparePartId:
 *                 type: string
 *                 example: "Stringer"
 *               SparePartImage:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: "Upload spare part images"
 *               DrawingImage:
 *                 type: file
 *                 example: "Upload Pdf Here"
 *                 description: "Upload drawing PDF"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   msg:
 *                     type: string
 *                     example: "Data Inserted SuccesFully !"
 *       401:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: "Error message"
 */


/**equivalent data */
/**
 * @swagger
 * /Maintenance/Equ:
 *   get:
 *     summary: Get Equivalent Spare Model Number and Name
 *     description: Retrieve Equivalent Spare Model Number and Name.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       MachineId:
 *                         type: string
 *                         example: "UUID1"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: "Error message"
 */


/**Get All Party Name */
/**
 * @swagger
 * /Maintenance/GetParty:
 *   get:
 *     summary: Retrieve ALL Party Names 
 *     description: |
 *       Endpoint Name is case-sensitive. 
 *       Note: Key name is case-sensitive.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   CurrencyId:
 *                     type: string
 *                     example: "123ccvgdfgdfgerqw4w"
 *                   Currency:
 *                     type: string
 *                     enum: [₹,$,¥]
 *                     example: "₹"
 *                   Country:
 *                     type: string
 *                     enum: [India,China,USA]
 *                     example: "India"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: "Error message"
 */


/**
 * ! Get Voucher Number
 */
/**
 * @swagger
 * /Maintenance/GetVoucherNumber:
 *   get:
 *     summary: Retrieve Voucher Number 
 *     description: |
 *       Endpoint Name is case-sensitive. 
 *       Note: Key name is case-sensitive.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   CurrencyId:
 *                     type: string
 *                     example: "123ccvgdfgdfgerqw4w"
 *                   Currency:
 *                     type: string
 *                     enum: [₹,$,¥]
 *                     example: "₹"
 *                   Country:
 *                     type: string
 *                     enum: [India,China,USA]
 *                     example: "India"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: "Error message"
 */


/**
 * ! To Add Purchase Data
 */
/**
 * @swagger
 * /Maintenance/AddPurchaseOrder:
 *   post:
 *     summary: Insert Purchase Data
 *     description: |
 *       Endpoint Name is case-sensitive. 
 *       Note: Key name is case-sensitive.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               PurchaseData:
 *                 type: object
 *                 properties:
 *                   series:
 *                     type: string
 *                     example: "GST-2024-2025"
 *                   vochNo:
 *                     type: string
 *                     example: "GST-2024-2025-01"
 *                   purcType:
 *                     type: string
 *                     example: "L/GST-12%"
 *                   PartyName:
 *                     type: string
 *                     example: "0213fe0c-cae1-4a07-858b-aeeefdaabe0d"
 *                   company:
 *                     type: string
 *                     example: "fd86454f-4365-11ef-b658-1a2cd4d9c0d1"
 *                   narration:
 *                     type: string
 *                     example: "jjjjjjsdkfksd"
 *                   currentDate:
 *                     type: string
 *                     example: "Sat Jul 20 2024"
 *                   currentUser:
 *                     type: string
 *                     example: "66494d8a-0786-11ef-8005-52549f6cc694"
 *               BilingData:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     Bill_Sundry:
 *                       type: string
 *                       example: "Discount"
 *                     Narration:
 *                       type: string
 *                       example: ""
 *                     Percentage:
 *                       type: string
 *                       example: ""
 *                     Amount:
 *                       type: string
 *                       example: "0.00"
 *                     Total_Amount:
 *                       type: string
 *                       example: "1080.80"
 *               tableData:
 *                 type: object
 *                 properties:
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         spareName:
 *                           type: string
 *                           example: "fhgfgh"
 *                         modelNumber:
 *                           type: string
 *                           example: "fghfgh"
 *                         qty:
 *                           type: string
 *                           example: "4"
 *                         unit:
 *                           type: string
 *                           example: "gfd"
 *                         price:
 *                           type: string
 *                           example: "100"
 *                         gst:
 *                           type: string
 *                           example: "10"
 *                         amount:
 *                           type: number
 *                           example: 200
 *                         SparePartId:
 *                           type: string
 *                           example: "10db5181-bed5-4a5d-b148-c0ce5a3f8822"
 *                   totalAmount:
 *                     type: string
 *                     example: "965"
 *               optionalData:
 *                 type: object
 *                 properties:
 *                   paymentTerm:
 *                     type: string
 *                     example: "fsd"
 *                   deleveryTerm:
 *                     type: string
 *                     example: "dgfs"
 *                   contactPer:
 *                     type: string
 *                     example: "fdgs"
 *                   cellNo:
 *                     type: string
 *                     example: "dfgs"
 *                   warranty:
 *                     type: string
 *                     example: ""
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "data Inserted Successfully"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: "Error message"
 */


/**
 * ! Get Purchase ORder List
 */

/**
 * @swagger
 * /Maintenance/GetPurchaseOrderList:
 *   get:
 *     summary: Retrieve Purchase Orders
 *     description: |
 *       This endpoint retrieves a list of purchase orders.
 *       Note: Key name is case-sensitive.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       Purchase_Order_Id:
 *                         type: string
 *                         example: "6c228229-3b0f-48fc-bd27-764d74b0ecd3"
 *                       Voucher_Number:
 *                         type: string
 *                         example: "GST-2024-2025-04"
 *                       PartyName:
 *                         type: string
 *                         example: "Gautam Solaraswdrda"
 *                       CompanyName:
 *                         type: string
 *                         example: "Gautam Solar Private Limited UNIT II"
 *                       Purchase_Date:
 *                         type: string
 *                         example: "Mon Jul 22 2024"
 *                       Created_On:
 *                         type: string
 *                         example: "2024-07-22T09:42:17.000Z"
 *                       Created_By:
 *                         type: string
 *                         example: "Bhanu"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: ""
 */