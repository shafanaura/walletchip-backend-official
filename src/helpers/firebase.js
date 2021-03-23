const admin = require('firebase-admin')

const serviceAccount = require('./walletchip-8c9c9-firebase-adminsdk-zme4j-d5a86b2db5.json')

const firebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

exports.sendNotif = (token, title, body, navs) => {
  const notif = firebase.messaging()
  notif.sendToDevice(token, {
    notification: {
      title,
      body
    },
    data: {
      navigation: navs
    }
  })
}
