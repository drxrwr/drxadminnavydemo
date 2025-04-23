document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('inputContainer');

  for (let i = 0; i < 20; i++) {
    const row = document.createElement('div');
    row.className = 'input-row';
    row.innerHTML = `
      <input type="text" placeholder="Nama file (tanpa .vcf)" class="file-name">
      <textarea placeholder="Masukkan nomor satu per baris" class="number-list"></textarea>
      <button onclick="generateVCF(this)">Generate VCF</button>
    `;
    container.appendChild(row);
  }
});

function generateVCF(button) {
  const row = button.parentElement;
  const fileInput = row.querySelector('.file-name');
  const numberInput = row.querySelector('.number-list');

  const adminName = document.getElementById('adminName').value || 'Admin';
  const navyName = document.getElementById('navyName').value || 'Navy';
  const adminExtra = (document.getElementById('adminExtra').value || '').split(',').map(n => n.trim()).filter(n => n);
  const navyExtra = (document.getElementById('navyExtra').value || '').split(',').map(n => n.trim()).filter(n => n);
  const urutan = document.getElementById('firstType').value;
  const jumlahAwal = parseInt(document.getElementById('jumlahKontak').value) || 1;

  const numbers = numberInput.value
    .split('\n')
    .map(n => n.trim())
    .filter(n => n.length >= 10);

  const fixedNumbers = numbers.map(n => {
    if (n.startsWith('+') || n.startsWith('0')) return n;
    return '+' + n;
  });

  const nameList = [];
  let adminCount = 1;
  let navyCount = 1;

  const baseList = urutan === 'admin' ? [adminName, navyName] : [navyName, adminName];
  let current = 0;

  for (let i = 0; i < fixedNumbers.length; i++) {
    let name;
    if (i < jumlahAwal) {
      name = baseList[current] + ' ' + (current === 0 ? adminCount++ : navyCount++);
    } else if (adminExtra.length > 0 || navyExtra.length > 0) {
      const extra = current === 0 ? adminExtra : navyExtra;
      if (extra.length > 0) {
        name = extra.shift() + ' ' + (current === 0 ? adminCount++ : navyCount++);
      } else {
        name = baseList[current] + ' ' + (current === 0 ? adminCount++ : navyCount++);
      }
    } else {
      name = baseList[current] + ' ' + (current === 0 ? adminCount++ : navyCount++);
    }

    nameList.push(name);
    current = 1 - current; // ganti admin/navy
  }

  let vcf = '';
  fixedNumbers.forEach((num, i) => {
    vcf += `BEGIN:VCARD\nVERSION:3.0\nFN:${nameList[i]}\nTEL:${num}\nEND:VCARD\n`;
  });

  const filename = `ADMIN NAVY ${fileInput.value || 'kontak'}.vcf`;
  const blob = new Blob([vcf], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}
