import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { print } from 'pdf-to-printer';

interface ComandaItem {
  name: string;
  quantity: number;
  price: number;
}

class Comanda {
  private items: ComandaItem[] = [];

  addItem(name: string, quantity: number, price: number): void {
    this.items.push({ name, quantity, price });
  }

  printToPDF(filename: string): void {
    const doc = new PDFDocument({
      size: [165, 297], // Largura de 58 mm (~165 pontos) e altura padrão
      margins: { top: 0, left: 0, bottom: 0, right: 0 } // Margens zero para usar toda a largura
    });

    doc.pipe(fs.createWriteStream(filename));

    doc.fontSize(16).text('=== Comanda ===', { align: 'center', width: 165 });

    let total = 0;
    this.items.forEach(item => {
      const itemTotal = item.quantity * item.price;
      total += itemTotal;
      doc.fontSize(12).text(`${item.name}: ${item.quantity} x $${item.price.toFixed(2)} = $${itemTotal.toFixed(2)}`, { width: 165 });
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total: $${total.toFixed(2)}`, { align: 'center', width: 165 });

    doc.end();
  }

  async printToPrinter(pdfFilename: string, printerName: string): Promise<void> {
    try {
      await print(pdfFilename, { printer: printerName });
      console.log(`PDF enviado para a impressora ${printerName}.`);
    } catch (error) {
      console.error(`Erro ao imprimir PDF: ${""}`);
    }
  }
}

// Exemplo de uso
const comanda = new Comanda();
comanda.addItem("Café", 2, 3.5);
comanda.addItem("Croissant", 1, 2.75);

// Salva a comanda como PDF
const pdfFilename = 'comanda.pdf';
comanda.printToPDF(pdfFilename);

// Imprime o PDF na impressora especificada
comanda.printToPrinter(pdfFilename, 'POS58 Printer'); // Substitua pelo nome da sua impressora

console.log("Comanda salva como 'comanda.pdf' e enviada para a impressora.");
