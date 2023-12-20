import { Plugins } from '../../lib/handler.js'
const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

Plugins.create({
  name: 'sider',
  async run({ conn, m, text, db, isAdmins, isBotAdmins, groupMetadata, mess}) {
    if(!m.isGroup) return m.reply(mess.group)
    if(!isAdmins) return m.reply(mess.admin)
    if(!isBotAdmins) return m.reply(mess.botAdmin)
    await conn.sendPresenceUpdate('composing', m.chat) 
    var lama = 86400000 * 7
    const now = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Jakarta"
    });
    const milliseconds = new Date(now).getTime();
    let member = groupMetadata.participants.map(v => v.id)
    if (!text) {
    var pesan = "Harap aktif di grup karena akan ada pembersihan anggota setiap saat"
    } else {
    var pesan = text
    }
    var sum
    sum = member.length
    var total = 0
    var sider = []
    for (let i = 0; i < sum; i++) {
    let users = m.isGroup ? groupMetadata.participants.find(u => u.id == member[i]) : {}
    if ((typeof db.data.users[member[i]] == 'undefined' || milliseconds * 1 - db.data.users[member[i]].lastseen > lama) && !users.isAdmin && !users.isSuperAdmin) {
    if (typeof db.data.users[member[i]] !== 'undefined') {
    if (db.data.users[member[i]].banned == true) {
    total++
    sider.push(member[i])
    }
    } else { 
    total++
    sider.push(member[i])
    }
    }
    }
    if (total == 0) return conn.reply(m.chat, `*Tidak ada siders di grup ini.*`, m)
    conn.sendTextWithMentions(m.chat, `*${total}/${sum}* anggota grup *${groupMetadata.subject}* adalah sider dengan alasan :\n1. Tidak aktif selama lebih dari 7 hari\n2. Baru join tetapi tidak pernah nimbrung\n\n_“${pesan}”_\n\n*LIST SIDER :*\n${sider.map(v => '  • @' + v.replace(/@.+/, '' + typeof db.data.users[v] == "undefined" ? ' Sider ' : ' Off ' + msToDate(milliseconds * 1 - db.data.users[v].lastseen))).join('\n')}`, m) 
  }
})

function msToDate(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  if (d == 0 && h == 0 && m == 0) {
    return "Baru Saja"
  } else {
    return [d, 'H ', h, 'J '].map(v => v.toString().padStart(2, 0)).join('')
  }
}