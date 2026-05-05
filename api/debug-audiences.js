import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ error: 'RESEND_API_KEY is missing in Vercel settings' });
    }

    const { data, error } = await resend.audiences.list();

    if (error) {
      return res.status(500).json({ error: 'Resend API Error', details: error });
    }

    return res.status(200).json({ 
      message: 'Found your Audience IDs!',
      audiences: data 
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server Error', message: err.message });
  }
}
