# Payment History System Documentation

## Overview
Production-ready payment history system for YVITY Dashboard that displays advisor payments from the `advisor_payments` table with secure download functionality.

## Architecture

### Components

#### 1. **Pricing_History.jsx** (Main Component)
- Displays payment history in a professional table
- Real-time data fetching from API
- Loading, error, and empty states
- Pagination support
- Download functionality for paid payments
- Status indicators with colored badges
- Plan icons (Gold, Silver, Basic)

**Features:**
- ✅ Secure API authentication
- ✅ Proper error handling
- ✅ Loading states with spinners
- ✅ Empty state messaging
- ✅ Responsive design
- ✅ Hover effects and transitions
- ✅ Disabled download for non-paid payments

#### 2. **PaymentDetailsModal.jsx** (Optional)
Advanced modal for viewing complete payment details before downloading.

**Features:**
- Detailed transaction information
- Status-based color coding
- Additional metadata display
- Security notice
- Professional layout

**Usage:**
```jsx
import PaymentDetailsModal from "@/components/features/advisor/subscriptions/PaymentDetailsModal";

// In component
const [selectedPayment, setSelectedPayment] = useState(null);

<PaymentDetailsModal
  isOpen={!!selectedPayment}
  payment={selectedPayment}
  onClose={() => setSelectedPayment(null)}
  onDownload={handleDownload}
  isDownloading={downloading[selectedPayment?.id]}
/>
```

### API Endpoints

#### 1. **GET /api/advisor/subscription/payments**
Fetch advisor payment history with pagination.

**Query Parameters:**
- `limit` (number): Records per page (default: 50)
- `offset` (number): Pagination offset (default: 0)
- `status` (string): Filter by status (paid, failed, processing, created)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "amount": 299900,
      "currency": "₹",
      "status": "paid",
      "plan_id": "gold",
      "razorpay_order_id": "order_xyz",
      "razorpay_payment_id": "pay_xyz",
      "payment_method": "netbanking",
      "paid_at": "2026-04-30T10:30:00.000Z",
      "created_at": "2026-04-30T10:00:00.000Z",
      "amount_formatted": "₹ 2999.00",
      "paid_at_formatted": "30 Apr 2026",
      "created_at_formatted": "30 Apr 2026"
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 15,
    "hasMore": false
  }
}
```

**Error Responses:**
- `401`: Unauthorized - User not authenticated
- `500`: Server error

#### 2. **GET /api/advisor/subscription/payments/download/:paymentId**
Download payment details as JSON or CSV.

**Query Parameters:**
- `format` (string): "json" or "csv" (default: "json")

**Response Headers:**
```
Content-Disposition: attachment; filename="payment-{id}.json"
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "data": {
    "invoice_number": "INV-ABC12345",
    "date_generated": "2026-04-30T11:00:00.000Z",
    "payment_id": "uuid",
    "razorpay_order_id": "order_xyz",
    "razorpay_payment_id": "pay_xyz",
    "amount": 2999.00,
    "currency": "INR",
    "plan": "gold",
    "status": "paid",
    "payment_method": "netbanking",
    "paid_at": "2026-04-30T10:30:00.000Z",
    "created_at": "2026-04-30T10:00:00.000Z",
    "webhook_verified": true
  }
}
```

### Utilities

#### payment-utils.js
Helper functions for payment operations:

```javascript
// Format amount with currency
formatPaymentAmount(amount, currency)

// Format date
formatPaymentDate(dateString)

// Format time
formatPaymentTime(dateString)

// Generate invoice filename
generateInvoiceFilename(paymentId)

// Export to CSV
exportPaymentToCSV(payments)

// Export to JSON
exportPaymentToJSON(payments)

// Calculate statistics
getPaymentStats(payments)
```

### Custom Hook

#### usePaymentHistory.js
React hook for managing payment state and operations:

```javascript
const {
  payments,
  loading,
  error,
  pagination,
  fetchPayments,
  downloadPaymentDetails,
  refetch,
  setPagination
} = usePaymentHistory();
```

## Usage Examples

### Basic Implementation
```jsx
import Pricing_History from "@/components/features/advisor/subscriptions/Pricing_History";

export default function SubscriptionsPage() {
  return (
    <div>
      <Pricing_History />
    </div>
  );
}
```

### Using Custom Hook
```jsx
"use client";

import { usePaymentHistory } from "@/hooks/usePaymentHistory";

export default function PaymentAnalytics() {
  const { payments, loading, error, fetchPayments } = usePaymentHistory();

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {payments.map(payment => (
        <div key={payment.id}>
          {payment.amount_formatted} - {payment.status}
        </div>
      ))}
    </div>
  );
}
```

### With Filtering
```jsx
const { fetchPayments } = usePaymentHistory();

// Fetch only completed payments
fetchPayments({ status: 'paid' });

// Fetch with custom pagination
fetchPayments({ limit: 100, offset: 50 });
```

## Security Features

### Backend Security
- ✅ User authentication validation (`ValidateUser`)
- ✅ User ID verification - only authorized users can access their payments
- ✅ Razorpay signature verification
- ✅ Webhook verification checks
- ✅ No sensitive data exposure in responses
- ✅ Admin client for secure database access

### Frontend Security
- ✅ Secure API calls with headers
- ✅ Error boundary handling
- ✅ XSS prevention through React
- ✅ No hardcoded sensitive data
- ✅ Safe download handling

## Status Types

| Status | Label | Icon | Color | Description |
|--------|-------|------|-------|-------------|
| `paid` | Completed | ✓ | Green | Successfully paid |
| `failed` | Failed | ✗ | Red | Payment failed |
| `processing` | Processing | ⏳ | Blue | Payment in progress |
| `created` | Pending | ⏳ | Yellow | Awaiting payment |

## Plan Types

| Plan | Icon | Name |
|------|------|------|
| `gold` | 👑 Crown | Gold Plan |
| `silver` | 🥈 Award | Silver Plan |
| `basic` | 🎖️ Award | Basic Plan |

## Database Schema Reference

```sql
CREATE TABLE advisor_payments (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL,
  amount numeric NOT NULL,
  currency text DEFAULT 'INR',
  status text NOT NULL,
  plan_id text NOT NULL,
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  payment_method text,
  receipt text,
  failure_reason text,
  webhook_verified boolean DEFAULT FALSE,
  paid_at timestamp with time zone,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
```

## Error Handling

### Frontend Error Scenarios
1. **Unauthorized (401)**: Redirect to login
2. **Server Error (500)**: Display user-friendly error message with retry button
3. **Network Error**: Show offline message
4. **Invalid Payment ID**: Show 404 message

### Best Practices
- Always check response status before processing data
- Provide user feedback for all operations
- Implement exponential backoff for retries
- Log errors for debugging

## Performance Considerations

- ✅ Pagination to limit data per request
- ✅ Lazy loading for images/icons
- ✅ Memoized components to prevent unnecessary re-renders
- ✅ Efficient database queries with indexes
- ✅ Client-side caching (optional)

## Testing

### API Testing
```bash
# Fetch payments
curl -X GET http://localhost:3000/api/advisor/subscription/payments \
  -H "Authorization: Bearer TOKEN"

# Download payment
curl -X GET http://localhost:3000/api/advisor/subscription/payments/download/{id} \
  -H "Authorization: Bearer TOKEN" \
  -o payment.json
```

### Unit Tests (Example)
```javascript
describe('PaymentHistory', () => {
  it('should fetch and display payments', async () => {
    // Mock API
    // Render component
    // Assert payments are displayed
  });

  it('should handle errors gracefully', async () => {
    // Mock API error
    // Assert error message is shown
  });

  it('should enable download only for paid payments', () => {
    // Assert download button is disabled for non-paid
  });
});
```

## Future Enhancements

- [ ] Filters: Date range, status, plan type
- [ ] Sort: By date, amount, status
- [ ] Export: Multiple formats (PDF, Excel)
- [ ] Search: By transaction ID, order ID
- [ ] Analytics: Charts, statistics, trends
- [ ] Notifications: Payment status updates
- [ ] Retry: Failed payment retry mechanism
- [ ] Invoice PDF generation

## Troubleshooting

### Issue: Payments not loading
**Solution:**
1. Check user authentication
2. Verify API endpoint is accessible
3. Check browser console for errors
4. Verify database connection

### Issue: Download not working
**Solution:**
1. Check browser pop-up settings
2. Verify payment status is "paid"
3. Check CORS settings
4. Verify file size limits

### Issue: Styling issues
**Solution:**
1. Verify Tailwind CSS is configured
2. Check color variables are defined
3. Import necessary icon libraries
4. Check for CSS conflicts

## Support

For issues or questions:
1. Check this documentation
2. Review error messages in console
3. Check database records
4. Contact backend team

---

**Last Updated:** April 30, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
