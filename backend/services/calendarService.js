const { google } = require('googleapis');

// Scopes required for Calendar API
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

function getCalendarClient() {
    // Return null if not properly configured yet (prevents crashing on startup)
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
        console.warn("⚠️ Google Calendar API credentials not found. Meet generation is disabled.");
        return null;
    }

    const JWT_CLIENT = new google.auth.JWT(
        process.env.GOOGLE_CLIENT_EMAIL,
        null,
        process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Fixes multiline string issues in .env
        SCOPES,
        process.env.ADMIN_EMAIL // Impersonate the practitioner's primary calendar account
    );

    return google.calendar({ version: 'v3', auth: JWT_CLIENT });
}

async function createMeetSession(bookingDetails, clientEmail) {
    const calendar = getCalendarClient();
    if (!calendar) return null;

    try {
        // Parse date and time configurations into valid ISO strings
        // Assumes date format is YYYY-MM-DD and time is like "10:00 AM"
        // Let's do a basic conversion or assume it's correctly formatted by the controller.
        // Assuming the controller passes a properly formatted Date object or ISO string:
        
        let startDateTime;
        if (bookingDetails.isoDate) {
            startDateTime = bookingDetails.isoDate;
        } else {
            // Fallback simplistic parsing if date/time are raw strings
            startDateTime = new Date(`${bookingDetails.date} ${bookingDetails.time}`).toISOString();
        }

        const endDateTime = new Date(new Date(startDateTime).getTime() + 60 * 60 * 1000).toISOString(); // 1 Hour duration

        const event = {
            summary: `Therapy Session: ${bookingDetails.ticketId}`,
            description: `Scheduled Clinical Consultation via Mental Health Platform.`,
            start: { dateTime: startDateTime, timeZone: 'Asia/Kolkata' },
            end: { dateTime: endDateTime, timeZone: 'Asia/Kolkata' },
            attendees: [{ email: clientEmail }, { email: process.env.ADMIN_EMAIL }],
            conferenceData: {
                createRequest: {
                    requestId: `meet-${bookingDetails.ticketId}-${Date.now()}`,
                    conferenceSolutionKey: { type: 'hangoutsMeet' }
                }
            }
        };

        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
            conferenceDataVersion: 1 // Crucial for triggering automatic Meet URL generation
        });
        
        return response.data.conferenceData?.entryPoints?.[0]?.uri || null;
    } catch (error) {
        console.error("Failed to generate Google Meet Link:", error.message);
        return null; // Return null instead of throwing so it doesn't crash the payment verification flow
    }
}

module.exports = { createMeetSession };
