import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, CheckCircle, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface TransactionData {
  date: string;
  description: string;
  amount: number;
  category: string;
}

interface UploadCSVProps {
  onDataUpload: (data: TransactionData[]) => void;
}

const UploadCSV = ({ onDataUpload }: UploadCSVProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    const isValidFormat = file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    
    if (!isValidFormat) {
      toast({
        title: "Invalid file format",
        description: "Please upload CSV or Excel files only",
        variant: "destructive",
      });
      return;
    }
    
    setUploadedFile(file);
  };

  const processExcelFile = async (file: File): Promise<TransactionData[]> => {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Skip header row and process data
    const transactions: TransactionData[] = (jsonData as any[]).slice(1).map((row: any[], index) => {
      const [date, description, amount, category] = row;
      
      return {
        date: date ? String(date) : `2024-01-${String(index + 1).padStart(2, '0')}`,
        description: description ? String(description) : 'Transaction',
        amount: typeof amount === 'number' ? amount : parseFloat(String(amount)) || 0,
        category: category ? String(category) : 'Other'
      };
    }).filter(transaction => transaction.amount !== 0); // Filter out empty rows
    
    return transactions;
  };

  const processCSVFile = async (file: File): Promise<TransactionData[]> => {
    const text = await file.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    // Skip header row and process data
    const transactions: TransactionData[] = lines.slice(1).map((line, index) => {
      const [date, description, amount, category] = line.split(',').map(item => item.trim().replace(/['"]/g, ''));
      
      return {
        date: date || `2024-01-${String(index + 1).padStart(2, '0')}`,
        description: description || 'Transaction',
        amount: parseFloat(amount) || 0,
        category: category || 'Other'
      };
    });
    
    return transactions;
  };

  const processFile = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    
    try {
      let transactions: TransactionData[];
      
      if (uploadedFile.name.endsWith('.csv')) {
        transactions = await processCSVFile(uploadedFile);
      } else {
        transactions = await processExcelFile(uploadedFile);
      }

      onDataUpload(transactions);
      
      toast({
        title: "Data processed successfully!",
        description: `${transactions.length} transactions have been analyzed`,
      });
      
    } catch (error) {
      toast({
        title: "Failed to process file",
        description: "Please ensure your file format is correct",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.csv')) return <FileText className="h-8 w-8 text-primary" />;
    return <FileSpreadsheet className="h-8 w-8 text-success" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header with Branding */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-success rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              Casha
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-foreground">Upload Financial Data</h2>
          <p className="text-muted-foreground text-lg">
            Upload your transaction data to start your financial analysis
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">Import Your Data</CardTitle>
            <p className="text-muted-foreground">Support for CSV and Excel files</p>
          </CardHeader>
          <CardContent className="space-y-8">
            {!uploadedFile ? (
              <div
                className={`border-2 border-dashed rounded-xl p-16 text-center transition-all duration-300 ${
                  isDragging 
                    ? 'border-primary bg-gradient-to-br from-primary/20 to-success/20 scale-105' 
                    : 'border-primary/30 bg-gradient-to-br from-primary/5 to-success/5 hover:from-primary/10 hover:to-success/10'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-20 w-20 mx-auto mb-6 text-primary drop-shadow-sm" />
                <h3 className="text-2xl font-semibold mb-4 text-foreground">
                  Drag & Drop Your Files Here
                </h3>
                <p className="text-muted-foreground mb-6 text-lg">
                  or click the button below to select files
                </p>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-success hover:from-primary/90 hover:to-success/90 shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-3"
                >
                  <Upload className="mr-3 h-6 w-6" />
                  Select Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                />
              </div>
            ) : (
              <div className="border border-border rounded-xl p-8 bg-gradient-to-br from-card to-muted/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    {getFileIcon(uploadedFile.name)}
                    <div>
                      <h4 className="font-semibold text-lg text-foreground">{uploadedFile.name}</h4>
                      <p className="text-muted-foreground">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUploadedFile(null)}
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <Button 
                  onClick={processFile}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-primary to-success hover:from-primary/90 hover:to-success/90 shadow-lg hover:shadow-xl transition-all duration-300 text-lg py-4"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-3 h-6 w-6" />
                      Analyze Data
                    </>
                  )}
                </Button>
              </div>
            )}
            
            {/* File Format Guide */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-xl border border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="h-6 w-6 text-primary" />
                  <h4 className="font-semibold text-foreground">CSV Format</h4>
                </div>
                <div className="text-sm text-muted-foreground bg-background/80 p-3 rounded-lg font-mono">
                  Date, Description, Amount, Category<br/>
                  2024-01-15, Grocery Shopping, -150, Food<br/>
                  2024-01-14, Salary, 5000, Income
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-success/5 to-success/10 p-6 rounded-xl border border-success/20">
                <div className="flex items-center gap-3 mb-3">
                  <FileSpreadsheet className="h-6 w-6 text-success" />
                  <h4 className="font-semibold text-foreground">Excel Format</h4>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">Same column structure as CSV:</p>
                  <ul className="space-y-1">
                    <li>• Column A: Date</li>
                    <li>• Column B: Description</li>
                    <li>• Column C: Amount</li>
                    <li>• Column D: Category</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadCSV;