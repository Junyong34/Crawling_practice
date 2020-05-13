const express = require('express');

const router = express.Router();

const axios = require('axios');
const cheerio = require('cheerio');
const telegramBot = require('node-telegram-bot-api');
const cron = require('cron').CronJob;

const token = '1114449510:AAGRAB8dt6tt_Rhur5cCsQEtJI9Ippb4xcI';
const bot = new telegramBot(token, { polling: true });
let beforeDD; let
beforeSB;
const arrayDD = []; const arraySB = [];
    const filterTitleArr = [];

const getDD = async () => {
    try {
        return await axios.get('https://search.naver.com/search.naver?&where=news&query=%5B%EB%8B%A8%EB%8F%85%5D&sort=1&sm=tab_smr&nso=so:dd,p:all,a:all');
    } catch (error) {
        console.error(error);
    }
};

const getSB = async () => {
    try {
        return await axios.get('https://search.naver.com/search.naver?where=news&query=%5B%EC%86%8D%EB%B3%B4%5D&sm=tab_srt&sort=1&photo=0&field=0&reporter_article=&pd=0&ds=&de=&docid=&nso=so%3Add%2Cp%3Aall%2Ca%3Aall&mynews=0&refresh_start=0&related=0');
    } catch (error) {
        console.error(error);
    }
};


const job = new cron('*/3 * * * * *', (() => {
    getDD().then((html) => {
        const $ = cheerio.load(html.data);
            const $bodyList = $('.news .type01').children();
            let title; let ix; let
ixLen;

        $bodyList.each(function (i, elem) {
            title = $(this).find('dl dt').text();
            if (title.indexOf('[단독]') === 0) {
                for (ix = 0, ixLen = arrayDD.length; ix < ixLen; ix++) {
                    if (title == arrayDD[ix]) {
                        return false;
                    }
                }

                if (beforeDD) {
                    if (beforeDD !== title) {
                        bot.sendMessage('-1001316976435', `${title}\n${$(this).find('dl dt a').attr('href')}`);
                    }
                } else {
                    bot.sendMessage('-1001316976435', `${title}\n${$(this).find('dl dt a').attr('href')}`);
                }

                beforeDD = title;
                if (arrayDD.length > 5) {
                    arrayDD.shift();
                }
                arrayDD.push(title);
                return false;
            }
        });
    });
}));

const job2 = new cron('*/3 * * * * *', (() => {
    console.log('조회   : ', new Date());
    getSB().then((html) => {
        const $ = cheerio.load(html.data);
            const $bodyList = $('.news .type01').children();
            let ix; let ixLen; let jx; let jxLen; let title; let titleArr; let
titleFilterCnt = 0;

        $bodyList.each(function (i, elem) {
            title = $(this).find('dl dt').text();
            if (title.indexOf('[속보]') === 0) {
                titleArr = title.replace('[속보]', '').split(' ');

                for (ix = 0, ixLen = filterTitleArr.length; ix < ixLen; ix++) {
                    for (jx = 0, jxLen = titleArr.length; jx < jxLen; jx++) {
                        if (filterTitleArr[ix].indexOf(titleArr[jx]) > 0) {
                            titleFilterCnt++;
                        }
                    }

                    if (titleFilterCnt > 2) {
                        return false;
                    }
                }

                for (ix = 0, ixLen = arraySB.length; ix < ixLen; ix++) {
                    if (title == arraySB[ix]) {
                        return false;
                    }
                }

                // 없으면 -> 초기엔 보낸다
                if (beforeSB) {
                    if (beforeSB !== title) {
                        // console.log(title);
                        bot.sendMessage('-1001316976435', `${title}\n${$(this).find('dl dt a').attr('href')}`);
                    }
                } else {
                    // console.log(title);
                    bot.sendMessage('-1001316976435', `${title}\n${$(this).find('dl dt a').attr('href')}`);
                }

                beforeSB = title;
                if (arraySB.length > 5) {
                    arraySB.shift();
                }
                if (filterTitleArr.length > 5) {
                    filterTitleArr.shift();
                }

                arraySB.push(title);
                filterTitleArr.push(titleArr);
                return false;
            }
        });
    });
}));
const smartstore = 'https://smartstore.naver.com';
const miimaMaskUrl = '/aseado';
const getMask = async () => {
    try {
        return await axios.get(smartstore + miimaMaskUrl);
    } catch (error) {
        // console.error(error.response);
    }
};
// job.start();
// job2.start();
const miimaMaskJob = new cron('*/5 * * * * *', (() => {
    getMask().then((html) => {
        const $ = cheerio.load(html.data);
            const $bodyList = $('.extend_thumbnail_square ul').eq(0);
            let ix; let ixLen; let jx; let jxLen; let title; let titleArr; const
titleFilterCnt = 0;

        $bodyList.each((i, elem) => {
            let title = '';
            const siteTitle = $('.header_shopping .shop_area .gnb_seller_info .copy')[0].children[0].data;
            let url = '';
            if (i === 0 || i === 1) {
                $(elem).children().each((ix, el) => {
                    title = $(el).find('.area_status div').attr('title');
                    url = $(el).find('a').attr('href');

                    if (title === '일시품절') {
                        bot.sendMessage('-1001316976435', `${siteTitle}\n${smartstore}${url}`);
                    }
                });
            }
            return false;
        });
    });
}));

console.log('시작');
miimaMaskJob.start();
/* GET users listing. */
router.get('/', (req, res, next) => {


});

module.exports = router;
