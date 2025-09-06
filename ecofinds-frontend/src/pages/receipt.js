import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Download, ShoppingBag, CheckCircle, Leaf } from 'lucide-react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

export default function Receipt() {
  const router = useRouter();
  const { productId, paymentId, amount, title } = router.query;
  const [receiptData, setReceiptData] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (router.isReady && productId && paymentId && amount && title) {
      setReceiptData({
        receiptId: `RCP-${Date.now()}`,
        productId,
        paymentId,
        amount: Number(amount),
        title: decodeURIComponent(title),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
      });
    }
  }, [router.isReady, productId, paymentId, amount, title]);

  const downloadPDF = async () => {
    if (!receiptData) {
      toast.error('Receipt data not available');
      return;
    }

    setDownloading(true);
    try {
      const element = document.getElementById('receipt-content');
      if (!element) {
        throw new Error('Receipt element not found');
      }

      const canvas = await html2canvas(element, {
        backgroundColor: '#1f2937',
        scale: 1.5,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`EcoFinds-Receipt-${receiptData.receiptId}.pdf`);
      toast.success('Receipt downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to download receipt. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (!receiptData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-white">Loading receipt...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
          <p className="text-gray-400">Your order has been confirmed</p>
        </motion.div>

        {/* Receipt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          id="receipt-content"
          className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden"
        >
          {/* Receipt Header */}
          <div className="bg-emerald-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">EcoFinds</h2>
                  <p className="text-emerald-100 text-sm">Purchase Receipt</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">Receipt #{receiptData.receiptId}</p>
                <p className="text-emerald-100 text-sm">{receiptData.date} {receiptData.time}</p>
              </div>
            </div>
          </div>

          {/* Receipt Body */}
          <div className="p-6 space-y-6">
            {/* Transaction Details */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Transaction Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment ID:</span>
                  <span className="text-white font-mono text-sm">{receiptData.paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Product ID:</span>
                  <span className="text-white font-mono text-sm">{receiptData.productId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment Method:</span>
                  <span className="text-white">Razorpay</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-emerald-400 font-semibold">Completed</span>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Product Details</h3>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center">
                    <Leaf className="h-8 w-8 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{receiptData.title}</h4>
                    <p className="text-gray-400 text-sm">Quantity: 1</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-400">₹{receiptData.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-gray-700 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold text-white">Total Paid:</span>
                <span className="text-3xl font-bold text-emerald-400">₹{receiptData.amount.toLocaleString()}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-700 pt-6 text-center">
              <p className="text-gray-400 text-sm">
                Thank you for choosing EcoFinds! 🌱
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Promoting sustainable consumption, one transaction at a time.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={downloadPDF}
            disabled={downloading}
            className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>{downloading ? 'Downloading...' : 'Download Receipt'}</span>
          </button>

          <Link
            href="/"
            className="flex-1 bg-gray-700 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Continue Shopping</span>
          </Link>
        </motion.div>

        {/* Additional Links */}
        <div className="mt-6 text-center space-x-6">
          <Link href="/purchase-history" className="text-emerald-400 hover:text-emerald-300 transition-colors">
            View Purchase History
          </Link>
          <Link href="/dashboard" className="text-emerald-400 hover:text-emerald-300 transition-colors">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}