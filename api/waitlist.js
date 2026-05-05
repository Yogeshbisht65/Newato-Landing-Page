import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ error: 'API Key missing on server' });
    }

    // 1. Add the email to your Resend Audience (Waitlist)
    const payload = {
      email: email,
      unsubscribed: false,
    };

    const audienceId = process.env.RESEND_AUDIENCE_ID;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(audienceId);

    if (audienceId && isUUID) {
      payload.audienceId = audienceId;
    }

    const { data, error } = await resend.contacts.create(payload);

    if (error) {
      console.error('Resend Error:', error);
      return res.status(500).json({ 
        error: 'Resend API Error', 
        details: error.message || error 
      });
    }

    // 2. Optional: Send a welcome email to the user
    /*
    await resend.emails.send({
      from: 'Newato <hello@yourdomain.com>',
      to: email,
      subject: 'You are on the list!',
      html: '<p>Welcome to the Newato private rollout. We will notify you soon.</p>'
    });
    */

    return res.status(200).json({ message: 'Success' });
  } catch (err) {
    console.error('Server Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
