import emailjs from '@emailjs/browser';

// EmailJS Configuration
// IMPORTANT: Get these from https://www.emailjs.com/
// These are safe for frontend use (public keys only)
export const emailConfig = {
  serviceId: 'YOUR_SERVICE_ID', // Replace with your EmailJS Service ID
  templateId: 'YOUR_TEMPLATE_ID', // Replace with your EmailJS Template ID
  publicKey: 'YOUR_PUBLIC_KEY', // Replace with your EmailJS Public Key
  adminEmail: 'zeetechdistributions@gmail.com',
  isConfigured: false, // Will be set to true when you add credentials
};

// Initialize EmailJS
export function initEmailJS() {
  if (emailConfig.isConfigured && emailConfig.publicKey !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(emailConfig.publicKey);
    return true;
  }
  return false;
}

// Send order notification to admin
export async function sendOrderNotificationToAdmin(orderData: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  shippingAddress: string;
}) {
  if (!emailConfig.isConfigured) {
    console.warn('EmailJS not configured. Skipping email notification.');
    return { success: false, error: 'Email not configured' };
  }

  try {
    const templateParams = {
      to_email: emailConfig.adminEmail,
      order_id: orderData.orderId,
      customer_name: orderData.customerName,
      customer_email: orderData.customerEmail,
      customer_phone: orderData.customerPhone,
      items_list: orderData.items
        .map(item => `${item.name} x${item.quantity} - ₦${item.price.toLocaleString()}`)
        .join('\n'),
      total_amount: `₦${orderData.total.toLocaleString()}`,
      shipping_address: orderData.shippingAddress,
      order_date: new Date().toLocaleString(),
    };

    const response = await emailjs.send(
      emailConfig.serviceId,
      emailConfig.templateId,
      templateParams
    );

    return { success: true, response };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

// Send order confirmation to customer
export async function sendOrderConfirmationToCustomer(orderData: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
}) {
  if (!emailConfig.isConfigured) {
    console.warn('EmailJS not configured. Skipping email notification.');
    return { success: false, error: 'Email not configured' };
  }

  try {
    const templateParams = {
      to_email: orderData.customerEmail,
      to_name: orderData.customerName,
      order_id: orderData.orderId,
      items_list: orderData.items
        .map(item => `${item.name} x${item.quantity} - ₦${item.price.toLocaleString()}`)
        .join('\n'),
      total_amount: `₦${orderData.total.toLocaleString()}`,
      order_date: new Date().toLocaleString(),
    };

    const response = await emailjs.send(
      emailConfig.serviceId,
      'customer_confirmation_template', // You'll need a separate template for customers
      templateParams
    );

    return { success: true, response };
  } catch (error) {
    console.error('Failed to send customer confirmation:', error);
    return { success: false, error };
  }
}

// Check if email service is configured
export function isEmailConfigured(): boolean {
  return (
    emailConfig.serviceId !== 'YOUR_SERVICE_ID' &&
    emailConfig.templateId !== 'YOUR_TEMPLATE_ID' &&
    emailConfig.publicKey !== 'YOUR_PUBLIC_KEY'
  );
}
