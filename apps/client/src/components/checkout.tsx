import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from "@shared/lib/queryClient";
import { useToast } from "@shared/hooks/use-toast";
import { useRequireAuth } from "@shared/utils/authGuards";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Button } from "@ui/button";
import { ArrowLeft } from "lucide-react";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const CheckoutForm = ({ invoice }: { invoice: any }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const payInvoiceMutation = useMutation({
    mutationFn: async (paymentIntentId: string) => {
      const res = await apiRequest("POST", `/api/invoices/${invoice.id}/pay`, { paymentIntentId });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Payment Successful",
        description: "Thank you for your payment!",
      });
      setLocation("/invoices");
    },
    onError: (error: any) => {
      toast({
        title: "Payment Processing Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/invoices`,
        },
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        await payInvoiceMutation.mutateAsync(paymentIntent.id);
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-secondary rounded-lg p-4">
        <h3 className="font-medium text-foreground mb-2">Payment Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Invoice:</span>
            <span className="text-foreground">{invoice.invoiceNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount:</span>
            <span className="text-foreground font-medium">${parseFloat(invoice.amount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Due Date:</span>
            <span className="text-foreground">{new Date(invoice.dueDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div>
        <PaymentElement />
      </div>

      <Button 
        type="submit" 
        disabled={!stripe || isProcessing || payInvoiceMutation.isPending}
        className="w-full"
        data-testid="button-submit-payment"
      >
        {isProcessing || payInvoiceMutation.isPending ? "Processing..." : `Pay $${parseFloat(invoice.amount).toFixed(2)}`}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const { invoiceId } = useParams();
  const [, setLocation] = useLocation();
  const { user, loading: authLoading } = useRequireAuth();
  const [clientSecret, setClientSecret] = useState("");

  const { data: invoice, isLoading: invoiceLoading } = useQuery({
    queryKey: ["/api/invoices", invoiceId],
    enabled: !!invoiceId && !!user,
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/invoices`);
      const invoices = await res.json();
      return invoices.find((inv: any) => inv.id === invoiceId);
    }
  });

  useEffect(() => {
    if (!invoice) return;

    // Create PaymentIntent as soon as the invoice loads
    apiRequest("POST", "/api/create-payment-intent", { 
      amount: parseFloat(invoice.amount),
      invoiceId: invoice.id 
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error("Error creating payment intent:", error);
      });
  }, [invoice]);

  if (authLoading || invoiceLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-lg font-semibold text-foreground mb-2">Invoice Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested invoice could not be found.</p>
            <Button onClick={() => setLocation("/invoices")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Invoices
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-lg font-semibold text-foreground mb-2">Payment Not Available</h2>
            <p className="text-muted-foreground mb-4">Stripe payment processing is not configured.</p>
            <Button onClick={() => setLocation("/invoices")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Invoices
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLocation("/invoices")}
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Payment Checkout</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Make SURE to wrap the form in <Elements> which provides the stripe context. */}
          {stripePromise && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm invoice={invoice} />
            </Elements>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
