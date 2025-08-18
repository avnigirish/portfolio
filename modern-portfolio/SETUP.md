# Email and Analytics Setup Guide

## Email Configuration

To enable contact form emails, you need to set up Gmail App Passwords:

### 1. Enable 2-Factor Authentication
- Go to your Google Account settings
- Enable 2-Factor Authentication if not already enabled

### 2. Generate App Password
1. Go to Google Account → Security → 2-Step Verification
2. Scroll down to "App passwords"
3. Select "Mail" and your device
4. Copy the generated 16-character password

### 3. Update Environment Variables
In your `.env.local` file, update:
```
EMAIL_USER=avni123.girish@gmail.com
EMAIL_APP_PASSWORD=your_16_character_app_password_here
```

### 4. Set Admin Password
For the admin dashboard, set a secure password:
```
ADMIN_PASSWORD=your_secure_admin_password_here
```

## Admin Dashboard Features

Access your admin dashboard at `/admin` with features:

- **Visitor Analytics**: Daily/monthly visitor trends
- **Contact Messages**: View all contact form submissions
- **Performance Metrics**: Page load times, bounce rates
- **Geographic Data**: Visitor locations and demographics
- **Real-time Tracking**: Page views, scroll depth, session duration

## Production Deployment

When deploying to production:

1. **Update URLs**: Change `NEXT_PUBLIC_APP_URL` to your domain
2. **Secure Cookies**: Ensure HTTPS for secure admin sessions
3. **Database Integration**: Replace mock data with real analytics storage
4. **Email Templates**: Customize email templates for your brand

## Analytics Features

The analytics system tracks:
- Page views and unique visitors
- Contact form submissions
- Scroll depth and engagement
- Session duration and bounce rates
- Geographic visitor data
- User interactions (Spotify, AI chat, etc.)

## Security Notes

- Admin dashboard requires authentication
- Sensitive data is not exposed to client-side
- Email credentials are stored securely in environment variables
- Analytics data can be anonymized for privacy compliance
