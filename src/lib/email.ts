import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined');
}

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.EMAIL_FROM || 'Momenterie <orders@momenterie.com>';

export async function sendOrderConfirmation(
  email: string,
  orderDetails: {
    orderNumber: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    total: number;
    shippingAddress: string;
  }
) {
  try {
    const itemsList = orderDetails.items
      .map(item => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">€${item.price.toFixed(2)}</td>
        </tr>
      `)
      .join('');

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Order Confirmation #${orderDetails.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2c3e50; margin: 0;">Thank You for Your Order!</h1>
            </div>

            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <h2 style="color: #2c3e50; margin-top: 0;">Order #${orderDetails.orderNumber}</h2>
              <p>We've received your order and will send you an update when it ships.</p>
            </div>

            <div style="margin-bottom: 30px;">
              <h3 style="color: #2c3e50;">Order Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f9f9f9;">
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
                    <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                    <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding: 15px 10px; text-align: right; font-weight: bold;">Total:</td>
                    <td style="padding: 15px 10px; text-align: right; font-weight: bold; font-size: 1.2em; color: #2c3e50;">€${orderDetails.total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div style="margin-bottom: 30px;">
              <h3 style="color: #2c3e50;">Shipping Address</h3>
              <p style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 0;">
                ${orderDetails.shippingAddress.replace(/\n/g, '<br>')}
              </p>
            </div>

            <div style="background-color: #e8f4f8; padding: 20px; border-radius: 8px; margin-top: 30px;">
              <p style="margin: 0; text-align: center;">
                <strong>Questions?</strong> Contact us at support@momenterie.com
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 30px; border-top: 1px solid #eee; color: #777; font-size: 12px;">
              <p>© ${new Date().getFullYear()} Momenterie. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending order confirmation:', error);
    throw error;
  }
}

export async function sendShippingNotification(
  email: string,
  details: {
    orderNumber: string;
    trackingNumber: string;
    trackingUrl?: string;
  }
) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Your order #${details.orderNumber} has shipped!`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2c3e50; margin: 0;">Your Order Is On Its Way!</h1>
            </div>

            <div style="background-color: #f0f8ff; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
              <div style="font-size: 48px; margin-bottom: 20px;">📦</div>
              <h2 style="color: #2c3e50; margin: 10px 0;">Order #${details.orderNumber}</h2>
              <p style="font-size: 18px; margin: 20px 0;">Has been shipped!</p>
            </div>

            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <h3 style="color: #2c3e50; margin-top: 0;">Tracking Information</h3>
              <p style="margin: 10px 0;"><strong>Tracking Number:</strong> ${details.trackingNumber}</p>
              ${details.trackingUrl ? `
                <div style="text-align: center; margin-top: 20px;">
                  <a href="${details.trackingUrl}" style="display: inline-block; background-color: #2c3e50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">Track Your Package</a>
                </div>
              ` : ''}
            </div>

            <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
              <p style="margin: 0;"><strong>Note:</strong> Please allow 24 hours for tracking information to update.</p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 30px; border-top: 1px solid #eee; color: #777; font-size: 12px;">
              <p>© ${new Date().getFullYear()} Momenterie. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending shipping notification:', error);
    throw error;
  }
}

export async function sendWelcomeEmail(email: string, name?: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to Momenterie!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2c3e50; margin: 0;">Welcome to Momenterie!</h1>
            </div>

            <div style="background-color: #f9f9f9; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
              <p style="font-size: 18px; margin: 0;">Hi ${name || 'there'}! 👋</p>
              <p>Thank you for joining Momenterie. We're excited to help you create beautiful, personalized memories.</p>
            </div>

            <div style="margin-bottom: 30px;">
              <h3 style="color: #2c3e50;">What You Can Create:</h3>
              <ul style="list-style: none; padding: 0;">
                <li style="padding: 10px 0; border-bottom: 1px solid #eee;">🗺️ Custom City Maps</li>
                <li style="padding: 10px 0; border-bottom: 1px solid #eee;">⭐ Personalized Star Maps</li>
                <li style="padding: 10px 0; border-bottom: 1px solid #eee;">🧩 Photo Puzzles</li>
                <li style="padding: 10px 0; border-bottom: 1px solid #eee;">🎵 Song Display Prints</li>
                <li style="padding: 10px 0;">💎 Custom Jewelry</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}" style="display: inline-block; background-color: #2c3e50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold;">Start Creating</a>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 30px; border-top: 1px solid #eee; color: #777; font-size: 12px;">
              <p>© ${new Date().getFullYear()} Momenterie. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
}
