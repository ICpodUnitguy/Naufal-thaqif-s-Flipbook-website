const folder = 'myfile/';
const possibleNames = ['book.pdf', 'file.pdf', 'flipbook.pdf', 'sample.pdf', '1.pdf'];

async function findPDF() {
  for (let name of possibleNames) {
    const url = `${folder}${name}`;
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.ok) return url;
    } catch {}
  }
  return null;
}

(async function () {
  const loading = document.getElementById('loading');
  const flipbook = document.getElementById('flipbook');

  const pdfUrl = await findPDF();
  if (!pdfUrl) {
    loading.textContent = 'No PDF found in myfile folder.';
    return;
  }

  const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
  const pageCount = pdf.numPages;
  loading.textContent = `Rendering ${pageCount} pages...`;

  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: ctx, viewport }).promise;

    const img = document.createElement('img');
    img.src = canvas.toDataURL();
    img.className = 'page';
    flipbook.appendChild(img);
  }

  loading.style.display = 'none';
  flipbook.style.display = 'block';

  $(flipbook).turn({
    width: '100%',
    height: '100%',
    autoCenter: true,
    gradients: true,
    acceleration: true,
    duration: 1000,
    elevation: 50
  });

  document.getElementById('nextBtn').onclick = () => $(flipbook).turn('next');
  document.getElementById('prevBtn').onclick = () => $(flipbook).turn('previous');
})();
