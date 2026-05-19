const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let clientReady = false;

// Initialize WhatsApp Client with LocalAuth
const client = new Client({
    authStrategy: new LocalAuth({ dataPath: './whatsapp-session' }),
    puppeteer: { 
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    }
});

// Generate QR code for terminal authentication
client.on('qr', async (qr) => {
    console.log('\n==================================================');
    console.log('📱 ACTION REQUIRED: Scan this QR code in WhatsApp');
    console.log('==================================================');
    qrcode.generate(qr, { small: true });

    const adminPhone = process.env.ADMIN_PHONE;
    if (adminPhone) {
        try {
            console.log(`\n🔑 Requesting pairing code for Admin Phone: ${adminPhone}...`);
            // Format to 91XXXXXXXXXX
            const formattedPhone = `91${adminPhone.replace(/\D/g, "")}`;
            const code = await client.requestPairingCode(formattedPhone);
            console.log('\n==================================================');
            console.log(`⭐ WHATSAPP PAIRING CODE: ${code}`);
            console.log('==================================================');
            console.log('Instructions: Open WhatsApp -> Linked Devices -> Link with phone number instead -> Enter the code above!\n');
        } catch (err) {
            console.error('Failed to generate pairing code:', err.message);
        }
    }
});

client.on('ready', () => {
    console.log('\n✅ WhatsApp Web Client is READY!');
    clientReady = true;
});

client.on('disconnected', (reason) => {
    console.log('❌ WhatsApp Web Client was disconnected:', reason);
    clientReady = false;
});

// Initialize client immediately when the module is required
client.initialize();

// Normalize any phone to digits-only Indian number (10 digits)
const sanitizePhone = (phone) => {
    if (!phone) return null;
    const digits = String(phone).replace(/\D/g, ""); // strip non-digits
    if (digits.startsWith("91") && digits.length === 12) {
        return digits.slice(2); // remove country code -> 10 digits
    }
    if (digits.length === 10) return digits;
    console.warn(`Unusual phone number format: ${phone} -> ${digits}`);
    return digits;
};

// Export the generic alert function
exports.sendWhatsAppAlert = async (to, message) => {
    if (!clientReady) {
        console.error("WhatsApp client is not ready yet. Cannot send message to:", to);
        return;
    }

    try {
        const cleanNumber = sanitizePhone(to);
        if (!cleanNumber) {
            console.error("Invalid phone number provided:", to);
            return;
        }

        // whatsapp-web.js requires the ID format: countrycode + number + @c.us
        const chatId = `91${cleanNumber}@c.us`;

        const response = await client.sendMessage(chatId, message);
        console.log(`WhatsApp sent directly from local device to +91${cleanNumber}. Msg ID: ${response.id.id}`);
        return response;
    } catch (error) {
        console.error(`WhatsApp local FAILED to ${to}:`, error.message);
        throw error;
    }
};
