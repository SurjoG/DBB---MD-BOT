const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys')
const P = require('pino')

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth')
    const sock = makeWASocket({
        logger: P({ level: 'silent' }),
        auth: state,
        printQRInTerminal: false,
        browser: ['DBB-MD', 'Chrome', '1.0.0']
    })

    if (!sock.authState.creds.registered) {
        const phoneNumber = '916294016458' // এখানে তোমার WhatsApp নাম্বার দাও 91 দিয়ে, যেমন 919876543210
        setTimeout(async () => {
            let code = await sock.requestPairingCode(phoneNumber)
            console.log('YOUR PAIRING CODE IS: ' + code)
        }, 3000)
    }

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            let shouldReconnect = lastDisconnect?.error?.output?.statusCode!== DisconnectReason.loggedOut
            if (shouldReconnect) startBot()
        } else if (connection === 'open') {
            console.log('BOT CONNECTED SUCCESSFULLY - DBB-MD-BOT IS ONLINE')
        }
    })

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0]
        if (!msg.message) return
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text
        if (text === '.ping') {
            await sock.sendMessage(msg.key.remoteJid, { text: 'Pong! DBB-MD-BOT is Alive 🔥' })
        }
    })
}
startBot()
