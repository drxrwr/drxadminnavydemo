const fileColumns = document.getElementById("fileColumns");

for (let i = 1; i <= 20; i++) {
  const box = document.createElement("div");
  box.className = "file-box";

  const filename = document.createElement("input");
  filename.placeholder = `Nama file untuk kolom ${i}`;

  const textarea = document.createElement("textarea");
  textarea.placeholder = "Isi nomor (satu per baris)";

  const button = document.createElement("button");
  button.textContent = "Download .vcf";
  button.addEventListener("click", () => {
    generateVCF(filename.value.trim(), textarea.value.trim());
  });

  box.appendChild(filename);
  box.appendChild(textarea);
  box.appendChild(button);
  fileColumns.appendChild(box);
}

function generateVCF(fileName, rawText) {
  const namaAdmin = document.getElementById("namaAdmin").value.trim();
  const namaNavy = document.getElementById("namaNavy").value.trim();
  const awal = document.getElementById("pilihanAwal").value;
  const urutan = document.getElementById("urutan").value;
  const jumlahAwal = parseInt(document.getElementById("jumlahAwal").value) || 1;

  const tambahanAdmin = document.getElementById("extraAdmin").value.trim().split('\n').filter(Boolean);
  const tambahanNavy = document.getElementById("extraNavy").value.trim().split('\n').filter(Boolean);

  let numbers = rawText
    .split('\n')
    .map(n => n.replace(/[^\d+]/g, '').replace(/^(\+?)(\d{1,3})(\d{5,})$/, '$1$2$3'))
    .filter(n => /^(\+?\d{10,})$/.test(n));

  if (urutan === "bawah") numbers = numbers.reverse();

  const contacts = [];
  let adminCount = 0;
  let navyCount = 0;

  const isAdmin = awal === "admin";

  numbers.forEach((num, index) => {
    let label;
    if ((isAdmin && index < jumlahAwal) || (!isAdmin && index >= jumlahAwal)) {
      adminCount++;
      label = `${namaAdmin} ${adminCount}`;
    } else {
      navyCount++;
      label = `${namaNavy} ${navyCount}`;
    }
    contacts.push({ name: label, phone: num });
  });

  tambahanAdmin.forEach((n) => {
    if (/^(\+?\d{10,})$/.test(n)) {
      adminCount++;
      contacts.push({ name: `${namaAdmin} ${adminCount}`, phone: n });
    }
  });

  tambahanNavy.forEach((n) => {
    if (/^(\+?\d{10,})$/.test(n)) {
      navyCount++;
      contacts.push({ name: `${namaNavy} ${navyCount}`, phone: n });
    }
  });

  let vcfContent = contacts
    .map(
      (c) => `BEGIN:VCARD\nVERSION:3.0\nFN:${c.name}\nTEL;TYPE=CELL:${c.phone}\nEND:VCARD`
    )
    .join('\n');

  const blob = new Blob([vcfContent], { type: "text/vcard" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `ADMIN NAVY ${fileName || 'contacts'}.vcf`;
  a.click();
}
