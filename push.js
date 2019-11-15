var webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BAGew-KfjcFRNiHGKB8jJ9YZbOdk1Pu-MnlFdWI4T5t7edbkBG4WjTzRLnzYzLvL2jEUGCN-62qMM7Hhg9APB8Q",
   "privateKey": "22zdqNns25p3i1dzoWjgp5dUxRAmiJ4jxPnhO2rKPEE"
};
 
 
webPush.setVapidDetails(
   'mailto:premiereleague@premiereleague.com',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
//NOTE: ini adalah endpoint yg digunakan terakhir kali
//silahkan copy ulang kembali pada console browser
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/ehtKfzKrifM:APA91bGcIwQ-sVu5v9Gu87uytsnu11KVAAuovnachoSB4eUgCDvE6b--j7-Ch954CsC6Cj5QJkIBa9T9WYDZVQpC7gZuibDRb43TczrvgCmWZjkWAz8S54o7u7tJO7m-jmRYLr_ZaZ_I",
   "keys": {
       "p256dh": "BGgtrDjTLNUKssDE9vFCeSVqkTh6KPWmUBt4JMAtOxVYVU9qTOI6AjKsPkYgGSCVUN6/mE99ri7Z+TpCQcdRk2w=",
       "auth": "QgN+kpfE0FJYkxaVm+9tMw=="
   }
};
var payload = 'Ini push notif dari push.js';
 
var options = {
   gcmAPIKey: '554736624547',
   TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
).then(response => {
  console.log(response);
}).catch(err => {
  console.log(err);
});