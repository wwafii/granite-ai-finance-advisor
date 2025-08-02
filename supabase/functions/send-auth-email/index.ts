import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AuthEmailRequest {
  email: string;
  type: 'signup' | 'reset' | 'confirmation';
  name?: string;
  resetLink?: string;
  confirmationLink?: string;
}

const getEmailTemplate = (type: string, data: any) => {
  const baseStyle = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #1a1a1a; font-size: 32px; font-weight: 700; margin: 0;">Financial Advisor</h1>
        <p style="color: #6b7280; font-size: 16px; margin: 8px 0 0 0;">Smart Financial Management Platform</p>
      </div>
  `;

  const footerStyle = `
      <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb; text-align: center;">
        <p style="color: #9ca3af; font-size: 14px; margin: 0 0 8px 0;">
          This email was sent by Financial Advisor Platform
        </p>
        <p style="color: #9ca3af; font-size: 14px; margin: 0;">
          If you didn't request this email, you can safely ignore it.
        </p>
      </div>
    </div>
  `;

  switch (type) {
    case 'signup':
      return `${baseStyle}
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
          <h2 style="color: white; font-size: 24px; font-weight: 600; margin: 0 0 12px 0;">Welcome to Financial Advisor!</h2>
          <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 0;">Your account has been created successfully.</p>
        </div>
        <div style="padding: 0 20px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Hello ${data.name || 'there'},
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Thank you for joining our Financial Advisor platform! You can now start managing your finances with our powerful tools and AI-powered insights.
          </p>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
            <h3 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 12px 0;">What you can do now:</h3>
            <ul style="color: #4b5563; font-size: 14px; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Upload your financial data via CSV files</li>
              <li style="margin-bottom: 8px;">View detailed expense analytics and charts</li>
              <li style="margin-bottom: 8px;">Get AI-powered financial insights</li>
              <li style="margin-bottom: 8px;">Track your spending patterns</li>
            </ul>
          </div>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            We're excited to help you achieve your financial goals!
          </p>
        </div>
        ${footerStyle}`;

    case 'reset':
      return `${baseStyle}
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
          <h2 style="color: white; font-size: 24px; font-weight: 600; margin: 0 0 12px 0;">Password Reset Request</h2>
          <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 0;">Reset your password securely</p>
        </div>
        <div style="padding: 0 20px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Hello,
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            We received a request to reset your password for your Financial Advisor account. Click the button below to create a new password:
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${data.resetLink}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
              Reset Password
            </a>
          </div>
          <div style="background-color: #fef3cd; border: 1px solid #fbbf24; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
            <p style="color: #92400e; font-size: 14px; margin: 0; font-weight: 500;">
              🔒 This link will expire in 24 hours for security reasons.
            </p>
          </div>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            If you didn't request this password reset, please ignore this email or contact support if you have concerns.
          </p>
        </div>
        ${footerStyle}`;

    case 'confirmation':
      return `${baseStyle}
        <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
          <h2 style="color: white; font-size: 24px; font-weight: 600; margin: 0 0 12px 0;">Confirm Your Email</h2>
          <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 0;">Verify your account to get started</p>
        </div>
        <div style="padding: 0 20px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Hello,
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Please confirm your email address by clicking the button below to complete your registration:
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${data.confirmationLink}" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(79, 172, 254, 0.4);">
              Confirm Email Address
            </a>
          </div>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Once confirmed, you'll have full access to all our financial management features.
          </p>
        </div>
        ${footerStyle}`;

    default:
      return '';
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, type, name, resetLink, confirmationLink }: AuthEmailRequest = await req.json();

    let subject = '';
    let html = '';

    switch (type) {
      case 'signup':
        subject = '🎉 Welcome to Financial Advisor - Your Account is Ready!';
        html = getEmailTemplate('signup', { name });
        break;
      case 'reset':
        subject = '🔒 Reset Your Financial Advisor Password';
        html = getEmailTemplate('reset', { resetLink });
        break;
      case 'confirmation':
        subject = '✉️ Confirm Your Email Address - Financial Advisor';
        html = getEmailTemplate('confirmation', { confirmationLink });
        break;
      default:
        throw new Error('Invalid email type');
    }

    const emailResponse = await resend.emails.send({
      from: "Financial Advisor <noreply@resend.dev>",
      to: [email],
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);