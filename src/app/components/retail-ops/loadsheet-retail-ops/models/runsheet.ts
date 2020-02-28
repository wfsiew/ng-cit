import _ from 'lodash';
import { Helper } from 'src/app/shared/utils/helper';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { barcode, svg2url } from 'pure-svg-code';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export class Runsheet {
  private runsheet_total_weight = 0;
  private total_weight = 0;
  
  constructor(
    public loadID: string,
    public data: any,
    public list: any[],
    public username: string
  ) {
    // let lx = this.list;
    // for (var i = 0; i < 20; i++) {
    //   lx.push(this.data);
    // }
    // this.list = lx;
  }

  getPdf() {
    const bcode1 = barcode(this.loadID, 'code128', { width: 150, barHeight: 20, showHRI: false });
    const o = this.data;
    let tableData = this.buildTableRows();
    let dd = {
      pageSize: 'A4',
      pageMargins: [30, 60, 30, 110],
      header: {
        stack: [
          { text: 'FMX (M) SDN BHD', style: 'header' },
          { text: 'Delivery Run Sheet', style: 'header' }
        ],
        margin: [0, 20, 0, 0]
      },
      content: [
        {
          svg: bcode1
        },
        {
          layout: 'noBorders',
          margin: [0, 10, 0, 5],
          table: {
            headerRows: 0,
            widths: [50, 80, 90, '*', 70, 'auto'],
            body: [
              [
                { text: 'Load No. : ', style: 'fd' },
                { text: this.loadID, style: 'ft' }, 
                { text: 'Contractor : ', style: 'fd' }, '', 
                { text: 'User ID : ', style: 'fd' }, 
                { text: this.username, style: 'ft' }
              ],
              [
                { text: 'Route : ', style: 'fd' }, 
                { text: `${o.Origin}-${o.Destination}`, style: 'ft' }, 
                { text: 'Loading Date : ', style: 'fd' }, 
                { text: `${o.CreateDate}`, style: 'ft' }, 
                { text: 'Total Doc : ', style: 'fd' }, 
                { text: `${this.list.length}`, style: 'ft' }
              ],
              ['', '', '', '', 
                { text: 'Total Drop Point : ', style: 'fd' }, 
                { text: `${o.TotalDrop}`, style: 'ft' }
              ],
              [
                { text: 'Remarks : ', style: 'fd' }, 
                { text: '', style: 'ft', colSpan: 5 }
              ],
            ],
          }
        },

        {
          table: {
            id: 'rowx',
            headerRows: 2,
            dontBreakRows: true,
            widths: ['auto', 50, 60, 30, 30, 155, 40, 80],
            body: tableData
          }
        }
      ],
      // pageBreakBefore(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
      //   if (currentNode.table && currentNode.table.id === 'rowx') {
      //     console.log(currentNode)
      //   }
      //   return false;
      // },
      footer: {
        layout: 'noBorders',
        table: {
          headerRows: 0,
          widths: [100, 'auto', 'auto', 80, 90, 'auto', 30, 'auto', 'auto'],
          body: [
            [
              { text: '', style: 'fe' },
              { text: 'PCS', style: 'fe' },
              { text: 'WEIGHT (KG)', style: 'fe' },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' }
            ],
            [
              { text: '', style: 'fe' },
              { text: '___________', style: 'fe', margin: [0, -7, 0, 0] },
              { text: '______________', style: 'fe', margin: [0, -7, 0, 0] },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' }
            ],
            [
              { text: 'PAGE TOTAL : ', style: 'fe' },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' },
              { text: 'VEHICLE NO. : ', style: 'fe' },
              { text: '', style: 'fe' },
              { text: 'Meter Out : ', style: 'fe' },
              { text: '', style: 'fe' },
              { text: 'Total Pending : ', style: 'fe' },
              { text: '', style: 'fe' },
            ],
            [
              { text: '', style: 'fe' },
              { text: '___________', style: 'fe', margin: [0, -12, 0, 0] },
              { text: '______________', style: 'fe', margin: [0, -12, 0, 0] },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' }
            ],
            [
              { text: '', style: 'fe' },
              { text: '___________', style: 'fe', margin: [0, -13, 0, 0] },
              { text: '______________', style: 'fe', margin: [0, -13, 0, 0] },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' }
            ],
            [
              { text: 'RUN SHEET TOTAL : ', style: 'fe' },
              { text: '5', style: 'fe' },
              { text: `${this.runsheet_total_weight.toFixed(2)}`, style: 'fe' },
              { text: 'DRIVER NAME : ', style: 'fe' },
              { text: `${o.DriverName}`, style: 'fe' },
              { text: 'Meter in : ', style: 'fe' },
              { text: '', style: 'fe' },
              { text: 'Total Delivered : ', style: 'fe' },
              { text: '', style: 'fe' }
            ],
            [
              { text: '', style: 'fe' },
              { text: '___________', style: 'fe', margin: [0, -12, 0, 0] },
              { text: '______________', style: 'fe', margin: [0, -12, 0, 0] },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' }
            ],
            [
              { text: '', style: 'fe' },
              { text: '___________', style: 'fe', margin: [0, -14, 0, 0] },
              { text: '______________', style: 'fe', margin: [0, -14, 0, 0] },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' }
            ],
            [
              { text: '', style: 'fe' },
              { text: '', style: 'fe' },
              { text: '', style: 'fe' },
              { text: 'ATTENDANT NAME : ', style: 'fe' },
              { text: '', style: 'fe' },
              { text: 'Total Miles : ', style: 'fe' },
              { text: '', style: 'fe' },
              { text: 'Total COD : ', style: 'fe' },
              { text: '', style: 'fe' }
            ]
          ]
        }
      },
      
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          alignment: 'center'
        },
        fd: {
          fontSize: 9,
          bold: true,
          alignment: 'right'
        },
        ft: {
          fontSize: 9,
          alignment: 'left'
        },
        fa: {
          fontSize: 8,
          bold: true,
          alignment: 'left'
        },
        fb: {
          fontSize: 8,
          bold: true,
          alignment: 'center'
        },
        fx: {
          fontSize: 6
        },
        fy: {
          fontSize: 6,
          bold: true,
          alignment: 'left'
        },
        fe: {
          fontSize: 8,
          alignment: 'right'
        }
      }
    };

    pdfMake.createPdf(dd).open();
  }

  buildTableRows() {
    let runsheet_total_weight = 0;
    let total_weight = 0;
    let lr = [
      [
        { text: 'No', style: 'fa', rowSpan: 2 },
        { text: 'TDN No. / Customer Ref', style: 'fa', rowSpan: 2 },
        { text: 'Received By', style: 'fb', colSpan: 3 }, {}, {},
        { text: 'Receiver', style: 'fb', rowSpan: 2 },
        { text: 'COD', style: 'fb', rowSpan: 2 },
        { text: 'Remarks', style: 'fa', rowSpan: 2 }
      ],
      [
        '',
        '',
        { text: 'Name', style: 'fb' }, { text: 'Sign', style: 'fb' }, { text: 'IC', style: 'fb' },
        '',
        '',
        ''
      ]
    ];
    _.each(this.list, (o, i) => {
      let weight = parseFloat(o.CargoWeight);
      runsheet_total_weight += weight;
      total_weight += weight;
      let bcodex = barcode(`${o.ConsignmentNo}`, 'code128', { width: 100, barHeight: 18, showHRI: false });
      let la = [`${o.Add1}`, `${o.Add2}`, `${o.Add3}`, `${o.City}`, `${o.State}`, `${o.Zip}`, `${o.Country}`];
      let address = la.join(', ');
      let r: any = [
        { text: `${i + 1}`, style: 'fx' },
        {
          stack: [
            { text: `${o.ConsignmentNo}`, style: 'fy' },
            { text: '\n', style: 'fy' },
            { text: `${o.CustomerRef}`, style: 'fy' },
            { text: '\n', style: 'fy' },
            { text: `Pcs : ${o.TotalNumOfPackages}`, style: 'fy' },
            { text: `Weight : ${Helper.formatAmount(o.CargoWeight)}`, style: 'fy' }
          ]
        },
        { text: '', border: [true, true, false, true] },
        { text: '', border: [false, true, false, true] },
        { text: '', border: [false, true, true, true] },
        {
          stack: [
            {
              columns: [
                {
                  width: 80,
                  text: `${o.ConsigneeName}`, style: 'fx'
                },
                {
                  width: '*',
                  text: `${o.City}`, style: 'fx'
                }
              ]
            },
            { text: `${o.TelNo} /${o.MobileNo}`, style: 'fx' },
            { 
              text: `${address}`, style: 'fx', margin: [0, 5, 0, 0]
            },
            {
              svg: bcodex,
              margin: [10, 5, 5, 5]
            }
          ]
        },
        { text: `${Helper.formatAmount(o.COD)}`, style: 'fx', alignment: 'right' },
        { text: `${o.Remark}`, style: 'fx' }
      ];
      lr.push(r);
    });

    this.runsheet_total_weight = runsheet_total_weight;
    this.total_weight = total_weight;
    return lr;
  }
}