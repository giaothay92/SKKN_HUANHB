import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType } from "docx";
import { ReportData } from "../types";

// Helper function to save Blob as file without external dependencies
const saveAs = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};

// Simple Markdown to Docx Parser
const parseMarkdownToDocx = (text: string): (Paragraph | Table)[] => {
  const lines = text.split('\n');
  const elements: (Paragraph | Table)[] = [];
  let isInTable = false;
  let tableRows: TableRow[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    // Handle Tables (Basic pipe table support)
    if (line.startsWith('|')) {
      if (!isInTable) {
        isInTable = true;
        tableRows = []; // Start new table
      }
      
      // Check if it's a separator line (e.g., |---|---|)
      if (line.includes('---')) continue;

      const cells = line.split('|').filter(c => c.trim() !== '').map(cellText => {
        return new TableCell({
          children: [new Paragraph({
            children: parseInlineStyles(cellText.trim())
          })],
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1 },
            bottom: { style: BorderStyle.SINGLE, size: 1 },
            left: { style: BorderStyle.SINGLE, size: 1 },
            right: { style: BorderStyle.SINGLE, size: 1 },
          }
        });
      });

      tableRows.push(new TableRow({ children: cells }));
      continue;
    } else {
      if (isInTable) {
        // Table ended
        elements.push(new Table({ rows: tableRows, width: { size: 100, type: WidthType.PERCENTAGE } }));
        isInTable = false;
        tableRows = [];
      }
    }

    if (!line) {
        elements.push(new Paragraph({ text: "" })); // Empty line
        continue;
    }

    // Headings - Ensure Bold and correct spacing
    if (line.startsWith('# ')) {
      elements.push(new Paragraph({
        text: line.replace('# ', ''),
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      }));
    } else if (line.startsWith('## ')) {
      elements.push(new Paragraph({
        text: line.replace('## ', ''),
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 150 }
      }));
    } else if (line.startsWith('### ')) {
      elements.push(new Paragraph({
        text: line.replace('### ', ''),
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 100 }
      }));
    } 
    // Bullet Points
    else if (line.startsWith('- ') || line.startsWith('* ')) {
       elements.push(new Paragraph({
        children: parseInlineStyles(line.substring(2)),
        bullet: { level: 0 }
      }));
    }
    // Numbered Lists (Simple detection)
    else if (/^\d+\.\s/.test(line)) {
        const textContent = line.replace(/^\d+\.\s/, '');
        elements.push(new Paragraph({
            children: parseInlineStyles(textContent),
            indent: { left: 720, hanging: 360 } 
        }));
    }
    // Standard Paragraph
    else {
      elements.push(new Paragraph({
        children: parseInlineStyles(line),
        spacing: { after: 120 },
        alignment: AlignmentType.JUSTIFIED
      }));
    }
  }
  
  // Flush any remaining table
  if (isInTable) {
      elements.push(new Table({ rows: tableRows, width: { size: 100, type: WidthType.PERCENTAGE } }));
  }

  return elements;
};

// Helper to handle **Bold** and *Italic*
const parseInlineStyles = (text: string): TextRun[] => {
  const runs: TextRun[] = [];
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  parts.forEach(part => {
    if (part.startsWith('**') && part.endsWith('**')) {
      runs.push(new TextRun({
        text: part.replace(/\*\*/g, ''),
        bold: true,
        font: "Times New Roman",
        size: 28 // 14pt
      }));
    } else {
        const mathParts = part.split(/(\$.*?\$)/g);
        mathParts.forEach(mPart => {
            if (mPart.startsWith('$') && mPart.endsWith('$')) {
                 runs.push(new TextRun({
                     text: mPart,
                     italics: true,
                     color: "444444",
                     font: "Times New Roman",
                     size: 28 // 14pt
                 }));
            } else {
                 if (mPart) runs.push(new TextRun({ 
                     text: mPart, 
                     font: "Times New Roman", 
                     size: 28 // 14pt 
                }));
            }
        });
    }
  });

  return runs;
};

export const exportToWord = async (report: ReportData, fileName: string = 'Sáng_Kiến_Kinh_Nghiệm.docx') => {
  
  const children = [
    // Title Page
    new Paragraph({
        text: "SÁNG KIẾN KINH NGHIỆM",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 400 }
    }),
    new Paragraph({
        text: report.title.toUpperCase(),
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 800 }
    }),
    
    // Content Parts
    ...parseMarkdownToDocx(report.part1_introduction),
    new Paragraph({ text: "", spacing: { after: 400 } }), 
    
    ...parseMarkdownToDocx(report.part2_theory_status),
    new Paragraph({ text: "", spacing: { after: 400 } }), 
    
    ...parseMarkdownToDocx(report.part2_solutions),
    new Paragraph({ text: "", spacing: { after: 400 } }), 
    
    ...parseMarkdownToDocx(report.part2_results),
    new Paragraph({ text: "", spacing: { after: 400 } }), 
    
    ...parseMarkdownToDocx(report.part3_conclusion),
    new Paragraph({ text: "", spacing: { after: 400 } }), 
    
    ...parseMarkdownToDocx(report.part4_references),
  ];

  const doc = new Document({
    sections: [{
      properties: {},
      children: children,
    }],
    styles: {
        default: {
            heading1: {
                run: {
                    font: "Times New Roman",
                    size: 32, // 16pt
                    bold: true,
                    color: "000000"
                },
                paragraph: { spacing: { before: 240, after: 120 } },
            },
            heading2: {
                run: {
                    font: "Times New Roman",
                    size: 28, // 14pt
                    bold: true,
                    color: "000000"
                },
                paragraph: { spacing: { before: 240, after: 120 } },
            },
            heading3: {
                run: {
                    font: "Times New Roman",
                    size: 28, // 14pt
                    bold: true,
                    color: "000000"
                },
                paragraph: { spacing: { before: 240, after: 120 } },
            }
        },
        paragraphStyles: [
            {
                id: "Normal",
                name: "Normal",
                run: {
                    font: "Times New Roman",
                    size: 28, // 14pt
                },
                paragraph: {
                    spacing: { line: 300 }, // 1.5 line spacing
                }
            }
        ]
    }
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, fileName);
};

export const exportSingleStep = async (title: string, content: string) => {
    const doc = new Document({
        sections: [{
          children: [
              new Paragraph({ text: title, heading: HeadingLevel.HEADING_1 }),
              ...parseMarkdownToDocx(content)
          ],
        }],
        styles: {
            default: {
                 heading1: { run: { font: "Times New Roman", size: 32, bold: true, color: "000000" } },
                 heading2: { run: { font: "Times New Roman", size: 28, bold: true, color: "000000" } }
            },
            paragraphStyles: [
                {
                    id: "Normal",
                    name: "Normal",
                    run: { font: "Times New Roman", size: 28 } // 14pt
                }
            ]
        }
      });
    
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${title}.docx`);
}