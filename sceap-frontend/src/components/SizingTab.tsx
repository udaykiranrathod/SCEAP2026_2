import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { Upload, FileText, Calculator, Edit, Trash2 } from 'lucide-react';

interface FeederData {
  id: number;
  [key: string]: any; // Allow any additional columns from Excel
}

interface CableCatalogue {
  size: number;
  current: number;
  resistance: number;
  reactance: number;
  [key: string]: any;
}

const SizingTab = () => {
  const [feederData, setFeederData] = useState<FeederData[]>([]);
  const [feederHeaders, setFeederHeaders] = useState<string[]>([]);
  const [catalogueData, setCatalogueData] = useState<CableCatalogue[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [editingRow, setEditingRow] = useState<number | null>(null);

  // Default cable catalogue
  const defaultCatalogue: CableCatalogue[] = [
    { size: 1.5, current: 20, resistance: 12.1, reactance: 0.08 },
    { size: 2.5, current: 27, resistance: 7.41, reactance: 0.08 },
    { size: 4, current: 36, resistance: 4.61, reactance: 0.07 },
    { size: 6, current: 46, resistance: 3.08, reactance: 0.07 },
    { size: 10, current: 63, resistance: 1.83, reactance: 0.06 },
    { size: 16, current: 85, resistance: 1.15, reactance: 0.06 },
    { size: 25, current: 115, resistance: 0.727, reactance: 0.05 },
    { size: 35, current: 145, resistance: 0.524, reactance: 0.05 },
    { size: 50, current: 180, resistance: 0.387, reactance: 0.04 },
    { size: 70, current: 225, resistance: 0.268, reactance: 0.04 },
    { size: 95, current: 275, resistance: 0.193, reactance: 0.04 },
    { size: 120, current: 320, resistance: 0.153, reactance: 0.03 },
    { size: 150, current: 370, resistance: 0.124, reactance: 0.03 },
    { size: 185, current: 430, resistance: 0.0991, reactance: 0.03 },
    { size: 240, current: 530, resistance: 0.0754, reactance: 0.03 },
    { size: 300, current: 640, resistance: 0.0601, reactance: 0.02 },
    { size: 400, current: 780, resistance: 0.0470, reactance: 0.02 },
    { size: 500, current: 920, resistance: 0.0366, reactance: 0.02 },
    { size: 630, current: 1100, resistance: 0.0283, reactance: 0.02 }
  ];

  const onFeederDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, {
          type: 'array',
          cellDates: true,
          cellNF: false,
          cellText: false
        });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Use sheet_to_json with header: 1 to get array of arrays
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: '',
          blankrows: false
        });

        if (jsonData.length === 0) {
          alert('No data found in the Excel file');
          return;
        }

        // First row is headers
        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1) as any[][];

        // Filter out completely empty rows
        const validRows = rows.filter(row =>
          row.some(cell => cell !== null && cell !== undefined && cell !== '')
        );

        // Convert to feeder data format, preserving original column names
        const feeders: FeederData[] = validRows.map((row, index) => {
          const feeder: any = { id: index + 1 };
          headers.forEach((header, colIndex) => {
            // Preserve original header name
            const originalHeader = header || `Column_${colIndex + 1}`;
            feeder[originalHeader] = row[colIndex] || '';
          });
          return feeder as FeederData;
        });

        setFeederHeaders(headers);
        setFeederData(feeders);

        console.log(`Loaded ${feeders.length} feeders with ${headers.length} columns`);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        alert('Error parsing Excel file. Please check the file format and try again.');
      }
    };

    reader.readAsArrayBuffer(file);
  }, []);

  const onCatalogueDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, {
          type: 'array',
          cellDates: true,
          cellNF: false,
          cellText: false
        });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Parse as objects to maintain data types
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          defval: '',
          blankrows: false
        });

        // Filter out completely empty objects
        const validData = jsonData.filter((row: any) =>
          Object.values(row).some(val => val !== null && val !== undefined && val !== '')
        );

        setCatalogueData(validData as CableCatalogue[]);

        console.log(`Loaded ${validData.length} catalogue entries`);
      } catch (error) {
        console.error('Error parsing catalogue Excel file:', error);
        alert('Error parsing catalogue Excel file. Please check the file format and try again.');
      }
    };

    reader.readAsArrayBuffer(file);
  }, []);

  const feederDropzone = useDropzone({
    onDrop: onFeederDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    }
  });

  const catalogueDropzone = useDropzone({
    onDrop: onCatalogueDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    }
  });

  const handleRunSizing = async () => {
    setIsCalculating(true);
    // Implementation will be added
    setTimeout(() => setIsCalculating(false), 2000);
  };

  const handleEdit = (id: number) => {
    setEditingRow(id);
  };

  const handleSave = (id: number, updatedData: FeederData) => {
    setFeederData(prev => prev.map(item =>
      item.id === id ? updatedData : item
    ));
    setEditingRow(null);
  };

  const handleDelete = (id: number) => {
    setFeederData(prev => prev.filter(item => item.id !== id));
  };

  const catalogue = catalogueData.length > 0 ? catalogueData : defaultCatalogue;

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feeder List Upload */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Upload className="mr-2" size={20} />
            Upload Feeder List
          </h3>
          <div
            {...feederDropzone.getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              feederDropzone.isDragActive
                ? 'border-cyan-400 bg-cyan-400/10'
                : 'border-slate-600 hover:border-slate-500'
            }`}
          >
            <input {...feederDropzone.getInputProps()} />
            <FileText size={48} className="mx-auto mb-4 text-slate-400" />
            <p className="text-slate-300 mb-2">
              {feederDropzone.isDragActive
                ? 'Drop the Excel file here...'
                : 'Drag & drop feeder list Excel file, or click to select'}
            </p>
            <p className="text-sm text-slate-500">
              Supports .xlsx and .xls files
            </p>
          </div>
          {feederData.length > 0 && (
            <p className="mt-4 text-green-400 text-sm">
              ✓ {feederData.length} feeders loaded
            </p>
          )}
        </div>

        {/* Cable Catalogue Upload */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Upload className="mr-2" size={20} />
            Upload Cable Catalogue (Optional)
          </h3>
          <div
            {...catalogueDropzone.getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              catalogueDropzone.isDragActive
                ? 'border-cyan-400 bg-cyan-400/10'
                : 'border-slate-600 hover:border-slate-500'
            }`}
          >
            <input {...catalogueDropzone.getInputProps()} />
            <FileText size={48} className="mx-auto mb-4 text-slate-400" />
            <p className="text-slate-300 mb-2">
              {catalogueDropzone.isDragActive
                ? 'Drop the catalogue file here...'
                : 'Drag & drop cable catalogue Excel file, or click to select'}
            </p>
            <p className="text-sm text-slate-500">
              Optional - Default IEC catalogue will be used if not provided
            </p>
          </div>
          {catalogueData.length > 0 && (
            <p className="mt-4 text-green-400 text-sm">
              ✓ Custom catalogue loaded ({catalogueData.length} sizes)
            </p>
          )}
        </div>
      </div>

      {/* Feeder Data Table */}
      {feederData.length > 0 && (
        <div className="bg-slate-800 rounded-lg border border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-white">Feeder Data</h3>
                <p className="text-sm text-slate-400 mt-1">
                  {feederData.length} rows × {feederHeaders.length} columns
                </p>
              </div>
              <button
                onClick={handleRunSizing}
                disabled={isCalculating}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium"
              >
                <Calculator size={20} />
                {isCalculating ? 'Calculating...' : 'Run Cable Sizing Engine'}
              </button>
            </div>
          </div>

          {/* Scrollable container with both horizontal and vertical scrolling */}
          <div className="max-h-96 overflow-auto">
            <div className="min-w-full inline-block align-middle">
              <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-700 sticky top-0 z-10">
                  <tr>
                    {feederHeaders.map((header, index) => (
                      <th
                        key={index}
                        className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider whitespace-nowrap bg-slate-700"
                        style={{ minWidth: '120px' }}
                      >
                        {header || `Column ${index + 1}`}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider whitespace-nowrap bg-slate-700 sticky right-0">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-slate-800 divide-y divide-slate-700">
                  {feederData.map((feeder) => (
                    <tr key={feeder.id} className="hover:bg-slate-700">
                      {feederHeaders.map((header, colIndex) => (
                        <td
                          key={colIndex}
                          className="px-4 py-4 text-sm text-slate-300 whitespace-nowrap"
                          style={{ minWidth: '120px' }}
                        >
                          {editingRow === feeder.id ? (
                            <input
                              type="text"
                              defaultValue={feeder[header] || ''}
                              className="bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white w-full min-w-0"
                              onBlur={(e) => {
                                const updated = { ...feeder, [header]: e.target.value };
                                handleSave(feeder.id, updated);
                              }}
                            />
                          ) : (
                            <div className="truncate max-w-xs" title={String(feeder[header] || '')}>
                              {feeder[header] || ''}
                            </div>
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-4 text-sm font-medium whitespace-nowrap sticky right-0 bg-slate-800">
                        <button
                          onClick={() => handleEdit(feeder.id)}
                          className="text-cyan-400 hover:text-cyan-300 mr-3"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(feeder.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Catalogue Preview */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Cable Catalogue</h3>
          <span className="text-sm text-slate-400">
            {catalogue.length} cable sizes available
          </span>
        </div>
        <div className="max-h-64 overflow-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-700 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider whitespace-nowrap">
                  Size (mm²)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider whitespace-nowrap">
                  Current (A)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider whitespace-nowrap">
                  Resistance (Ω/km)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider whitespace-nowrap">
                  Reactance (Ω/km)
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
              {catalogue.map((item, index) => (
                <tr key={index} className="hover:bg-slate-700">
                  <td className="px-4 py-3 text-sm text-slate-300 whitespace-nowrap">{item.size}</td>
                  <td className="px-4 py-3 text-sm text-slate-300 whitespace-nowrap">{item.current}</td>
                  <td className="px-4 py-3 text-sm text-slate-300 whitespace-nowrap">{item.resistance}</td>
                  <td className="px-4 py-3 text-sm text-slate-300 whitespace-nowrap">{item.reactance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SizingTab;