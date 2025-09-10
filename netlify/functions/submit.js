exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Parse form data
    let data;
    const contentType = event.headers['content-type'] || '';
    
    if (contentType.includes('application/json')) {
      data = JSON.parse(event.body);
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      // Parse URL encoded form data
      const params = new URLSearchParams(event.body);
      data = Object.fromEntries(params);
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Unsupported content type' }),
      };
    }

    // Validate required fields
    const { name, email, phone, adress, postal_code } = data;
    
    if (!name || !email || !phone || !adress || !postal_code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Add timestamp
    const submission = {
      name,
      email,
      phone,
      adress,
      postal_code,
      timestamp: new Date().toISOString()
    };

    // In a real application, you would save this to a database
    // For now, we'll just log it and return success
    console.log('Form submission received:', submission);

    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: 'Form submitted successfully',
        data: submission 
      }),
    };

  } catch (error) {
    console.error('Error processing form submission:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};