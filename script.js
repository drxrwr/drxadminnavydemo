window.onload = () => {
  const jumlahAwal = document.getElementById('jumlahAwal');
  for (let i = 1; i <= 20; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = i;
    jumlahAwal.appendChild(opt);
  }
};

function formatNumber(num) {
  num = num.trim();
  if (num.startsWith('+') || num.startsWith('0')) return num;
  return '+' + num;
}

function generateVCF() {
  const adminName = document.getElementById('adminName').value.trim() || 'admin';
  const navyName = document.getElementById('navyName').value.trim() || 'navy';
  const startType = document.getElementById('startType').value;
  const jumlahAwal = parseInt(document.getElementById('jumlahAwal').value);
  const extraNames = document.getElementById('extraNames').value.split(',').map(n => n.trim()).filter(Boolean);
  const fileNames = document.getElementById('fileNames').value.split('\n').map(f => f.trim()).filter(Boolean);
  const phoneNumbersRaw = document.getElementById('phoneNumbers').value.split('\n');
  const phoneNumbers = phoneNumbersRaw.map(formatNumber).filter(n => n.match(/^(\+|0)\d{9,}$/));

  fileNames.forEach((fileNameRaw, index) => {
    const fileName = "ADMIN NAVY " + fileNameRaw;
    let vcfContent = "";
    const nomor = phoneNumbers[index];
    if (!nomor) return;

    let contactList = [];
    let urutan = 1;

    for (let i = 0; i < jumlahAwal; i++) {
      if (startType === 'admin') {
        contactList.push(`${adminName} admin ${urutan}`);
        contactList.push(`${navyName} navy ${urutan}`);
      } else {
        contactList.push(`${navyName} navy ${urutan}`);
        contactList.push(`${adminName} admin ${urutan}`);
      }
      urutan++;
    }

    extraNames.forEach(extra => {
      contactList.push(`${adminName} ${extra} ${urutan}`);
      urutan++;
    });

    contactList.forEach(name => {
      vcfContent += `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${nomor}\nEND:VCARD\n\n`;
    });

    const blob = new Blob([vcfContent.trim()], { type: "text/vcard;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName + ".vcf";
    link.click();
  });
}
