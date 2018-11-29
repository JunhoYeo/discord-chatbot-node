const token = require('./auth.json').token;
var request = require('request');
var cheerio = require('cheerio');
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content === '안녕') {
        msg.reply('나도 안녕');
    }
    else if (msg.content === '급식') {
        const today = new Date()
        var title = `${today.getMonth() + 1}월 ${today.getDate()}일 식단입니다.`
        request({
            url: 'https://www.dimigo.hs.kr/index.php', 
            qs: {
                'mid': 'school_cafeteria',
                'page': 1
            }
        }, function(err, response, html) {
            if(err) { 
                msg.channel.send('연결 중 에러가 발생했습니다.');
                return; 
            }
            var $ = cheerio.load(html, { decodeEntities: false });
            var post = $('tbody[id=dimigo_post_cell_2] > tr > td[class=title] > div > a').filter(function() {
                return $(this).text().trim() === title;
            }).attr('href');
            request(post, function(err, response, html){
                var $ = cheerio.load(html, { decodeEntities: false });
                var result = title + '\n';
                $('ul[class=scFrm]').find('li > div > div > p').each(function (index, element) {
                    if (index%2 == 0) {
                        result += $(element).text();
                        if (index != 4) result += '\n'
                    }
                });
                msg.channel.send(result)
            });
        });
    }
});

client.login(token);
