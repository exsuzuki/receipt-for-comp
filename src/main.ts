enum RATE {
  TAX = 0.1,
  Adjustment = 0.0196
}
const Registration: HTMLSelectElement = document.getElementById('isRegistration') as HTMLSelectElement;
let inputPrice: number;
let isRegistration: boolean
let BasePrice: number;
let Adjustment: number;
let ExcludingTAX: number;
let TAX: number;
let IncludingTAX: number;
document.addEventListener('DOMContentLoaded', function () {
  if (Registration) Registration.addEventListener('change', invoiceChange);
  const CalculationBTN: HTMLButtonElement = document.getElementById('btn') as HTMLButtonElement;
  if (CalculationBTN) CalculationBTN.addEventListener('click', btn_click);
});
function invoiceChange() {
  if (Registration.value == 'true') {
    isRegistration = true;
  } else {
    isRegistration = false;
  }
  btn_click();
}
function btn_click() {
  BasePrice = Number((document.getElementById('inputPrice') as HTMLInputElement).value);
  console.log(BasePrice);
  if (isRegistration) Adjustment = 0;
  else Adjustment = Math.floor(BasePrice * RATE.Adjustment);
  ExcludingTAX = BasePrice - Adjustment;
  TAX = Math.floor(ExcludingTAX * RATE.TAX);
  IncludingTAX = ExcludingTAX + TAX;
  (document.getElementById('BasePrice') as HTMLTableCellElement).innerHTML = BasePrice.toLocaleString();
  (document.getElementById('Adjustment') as HTMLTableCellElement).innerHTML = Adjustment.toLocaleString();
  (document.getElementById('ExcludingTAX') as HTMLTableCellElement).innerHTML = ExcludingTAX.toLocaleString();
  (document.getElementById('TAX') as HTMLTableCellElement).innerHTML = TAX.toLocaleString();
  (document.getElementById('IncludingTAX') as HTMLTableCellElement).innerHTML = IncludingTAX.toLocaleString();
  drawReceipt();
}
function drawReceipt() {
  const cvs: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('receipt');
  const ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>cvs.getContext('2d');
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  // 領収書
  ctx.font = '20px san-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('領収書', cvs.width / 2, 5);
  // 宛名
  ctx.font = '10px san-serif';
  ctx.textAlign = 'left';
  ctx.fillText('㈱〇〇 様', 10, 30);
  // 日付
  ctx.fillText(new Date().toLocaleString('ja-JP-u-ca-japanese', {
    era: 'narrow', year: 'numeric', month: 'long', day: 'numeric'
  }), 210, 30);
  // 金額
  ctx.font = 'bold 30px san-serif';
  ctx.textAlign = 'center';
  ctx.fillText('￥' + IncludingTAX.toLocaleString() + '-', cvs.width / 2, 45);
  // 消費税
  ctx.font = '8px san-serif';
  ctx.textAlign = 'left'
  ctx.fillText('消費税(10%):' + TAX.toLocaleString(), 10, 100);
  // 但し書き
  let AdjustmentText: string = '';
  if (!isRegistration) AdjustmentText = ' 経過措置控除:' + Adjustment.toLocaleString();
  ctx.font = '9px san-serif';
  ctx.textAlign = 'center';
  ctx.fillText('但 〇〇料として' + AdjustmentText,
    cvs.width / 2, 82.5);
  // 印紙
  ctx.font = '8px san-serif';
  ctx.textAlign = 'center';
  ctx.fillText('印紙', 30, 140);
  ctx.strokeRect(10, 120, 40, 50);
  if (ExcludingTAX >= 2000000) {
    ctx.fillText('600', 30, 150);
  } else if (ExcludingTAX >= 1000000) {
    ctx.fillText('400', 30, 150);
  } else if (ExcludingTAX >= 50000) {
    ctx.fillText('200', 30, 150);
  } else {
    ctx.beginPath();
    ctx.moveTo(50, 120);
    ctx.lineTo(10, 170);
    ctx.stroke();
  }
  // 個人情報
  ctx.font = "8px san-serif";
  ctx.textAlign = 'left';
  ctx.fillText('住所: 〇〇〇〇〇〇〇〇〇〇〇', 100, 120);
  ctx.fillText('名前: 〇〇〇〇〇〇', 100, 140);
  if (isRegistration) ctx.fillText('登録番号: T〇〇〇〇〇〇〇〇〇〇〇〇', 100, 160);
}