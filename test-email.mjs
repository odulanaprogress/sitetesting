async function testEmail() {
  const emailPayload = {
    service_id: 'service_7y4ymlh',
    template_id: 'template_2xg7eh8',
    user_id: 'z9pTgHJIVpKUvjJoe',
    template_params: {
      order_id: 'TEST-12345',
      customer_name: 'Test Customer',
      customer_email: 'test@example.com',
      customer_phone: '1234567890',
      shipping_address: '123 Test St, Test City',
      items_list: '1x Test Product',
      total_amount: '₦50,000',
      email: 'wheeljack2019@gmail.com'
    }
  };

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload)
    });

    const text = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', text);
  } catch (err) {
    console.error('Error:', err);
  }
}

testEmail();
