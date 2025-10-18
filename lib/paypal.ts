// export async function generatePayPalLink(data: {
//     amount: number;
//     description: string;
//     bookingId: string;
//   }) {
//     try {
//       const accessToken = await getPayPalAccessToken();
      
//       const response = await fetch('https://api-m.paypal.com/v2/checkout/orders', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify({
//           intent: 'CAPTURE',
//           purchase_units: [{
//             amount: {
//               currency_code: 'USD',
//               value: data.amount.toFixed(2),
//             },
//             description: data.description,
//             custom_id: data.bookingId,
//           }],
//           application_context: {
//             return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
//             cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
//           },
//         }),
//       });
  
//       const order = await response.json();
      
//       // Log the response to see what PayPal is returning
//       console.log("PayPal API Response:", order);
      
//       if (!response.ok) {
//         console.error("PayPal API Error:", order);
//         throw new Error(`PayPal API Error: ${order.message || 'Unknown error'}`);
//       }
      
//       if (!order.links || !Array.isArray(order.links)) {
//         throw new Error('PayPal response missing links array');
//       }
      
//       const approveLink = order.links.find((link: any) => link.rel === 'approve');
      
//       if (!approveLink) {
//         throw new Error('PayPal approve link not found in response');
//       }
      
//       return approveLink.href;
//     } catch (error) {
//       console.error("Error generating PayPal link:", error);
//       throw error;
//     }
//   }
  
//   async function getPayPalAccessToken() {
//     try {
//       const auth = Buffer.from(
//         `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
//       ).toString('base64');
  
//       const response = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Basic ${auth}`,
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: 'grant_type=client_credentials',
//       });
  
//       if (!response.ok) {
//         const error = await response.json();
//         console.error("PayPal Auth Error:", error);
//         throw new Error(`PayPal authentication failed: ${error.error_description || error.error}`);
//       }
  
//       const data = await response.json();
//       return data.access_token;
//     } catch (error) {
//       console.error("Error getting PayPal access token:", error);
//       throw error;
//     }
//   }



export async function generatePayPalLink(data: {
    amount: number;
    description: string;
    bookingId: string;
  }) {
    try {
      const accessToken = await getPayPalAccessToken();
      
      // Use sandbox endpoint for testing
    //   const apiUrl = process.env.NODE_ENV === 'production' 
    //     ? 'https://api-m.paypal.com/v2/checkout/orders'
    //     : 'https://api-m.sandbox.paypal.com/v2/checkout/orders';

        const apiUrl = 'https://api-m.sandbox.paypal.com/v2/checkout/orders'
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: 'USD',
              value: data.amount.toFixed(2),
            },
            description: data.description,
            custom_id: data.bookingId,
          }],
          application_context: {
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
          },
        }),
      });
  
      const order = await response.json();
      
      console.log("PayPal API Response:", order);
      
      if (!response.ok) {
        console.error("PayPal API Error:", order);
        throw new Error(`PayPal API Error: ${order.message || JSON.stringify(order)}`);
      }
      
      if (!order.links || !Array.isArray(order.links)) {
        throw new Error('PayPal response missing links array');
      }
      
      const approveLink = order.links.find((link: any) => link.rel === 'approve');
      
      if (!approveLink) {
        throw new Error('PayPal approve link not found in response');
      }
      
      return approveLink.href;
    } catch (error) {
      console.error("Error generating PayPal link:", error);
      throw error;
    }
  }
  
  async function getPayPalAccessToken() {
    try {
      const auth = Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
      ).toString('base64');
  
      // Use sandbox endpoint for testing
    //   const tokenUrl = process.env.NODE_ENV === 'production'
    //     ? 'https://api-m.paypal.com/v1/oauth2/token'
    //     : 'https://api-m.sandbox.paypal.com/v1/oauth2/token';

    const tokenUrl = 'https://api-m.sandbox.paypal.com/v1/oauth2/token'
  
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      });
  
      if (!response.ok) {
        const error = await response.json();
        console.error("PayPal Auth Error:", error);
        throw new Error(`PayPal authentication failed: ${error.error_description || error.error}`);
      }
  
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error("Error getting PayPal access token:", error);
      throw error;
    }
  }