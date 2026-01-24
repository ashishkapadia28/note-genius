const pdf = require('pdf-parse');

const parsePDF = async (buffer) => {
    try {
        // With pdf-parse 1.1.1, the export is usually the function itself.
        const parseFunc = (typeof pdf === 'function') ? pdf : (pdf.default || pdf);

        if (typeof parseFunc !== 'function') {
            throw new Error(`pdf-parse (v1.1.1) library function not found. Type: ${typeof pdf}`);
        }

        const data = await parseFunc(buffer);
        return data.text;
    } catch (error) {
        console.error("PDF Parse Error Details:", error);
        throw new Error('Failed to parse PDF: ' + error.message);
    }
};

module.exports = { parsePDF };
