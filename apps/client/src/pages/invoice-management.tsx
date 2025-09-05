import { useRequireAuth } from "@shared/utils/authGuards";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Download, CreditCard, Calendar, Check, Clock, FileText } from "lucide-react";
import { Button } from "@ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";

export default function InvoiceManagement() {
  const { user, loading } = useRequireAuth();
  const [, setLocation] = useLocation();

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["/api/invoices"],
    enabled: !!user,
  });

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const totalPaid = (invoices as any[])
    ?.filter((inv: any) => inv.status === "paid")
    ?.reduce((sum: number, inv: any) => sum + parseFloat(inv.amount), 0) || 0;

  const totalPending = (invoices as any[])
    ?.filter((inv: any) => inv.status === "pending")
    ?.reduce((sum: number, inv: any) => sum + parseFloat(inv.amount), 0) || 0;

  const nextDueInvoice = (invoices as any[])
    ?.filter((inv: any) => inv.status === "pending")
    ?.sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  const handlePayInvoice = (invoiceId: string) => {
    setLocation(`/checkout/${invoiceId}`);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    // Implementation for downloading invoice
    console.log("Downloading invoice:", invoiceId);
  };

  return (
    <section className="min-h-screen bg-background">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Invoice Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Invoices & Payments</h2>
              <p className="text-muted-foreground">Manage your billing and payment history</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" data-testid="button-download-all">
                <Download className="mr-2 h-4 w-4" /> Download All
              </Button>
              <Button variant="secondary" data-testid="button-payment-methods">
                <CreditCard className="mr-2 h-4 w-4" /> Payment Methods
              </Button>
            </div>
          </div>

          {/* Payment Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Check className="text-green-600 h-5 w-5" />
                  </div>
                  <span className="text-2xl font-bold text-foreground" data-testid="total-paid">
                    ${totalPaid.toLocaleString()}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-muted-foreground">Total Paid</h3>
                <p className="text-xs text-green-600">All invoices current</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <Clock className="text-orange-600 h-5 w-5" />
                  </div>
                  <span className="text-2xl font-bold text-foreground" data-testid="total-pending">
                    ${totalPending.toLocaleString()}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-muted-foreground">Pending</h3>
                <p className="text-xs text-orange-600">
                  {(invoices as any[])?.filter((inv: any) => inv.status === "pending").length || 0} invoice(s) due soon
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="text-primary h-5 w-5" />
                  </div>
                  <span className="text-2xl font-bold text-foreground" data-testid="next-due-date">
                    {nextDueInvoice ? new Date(nextDueInvoice.dueDate).toLocaleDateString() : "None"}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-muted-foreground">Next Due Date</h3>
                <p className="text-xs text-primary">
                  {nextDueInvoice 
                    ? `${Math.ceil((new Date(nextDueInvoice.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining`
                    : "No pending invoices"
                  }
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Invoice List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Invoice</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Amount</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(invoices as any[])?.map((invoice: any) => (
                      <tr 
                        key={invoice.id} 
                        className="border-b border-border hover:bg-secondary/50 transition-colors"
                        data-testid={`invoice-row-${invoice.id}`}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              invoice.status === "paid" ? "bg-green-500/10" : "bg-primary/10"
                            }`}>
                              {invoice.status === "paid" ? (
                                <Check className="text-green-600 h-4 w-4" />
                              ) : (
                                <FileText className="text-primary h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{invoice.invoiceNumber}</p>
                              <p className="text-xs text-muted-foreground">
                                {invoice.projectId ? `Project Invoice` : "Service Invoice"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-muted-foreground">
                          {new Date(invoice.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-foreground">
                          ${parseFloat(invoice.amount).toFixed(2)}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 text-xs rounded-md ${
                            invoice.status === "paid" 
                              ? "bg-green-500/10 text-green-600"
                              : invoice.status === "pending"
                                ? "bg-orange-500/10 text-orange-600"
                                : "bg-red-500/10 text-red-600"
                          }`}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            {invoice.status === "pending" && (
                              <Button 
                                size="sm"
                                onClick={() => handlePayInvoice(invoice.id)}
                                data-testid={`button-pay-${invoice.id}`}
                              >
                                Pay Now
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDownloadInvoice(invoice.id)}
                              data-testid={`button-download-${invoice.id}`}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {(!invoices || (invoices as any[]).length === 0) && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          No invoices found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
