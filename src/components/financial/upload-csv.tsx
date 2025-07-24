import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Format file tidak valid",
        description: "Silakan upload file dengan format CSV",
        variant: "destructive",
      });
      return;
    }
    
    setUploadedFile(file);
  };

  const processCSV = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    
    try {
      const text = await uploadedFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      // Skip header row and process data
      const transactions: TransactionData[] = lines.slice(1).map((line, index) => {
        const [date, description, amount, category] = line.split(',').map(item => item.trim().replace(/['"]/g, ''));
        
        return {
          date: date || `2024-01-${String(index + 1).padStart(2, '0')}`,
          description: description || 'Transaksi',
          amount: parseFloat(amount) || 0,
          category: category || 'Lainnya'
        };
      });

      onDataUpload(transactions);
      
      toast({
        title: "Data berhasil diproses!",
        description: `${transactions.length} transaksi telah dianalisis`,
      });
      
    } catch (error) {
      toast({
        title: "Gagal memproses file",
        description: "Pastikan format CSV sudah benar",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">Upload Data Transaksi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!uploadedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging 
                ? 'border-primary bg-primary/10' 
                : 'border-primary/30 bg-primary/5'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Drag & Drop File CSV</h3>
            <p className="text-muted-foreground mb-4">
              atau klik tombol di bawah untuk memilih file
            </p>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              size="lg" 
              className="bg-gradient-to-r from-primary to-success hover:from-primary/90 hover:to-success/90"
            >
              <Upload className="mr-2 h-5 w-5" />
              Pilih File CSV
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            />
          </div>
        ) : (
          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <h4 className="font-semibold">{uploadedFile.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUploadedFile(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <Button 
              onClick={processCSV}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-primary to-success hover:from-primary/90 hover:to-success/90"
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Proses Data
                </>
              )}
            </Button>
          </div>
        )}
        
        <div className="text-center space-y-2">
          <p className="text-sm font-medium">Format CSV yang dibutuhkan:</p>
          <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
            Tanggal, Deskripsi, Jumlah, Kategori<br/>
            2024-01-15, Belanja Groceries, -150000, Makanan<br/>
            2024-01-14, Gaji, 5000000, Pemasukan
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadCSV;