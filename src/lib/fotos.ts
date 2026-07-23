export interface FotoProduct {
  id: string;
  name: string;
  images: string[];
  brand: string;
  model: string;
  category: string;
  discontinued?: boolean;
}

function parseCSVLine(line: string, delimiter: string = ';'): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function detectDelimiter(firstLine: string): string {
  const semiCount = (firstLine.match(/;/g) || []).length;
  const commaCount = (firstLine.match(/,/g) || []).length;
  return commaCount > semiCount ? ',' : ';';
}

export function parseFotosCsv(csvContent: string): FotoProduct[] {
  const normalizedContent = csvContent.replace(/^\uFEFF/, '');
  const lines = normalizedContent.split('\n').filter((line) => line.trim());

  if (lines.length === 0) {
    return [];
  }

  const delimiter = detectDelimiter(lines[0]);
  const headers = parseCSVLine(lines[0], delimiter).map((header) => header.toLowerCase().trim());

  const findIndex = (patterns: string[]): number =>
    headers.findIndex((header) => patterns.some((pattern) => header.includes(pattern.toLowerCase())));

  const nameIdx = findIndex(['nome produto', 'nome', 'product name']);
  const img1Idx = findIndex(['imagem principal', 'imagem 1', 'image 1', 'imagen principal']);
  const img2Idx = findIndex(['imagem 2', 'image 2', 'imagen 2']);
  const img3Idx = findIndex(['imagem 3', 'image 3', 'imagen 3']);
  const img4Idx = findIndex(['imagem 4', 'image 4', 'imagen 4']);
  const marcaIdx = findIndex(['marca', 'brand', 'manufacturer']);
  const modeloIdx = findIndex(['modelo', 'model']);
  const imagensAdicionaisIdx = findIndex(['imagens adicionais', 'additional images', 'imágenes adicionais']);
  const categoriaIdx = findIndex(['nome categoria', 'categoria nome', 'nome da categoria', 'categoria', 'category']);

  const products: FotoProduct[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i], delimiter);
    const name = nameIdx >= 0 ? row[nameIdx]?.trim() || '' : '';
    if (!name) continue;

    const img1 = img1Idx >= 0 ? row[img1Idx]?.trim() || '' : '';
    const img2 = img2Idx >= 0 ? row[img2Idx]?.trim() || '' : '';
    const img3 = img3Idx >= 0 ? row[img3Idx]?.trim() || '' : '';
    const img4 = img4Idx >= 0 ? row[img4Idx]?.trim() || '' : '';
    const brand = marcaIdx >= 0 ? row[marcaIdx]?.trim() || '' : '';
    const model = modeloIdx >= 0 ? row[modeloIdx]?.trim() || '' : '';
    const category = categoriaIdx >= 0 ? row[categoriaIdx]?.trim() || '' : '';
    const additionalRaw = imagensAdicionaisIdx >= 0 ? row[imagensAdicionaisIdx]?.trim() || '' : '';

    const additionalImages = additionalRaw
      .split(',')
      .map((value) => value.trim())
      .filter((value) => value && value.startsWith('http'));

    const images = [img1, img2, img3, img4, ...additionalImages].filter(
      (value) => value && value.startsWith('http')
    );

    products.push({
      id: `p${i}`,
      name,
      images,
      brand,
      model,
      category: category || 'Sem categoria',
      discontinued: false
    });
  }

  return products;
}

export async function loadBaseFotoProducts(): Promise<FotoProduct[]> {
  const response = await fetch('/Fotos.csv');
  const buffer = await response.arrayBuffer();
  const decoder = new TextDecoder('windows-1252');
  const text = decoder.decode(buffer);
  return parseFotosCsv(text);
}
