import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, TrendingUp, TrendingDown, PiggyBank, Target } from "lucide-react";

const FinancialDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
            Personal Finance Advisor
          </h1>
          <p className="text-muted-foreground text-lg">
            Analisis keuangan pintar dengan AI untuk hidup yang lebih sejahtera
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-income to-success">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-3 text-income-foreground" />
              <h3 className="text-2xl font-bold text-income-foreground">Rp 0</h3>
              <p className="text-income-foreground/80">Total Pemasukan</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-expense to-destructive">
            <CardContent className="p-6 text-center">
              <TrendingDown className="h-12 w-12 mx-auto mb-3 text-expense-foreground" />
              <h3 className="text-2xl font-bold text-expense-foreground">Rp 0</h3>
              <p className="text-expense-foreground/80">Total Pengeluaran</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-primary to-primary/80">
            <CardContent className="p-6 text-center">
              <PiggyBank className="h-12 w-12 mx-auto mb-3 text-primary-foreground" />
              <h3 className="text-2xl font-bold text-primary-foreground">Rp 0</h3>
              <p className="text-primary-foreground/80">Total Tabungan</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-warning to-warning/80">
            <CardContent className="p-6 text-center">
              <Target className="h-12 w-12 mx-auto mb-3 text-warning-foreground" />
              <h3 className="text-2xl font-bold text-warning-foreground">0%</h3>
              <p className="text-warning-foreground/80">Target Budget</p>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Mulai Analisis Keuangan Anda</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="border-2 border-dashed border-primary/30 rounded-lg p-12 bg-primary/5">
              <Upload className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Upload Data Transaksi</h3>
              <p className="text-muted-foreground mb-4">
                Upload file CSV rekap transaksi bank atau catatan keuangan Anda
              </p>
              <Button size="lg" className="bg-gradient-to-r from-primary to-success hover:from-primary/90 hover:to-success/90">
                <Upload className="mr-2 h-5 w-5" />
                Pilih File CSV
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Format yang didukung: CSV dengan kolom tanggal, deskripsi, jumlah, dan kategori
            </p>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <span>Analisis Pola</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                AI akan menganalisis pola pengeluaran Anda dan memberikan insights yang mendalam
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PiggyBank className="h-6 w-6 text-success" />
                <span>Saran Hemat</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Dapatkan rekomendasi personal untuk menghemat dan menabung lebih efektif
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-6 w-6 text-warning" />
                <span>Budget Otomatis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Sistem akan membuat rencana budget yang realistis sesuai gaya hidup Anda
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;