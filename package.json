const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const P = require('pino');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth');
    const sock = makeWASocket({
        logger: P({ level: 'silent' }),
        auth: state,
        printQRInTerminal: true,
        browser: ['DARK-BABU-MD','Chrome','1.0']
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection } = update;
        if(connection === 'open') {
            console.log('DARK-BABU-MD Connected 24/7');
        }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0];
        if(!m.message) return;
        const text = m.message.conversation || '';
        const from = m.key.remoteJid;

        if(text === '.ping'){
            await sock.sendMessage(from, { text: 'Pong! Bot 24/7 Active 🔥' });
        }
    });
}
startBot();
