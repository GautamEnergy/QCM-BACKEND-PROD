const Path = require('path');
const fs = require('fs')
const pdf = require('html-pdf')
const { PDFDocument } = require('pdf-lib');
const { ToWords } = require('to-words');
const puppeteer = require('puppeteer');
const toWords = new ToWords();
require('dotenv').config();

/** to Get current Date & Time */
function getCurrentDateTime() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };


  function formatNumberWithCommas(value) {
    let v =  value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return v
}

const PurchaseOrderPdf = async(Top_Data,ItemsTable, BillingTable,UUID )=>{
    
       let serialNo = 0;
        let totalQuantity = 0;
    
        let emailString = Top_Data[0].Email;
        emailString = emailString.replace(/'/g, '"');
    
    const HTMLGenerator = (data,page,totalPage,DataLength)=>{
       
        let totalQuantityPerPage = 0;
        let totalAmountPerPage = 0;
     
        if(DataLength<8 && data.length) {
            let templength = 8-DataLength;
            for(let i = 1; i<=templength; i++){  
            data.push(
                {"MasterSparePartName":"","SparePartName":"","HSNCode":"","SpareNumber":"","Quantity":"","Unit":"","Price_Rs":"","GST":"","Amount":"","Total_Amount":""}
            );
        }
        }
        console.log(data.length)
         const htmlContent1 = ` <html>
    
        <head>
            <style>
                body {
                    font-family: arial, sans-serif;
                    font-weight:bold;
                }
        
                .watermark {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    opacity: 0.1;
                    /* Adjust the opacity as needed */
                    z-index: -1;
                    width: 80%;
                    /* Adjust size as needed */
                }
        
                .container {
                    display: table;
                    width: 100%;
                    margin-top: 56px;
                    font-weight: medium;
                    padding:-10px;
                }
        
                .row {
                    display: table-row;
                }
        
                .cell {
                    display: table-cell;
                    padding-left: 5px;
                    width: 50%;
                    border: 1px solid black;
                    padding: 5px
                }
        
                .cell p {
                    margin: 0;
                    padding: 0;
        
                }
        
                .cell .company-name {
                    font-size: 13px;
                }
        
                .cell .address {
                    font-size: 11px;
                }
                .empty-box{
                   margin-top:0px;
                    height: 20px;
                    width: 100%;
                    margin-bottom:3px;
                   border-bottom: 1px solid black;
                    border-right: 1px solid black;
                    border-left: 1px solid black;
                }
        
                  .empty-box1{
                   margin-top:-12px;
                    height: 20px;
                    width: 100%;
                   border-bottom: 1px solid black;
                    border-right: 1px solid black;
                    border-left: 1px solid black;
                }
        
                      table {
                    width: 100.3%;
                    margin-top:0.5px;
                    border-collapse: collapse;
                    border-bottom: 1px solid black;
                    border-right: 1px solid black;
                    border-left: 1px solid black;
                    
                }
        
                th, td {
                    border: 1px solid #ddd;
                   border: 1px solid black;
                }
        
                th {
                    background-color: #f2f2f2;
                    text-align: center;
                    font-weight:bold;
                border: 1px solid black;
                }
        
                ul {
                    list-style-type: none;
                    padding-left: 0;
                }
        
                .parent {
                    font-weight: bold;
                    font-size:13px
                }
        
                .child {
                    margin-left: 20px;
                    font-size:10px
                }
        
                .serialNo{
                  text-align: center;
                  font-size:12px;
                  font-weight:bold;
                }
                .center-td{
                 text-align: right;
                 font-size:12px;
                 font-weight:bold;
                 padding-right:4px;
                }
        
        
                .summary-desc {
                    overflow: hidden;
                    width: 100%;
                    margin-top:10px;
                }
        
                .summary-desc-left, .summary-desc-right {
                    float: left;
                    box-sizing: border-box; /* Ensures padding and border are included in the width */
                }
        
                .summary-desc-left {
                    width: 50%; /* Adjust the width as needed */
                    border: 1px solid black; /* Adding border */
                    padding-left:10px;
                    height:143px;
                }
        
                .summary-desc-right {
                    width: 50%; /* Adjust the width as needed */
                    border: 1px solid black; /* Adding border */
                   
                }
        
                /* Clearfix to clear floats */
                .summary-desc::after {
                    content: "";
                    display: table;
                    clear: both;
                }
        
               th, td {
            border: 1px solid black;
            page-break-inside: auto;
        }
        
        tr {
            page-break-inside: auto;
        }
         
            </style>
        </head>
        
        <body>
           <div style="width: 100%; border-right: 1px solid black; border-top: 1px solid black;border-bottom: 1px solid black;border-left: 1px solid black; margin-bottom:-20px;">
           ${Top_Data[0].Party_Country == 'India' ? '' :
            `<span style="font-size:12px; margin-top:2px; margin-left:2px;">GSTIN &nbsp; : &nbsp; ${Top_Data[0].Company_GSTNumber}</span>
           <br>
           <span style="font-size:12px; margin-left:2px;">CIN &nbsp; &nbsp; &nbsp; <span style="margin-left:2px;">:</span> &nbsp; ${Top_Data[0].CINNumber?Top_Data[0].CINNumber:''}</span>`}
           <div>
            <h4 style="text-decoration: underline; text-align: center; margin-top: 0px;">Purchase Order</h4>
            <h3 style="text-align: center; margin-top: -24px; letter-spacing: 2px;">${Top_Data[0].CompanyName}</h3>
            <h4 style="text-align: center; margin-top: -22px; font-size: 13px;">${Top_Data[0].Company_Address}, ${Top_Data[0].State} - ${Top_Data[0].Pin}</h4>
            ${Top_Data[0].Party_Country=='India'?`<h4 style="text-align: center; margin-top: -19px; font-size: 13px;">GSTIN: ${Top_Data[0].Company_GSTNumber}</h4>`:''}
            <h4 style="text-align: center; margin-top: -19px; font-size: 10px;">email: ${JSON.parse(emailString).join(', ')}</h4>
            </div>
          </div>

        <div style="margin-top: -55px; width: 100%;  border-right: 1px solid black; border-left: 1px solid black;">
            <div class="container">
                <div class="row">
                    <div class="cell" style=" width: 50%; font-weight:bold;">
                        <p style="font-size: 14px">Party Details:</p>
                        <p class="company-name">${Top_Data[0].PartyName}</p>

                        <p class="address">${Top_Data[0].Address}, ${Top_Data[0].PartyState} - 
                        ${Top_Data[0].PartyPincode}, ${Top_Data[0].Party_Country}
                        </p>

                        <p class="address">
                        Email: ${Top_Data[0].PartyEmail}, Mob: ${Top_Data[0].PartyMobileNumber}
                        </p>
                        <br>
                        <br>
                        ${Top_Data[0].Party_Country == 'India'?`<span style="font-size: 14px;">GSTIN/UIN :</span> <span
                            style=" font-size: 14px; margin-left:30px">${Top_Data[0].GSTNumber}</span>
                    </div>`:
                    `<span style="font-size: 14px;">Party TIN :</span> <span
                            style=" font-size: 14px; margin-left:30px"></span>
                    </div>`}
        
                    <!-- Second-->
                      <div class="cell" style=" width: 50%;">
                     <div style = " font-size:12px; font-weight:bold;">
        
                        <div>
        
                            <div>
                                <span style="font-size: 12px;">Order No</span><span
                                    style="font-size:12px; margin-left:41px;">:&nbsp;&nbsp;${Top_Data[0].Order_Number}</span>
                            </div>
                            <div>
                                <span style="font-size: 12px;">Dated</span><span
                                    style="font-size:12px; margin-left:59px;">:&nbsp;&nbsp;${Top_Data[0].Purchase_Date}
                                </span>
                            </div>
                            <div>
                                <span style="font-size: 12px;">Payment Terms</span><span
                                    style="font-size:12px; margin-left:4px;">:&nbsp;&nbsp;${Top_Data[0].Payment_Terms}</span>
                            </div>
                            <div>
                                <span style="font-size: 12px;">Delivery Terms</span><span
                                    style="font-size:12px; margin-left:7px;">:&nbsp;&nbsp;${Top_Data[0].Delivery_Terms}</span>
                            </div>
                            <div>
                                <span style="font-size: 12px;">Contact Person</span><span
                                    style="font-size:12px; margin-left:4px;">:&nbsp;&nbsp;${Top_Data[0].Contact_Person}</span>
                            </div>
                            <div>
                                <span style="font-size: 12px;">Cell No</span><span
                                    style="font-size:13px; margin-left:51px;">:&nbsp;&nbsp;+${Top_Data[0].Cell_Number}</span>
                            </div>
                            <div>
                                <span style="font-size: 12px;">Warranty</span><span
                                    style="font-size:12px; margin-left:40px;">:&nbsp;&nbsp;${Top_Data[0].Warranty}</span>
                            </div>
        
                        </div>
                   </div>
               </div>
            </div>
        </div>
        
         <div class="empty-box"  style ="border: 0px solid black; border-right: 0px solid black;">
               
        </div>
        
<div class="empty-box1" style="border: 0px solid black; border-bottom: none; border-right: 1px solid black;">
    <p style="text-align: left; margin-left: 5px; font-size:12px; margin-top:-6px; word-wrap: break-word; word-break: break-word;">${Top_Data[0].Narration}</p>
</div>

<div class="divider" style="border-top: 1px solid black;"></div>

<div class="empty-box2" style="border: 1px solid black; border-top: none; border-right: 1px solid black; padding: 5px;">
    <p style="text-align: left; margin: 0; font-size:12px;">We are pleased to place the order for the following items:</p>
</div>
        
          <!-----------------------  Table  ------------------------->
         <table class = "page-break" ${totalPage == page ? '' : 'style=" width: 100%; border-bottom: 0px solid black; border-bottom: 1px solid black;border-right: 0px solid black;"'} >
            <thead>
                <tr>
                    <th style="font-size:15px; padding-top:3px; padding-bottom:3px;">S.N.</th>
                    <th style="width:40%; font-size:15px; padding-top:3px; padding-bottom:3px;">Description of Goods</th>
                    <th style="width:10%; font-size:15px; padding-top:3px; padding-bottom:3px;">HSN Code</th>
                    <th style="font-size:15px; padding-top:3px; padding-bottom:3px;">Qty.</th>
                    <th style="font-size:15px; padding-top:2px; padding-bottom:2px;">Unit</th>
                    <th style="width:15%; font-size:15px; padding-top:3px; padding-bottom:3px;">Price ${Top_Data[0].Party_Country == 'India' ?
            `(₹)` : `($)`
        }</th>
                    <th style="width:15%; font-size:15px; padding-top:3px; padding-bottom:3px;">Amount ${Top_Data[0].Party_Country == 'India' ?
            `(₹)` : `($)`
        }</th>
                </tr>
            </thead>
            <tbody>
            ${data.map((row, i) => {
            serialNo++;
            totalQuantity += Number(row.Quantity) || 0;
            totalAmountPerPage += Number(row.Amount) || 0;
            totalQuantityPerPage += Number(row.Quantity) || 0;

            return `
                    <tr style="height:55px;">
                        <td ${8 - 1 == i ? 'style="vertical-align: top;"' : 'style="border-bottom-style: hidden; vertical-align: top;"'} style="vertical-align: top;" class="serialNo">${row.MasterSparePartName ? serialNo : ''}</td>
                        <td ${8 - 1 == i ? '' : 'style="border-bottom-style: hidden;"'}>
                            <ul style="margin-left:7px;">
                                <li class="parent">${row.MasterSparePartName || ""}
                                    <ul>
                                        <li class="child" style="word-wrap: break-word; word-break: break-word; font-style:oblique;">${row.SparePartName || ""}</li>
                                        <li class="child" style="word-wrap: break-word; word-break: break-word; font-style:oblique;">${row.SpareNumber || ""}</li>
                                    </ul>
                                </li>
                            </ul>
                        </td>
                        <td class="center-td" ${8 - 1 == i ? 'style="word-wrap: break-word; word-break: break-word; vertical-align: top;"' : 'style="border-bottom-style: hidden; word-wrap: break-word; word-break: break-word; vertical-align: top;"'}>${row.HSNCode || ""}</td>
                        <td class="center-td" ${8 - 1 == i ? 'style="word-wrap: break-word; word-break: break-word; vertical-align: top;"' : 'style="border-bottom-style: hidden; word-wrap: break-word; word-break: break-word; vertical-align: top;"'}>${row.Quantity ? formatNumberWithCommas((+row.Quantity)) : ''}</td>
                        <td class="center-td" ${8 - 1 == i ? 'style="word-wrap: break-word; word-break: break-word; vertical-align: top;"' : 'style="border-bottom-style: hidden; word-wrap: break-word; word-break: break-word; vertical-align: top;"'}>${row.Unit || ""}</td>
                        <td class="center-td" ${8 - 1 == i ? 'style="word-wrap: break-word; word-break: break-word; vertical-align: top;"' : 'style="border-bottom-style: hidden; word-wrap: break-word; word-break: break-word; vertical-align: top;"'}>${row.Price_Rs ? formatNumberWithCommas((+row.Price_Rs)) : ''}</td>
                        <td class="center-td" ${8 - 1 == i ? 'style="word-wrap: break-word; word-break: break-word; vertical-align: top;"' : 'style="border-bottom-style: hidden; word-wrap: break-word; word-break: break-word; vertical-align: top;"'}>${row.Amount ? formatNumberWithCommas((+row.Amount)) : ''}</td>
                    </tr>`;
        }).join(' ')
        }
               
            ${totalPage == page ?
            BillingTable.map((bill) => {
                 //console.log(bill)
                return bill.Amount || bill.Bill_Sundry == 'Discount' && bill.Narration || bill.Bill_Sundry == 'Freight' && bill.Narration  ? `<!----------------- @@@@ Last Row to final QTY and amount @@@@@@@@@@@@@@@@------>
                    <tr style="height:20px; font-size:12px; font-weight:bold;">
    <td style="border:0px solid black;" class="serialNo"></td>
    <td style="border:0px solid black; text-align:center;">
        <p style="font-weight:bold; font-size:12px; word-wrap:break-word; word-break:break-word; font-style:oblique; ${bill.Bill_Sundry === 'Discount' ? 'margin-left:15px;' : ''}">
            ${bill.Bill_Sundry !== 'Discount' ? 'Add &nbsp;:' : 'Less &nbsp;:'} ${bill.Bill_Sundry}
        </p>
    </td>
    <td colspan="2" style="border:0px solid black; font-weight:bold;"> <!-- Combining HSN Code and Quantity columns -->
        <p style="font-weight:bold; font-size:11px; word-wrap:break-word; word-break:break-word; font-style:oblique;">
            ${bill.Bill_Sundry == 'Discount' || bill.Bill_Sundry == 'Freight' ? bill.Narration ? bill.Narration : '' : ''}
        </p>
    </td>
    <td style="border:0px solid black; font-weight:bold;"></td>
    <td style="border:0px solid black; font-weight:bold; text-align:center;">${bill.Percentage?`@ &nbsp; ${bill.Percentage}%`:''}</td>
    <td style="border:0px solid black; font-weight:bold; word-wrap:break-word; word-break:break-word; text-align:right; font-weight:bold;">
        <span style="margin-right:2px;">${bill.Amount?formatNumberWithCommas(+bill.Amount):''}</span>
    </td>
</tr>
`:'';
    
                }).join(' ')
        :
        ``
            }
            ${totalPage == page?
                `<tr style="height:20px; ">
                           <td style="border:0px solid black;" class="serialNo" ></td>
                           <td style="border:0px solid black;">
                               <p style = "text-align:center; font-weight:bold; font-size:12px;">Total Quantity</p> 
                           </td>
                           <td style="border:0px solid black; font-weight:bold;" class="center-td"></td> <!-- Replace with actual HSN/SAC Code -->
                           <td style="border:0px solid black; font-weight:bold; word-wrap: break-word; word-break: break-word;" class="center-td" style = "text-align:center; font-weight:bold;" >${formatNumberWithCommas(+totalQuantity.toFixed(2))} Units</td> <!-- Replace with actual Qty. -->
                           <td style="border:0px solid black; font-weight:bold;" class="center-td" style = "text-align:center; font-weight:bold;" ></td>
                           <td  style="border:0px solid black; font-weight:bold;" class="center-td" ></td> <!-- Replace with actual Price -->
                           <td style="border:0px solid black; font-weight:bold; font-size:12px; word-wrap: break-word; word-break: break-word;" class="center-td" style = "text-align:center; font-weight:bold;" ></td> <!-- Replace with actual Amount -->
                       </tr>`: `
                      <tr style="height:120px;">
                         <td style="border:0px solid black; vertical-align: top;" class="serialNo"></td>
                         <td style="border:0px solid black; vertical-align: top;">
                            <p style="text-align:center; font-weight:bold; font-size:13px;">Total c/o</p> 
                         </td>
                        <td style="border:0px solid black; font-weight:bold; vertical-align: top;" class="center-td">
                           ${formatNumberWithCommas(+totalQuantityPerPage.toFixed(2))}
                        </td>
                      <td style="border:0px solid black; font-weight:bold; vertical-align: top; text-align:left;" class="center-td">Units</td>
                     <td style="border:0px solid black; font-weight:bold; vertical-align: top;" class="center-td"></td>
                   <td style="border:0px solid black; font-weight:bold; vertical-align: top;" class="center-td"></td>
                  <td style="border:0px solid black; font-size:12px; font-weight:bold; vertical-align: top; text-align:right; word-wrap: break-word; word-break: break-word;">
                     ${formatNumberWithCommas(+totalAmountPerPage.toFixed(2))}
                 </td>
              </tr>`}
    
            
            </tbody>
        </table>
        ${totalPage == page ?
            `<div style="width: 100%; margin-top: 0px;  border-right: 2px solid black; ">
        <table style="width: 100%; border-collapse: collapse; border: 2px solid black;">
            <tr>
                <td style="width: 10%; font-weight: bold; text-align: left;  padding-left: 3px;  margin: 0; font-size: 12px; word-wrap: break-word; word-break: break-word; border: none;">Total Amount</td>
                <td style="width: 75%; font-weight: bold; padding-left: 2px; padding-right: 3px; text-align: center; padding: 0; margin: 0; font-size: 12px; word-wrap: break-word; word-break: break-word; border: none;">${Top_Data[0].Party_Country == 'India' ?
                `${toWords.convert(Number(BillingTable[0].Total_Amount))}` : `USD ${toWords.convert(Number(BillingTable[0].Total_Amount))}`
            }</td>
                <td style="width: 15%; font-weight: bold; text-align: right; padding-right: 3px; margin: 0; font-size: 12px; word-wrap: break-word; word-break: break-word; border: none;">${formatNumberWithCommas(+BillingTable[0].Total_Amount)}</td>
            </tr>
        </table>
    </div>`:``}
    </div>

    <div style="width: 100%;" class="summary-desc">
            <div class="summary-desc-left">
              <p style="text-decoration: underline; font-size:10px;">Terms & Conditions</p>
              <p style="font-size:12px;">1. Purchase Order Is Inclusive of All taxes i.e GST </p>
              <p style="font-size:12px; margin-top:-10px;">2. All Material will be dispatch to Haridwar factory</p>
              <p style="font-size:12px; margin-top:-10px;">3. If the supplied qty is in excess of Purchase Order Qty, we may reject the excess supplied qty without any economic consideration.</p>
              <p style="font-size:12px; margin-top:-10px;">4. All disputes subject to Delhi Jurisdiction.</p>
            </div>
            <div class="summary-desc-right">
              <div>
                <p style="margin-left:10px; font-size:12px;">Receiver's signature</p>
              </div>
              <div style="height:102px; border-top:1px solid black">
                <p style="margin-right:10px; font-size:16px; text-align: end;">for Gautam Solar Private Limited</p>
                <p style="margin-right:10px; font-size:16px; text-align: end;">Authorised Signatory</p>
              </div>
          </div>
        
          </div>
           <p style="text-align:center; margin-top:20px;">${totalPage>1?page:''}</p>
        </body>
        
        </html>`;

        return htmlContent1;

    }







    const options = {
        path: '/usr/bin/chromium-browser', // Path to your local Chromium/Chrome
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      };
      
      process.env.OPENSSL_CONF = '/dev/null';
      
      // Function to create PDF using Puppeteer
      async function createPdf(html, options) {
        try {
          const browser = await puppeteer.launch({
            executablePath: options.path,
            args: options.args
          });
          const page = await browser.newPage();
          await page.setContent(html, { waitUntil: 'networkidle0' });
          const pdf = await page.pdf({
            format: 'A4',
            
          });
          await browser.close();
          return pdf;
        } catch (error) {
          throw new Error(`Error creating PDF: ${error.message}`);
        }
      }
      
      // Function to merge PDFs using pdf-lib
      async function mergePdfs(buffers) {
        const pdfDoc = await PDFDocument.create();
        for (const buffer of buffers) {
          const pdfBuffer = await PDFDocument.load(buffer);
          const pages = await pdfDoc.copyPages(pdfBuffer, pdfBuffer.getPageIndices());
          pages.forEach(page => pdfDoc.addPage(page));
        }
        const mergedPdf = await pdfDoc.save();
        return mergedPdf;
      }
      
      // Create and handle PDF buffers
      async function generateAndMergePdfs() {
        let pagesBufferArr = [];
        try {
          let Pages = Math.ceil((ItemsTable.length) / 8);
      
          for (let page = 1; page <= Pages; page++) {
            let startIndex = (page - 1) * 8; 
            let endIndex = page * 8;
      
            // Ensure that pageData has items before generating the PDF
            if (startIndex < ItemsTable.length) {
              let pageData = ItemsTable.slice(startIndex, endIndex);
              const htmlContent1 = HTMLGenerator(pageData, page, Pages, pageData.length);
              let pageBuffer = await createPdf(htmlContent1, options);
              pagesBufferArr.push(pageBuffer);
            }
          }
      
          const mergedPdfBuffer = await mergePdfs(pagesBufferArr);

          const folderPath = Path.join('PurchaseOrder');
     
   
          /** Create the folder if it doesn't exist */
          if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
          }
        
            /** Define the file path, including the desired file name and format */
            const PDF = `${UUID}.pdf`;
            
            const PDFFilePath = Path.join(folderPath, PDF);
         
        
          /** Save the file buffer to the specified file path */
          fs.writeFileSync(PDFFilePath, mergedPdfBuffer,(err) => {
            if(err){
                console.log(err)
                return err
            }else{
                return 'Merged Succesfully'
            }
          });
      
         
        } catch (err) {
            console.log(err)
          return ('Error generating or merging PDFs:', err);
        }
      }
      
     let response =  await generateAndMergePdfs();

    return response;
    }



  module.exports = {getCurrentDateTime, PurchaseOrderPdf}
