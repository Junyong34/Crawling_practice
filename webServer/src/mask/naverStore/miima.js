const axios = require('axios');
const cheerio = require('cheerio');
const TelegramBot = require('node-telegram-bot-api');
const Cron = require('cron').CronJob;
const { TELEGRAM_TOKEN } = require('../../common/env');

const token = TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// url 정보
const smartstore = 'https://smartstore.naver.com';
const miimaMaskUrl = '/aseado';

// html 긁어오기
const getMask = async () => {
	try {
		return await axios.get(smartstore + miimaMaskUrl);
	} catch (error) {
		// console.error(error.response);
	}
	return null;
};

// 스케줄 등록
const miimaMaskJob = new Cron('*/5 * * * * *', () => {
	getMask().then(html => {
		const $ = cheerio.load(html.data);
		const $bodyList = $('.extend_thumbnail_square ul').eq(0);

		$bodyList.each((i, elem) => {
			let title = '';
			const siteTitle = $('.header_shopping .shop_area .gnb_seller_info .copy')[0].children[0]
				.data;
			let url = '';
			if (i === 0 || i === 1) {
				$(elem)
					.children()
					.each((ix, el) => {
						title = $(el)
							.find('.area_status div')
							.attr('title');
						url = $(el)
							.find('a')
							.attr('href');

						if (title !== '일시품절') {
							bot.sendMessage('-1001316976435', `${siteTitle}\n${smartstore}${url}`);
						}
					});
			}
			return false;
		});
	});
});

module.exports = miimaMaskJob;
