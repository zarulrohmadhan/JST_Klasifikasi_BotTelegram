var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js');
const cls_model = require('./sdk/cls_model.js');

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '1898372323:AAETDN-GZP7S8gFXM_nNCaZRQOhuvwl-CTw'
const bot = new TelegramBot(token, {polling: true});

state = 0;
// bots
bot.onText(/\/start/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `hello, welcome...\n
        click /predict`
    );  
    state = 0;
});

// input i and r
state = 0;
bot.onText(/\/predict/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `masukan nilai i|r contoh 9|9`
    );   
    state = 1;
});

bot.on('message', (msg) => { 
    if(state == 1){
        s = msg.text.split("|");
        i = parseFloat(s[0])
        r = parseFloat(s[1])
        model.predict(
            [
                i,
                r,
            ]
         ).then((jres1)=>{
            v = parseFloat(jres[0])
            p = parseFloat(jres[1])
            
            cls_model.classify([i, r, v, p]).then(jres2)=>{
                bot.sendMessage(
                        msg.chat.id,
                       `nilai v yang diprediksi adalah ${v} volt`
            );
                bot.sendMessage(
                       msg.chat.id,
                       `nilai p yang diprediksi adalah ${p} watt`
            );
                bot.sendMessage(
                       msg.chat.id,
                       `Klasifikasi Tegangan ${jres2}` 
            })
          })
        })
     }else{
         state = 0
     }
})
    
// routers
r.get('/prediction/:i/:r', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.i), // string to float
            parseFloat(req.params.r)
        ]
    ).then((jres)=>{
        res.json(jres);
    })
});

// routers
r.get('/classify/:i/:r', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.i), // string to float
            parseFloat(req.params.r)
        ]
    ).then((jres)=>{
        cls_model.classify(
            [
                parseFloat(req.params.i),
                parseFloat(req.params.r),
                parseFloat(jres[0]),
                parseFloat(jres[1])
            ]             
        ).then((jres_)=>{
                res.json(jres_);
    })
  })
});

module.exports = r;
