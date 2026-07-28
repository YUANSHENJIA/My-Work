// scripts/fetch-news.js
// 从 量子位 (qbitai.com) RSS 抓取最新 AI 资讯，写入 assets/news.json
// 由 GitHub Actions 每天北京时间 9:00 (UTC 1:00) 定时触发，也可手动触发。

const https = require('https');
const fs = require('fs');
const path = require('path');

const FEED_URL = process.env.NEWS_FEED_URL || 'https://www.qbitai.com/feed';
const OUTPUT_PATH = path.join(__dirname, '..', 'assets', 'news.json');
const MAX_ITEMS = Number(process.env.NEWS_MAX_ITEMS || 12);
const USER_AGENT = 'Mozilla/5.0 (compatible; MyWorkNewsBot/1.0; +https://github.com/YUANSHENJIA/My-Work)';
const TIMEOUT_MS = 20000;

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9',
      },
      timeout: TIMEOUT_MS,
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return fetchText(res.headers.location).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      let data = '';
      res.setEncoding('utf8');
      res.on('data', c => { data += c; });
      res.on('end', () => resolve(data));
    });
    req.on('timeout', () => req.destroy(new Error(`Timeout after ${TIMEOUT_MS}ms`)));
    req.on('error', reject);
  });
}

function decodeEntities(s) {
  return String(s)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, '&')
    .trim();
}

function extractTag(xml, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
  const m = xml.match(re);
  return m ? decodeEntities(m[1]) : '';
}

function extractCategories(xml) {
  const re = /<category[^>]*>([\s\S]*?)<\/category>/gi;
  const cats = [];
  let m;
  while ((m = re.exec(xml)) !== null) {
    const v = decodeEntities(m[1]);
    if (v) cats.push(v);
  }
  return cats;
}

function parseItems(xml) {
  const items = [];
  const re = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = re.exec(xml)) !== null) items.push(m[1]);
  return items;
}

function parsePubDate(s) {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

function relativeTimeCN(iso, nowMs) {
  if (!iso) return '';
  const d = new Date(iso);
  const diff = (nowMs || Date.now()) - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '刚刚';
  if (mins < 60) return `${mins} 分钟前`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} 小时前`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} 天前`;
  return d.toLocaleDateString('zh-CN');
}

function categorize(title, cats) {
  const text = (title + ' ' + cats.join(' '));
  if (/(论文|研究|科学|菲尔兹|数学|发现|arxiv|benchmark|数据集|模型)/.test(text)) return '研究';
  if (/(融资|收购|上市|离职|合作|发布|推出|联手|携手|官宣|估值|独角兽|加盟|战略)/.test(text)) return '商业';
  if (/(产品|上线|功能|工具|芯片|手机|终端|应用|app|小程序|开源|版本|更新)/.test(text)) return '产品';
  return '技术';
}

const GRADIENTS = [
  'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
  'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
  'linear-gradient(135deg, #2a2a2a 0%, #404040 100%)',
  'linear-gradient(135deg, #1f1f1f 0%, #2f2f2f 100%)',
  'linear-gradient(135deg, #141414 0%, #2a2a2a 100%)',
  'linear-gradient(135deg, #232323 0%, #383838 100%)',
  'linear-gradient(135deg, #0f1a2a 0%, #1f2c40 100%)',
  'linear-gradient(135deg, #1a1208 0%, #2d2010 100%)',
];

const ICONS = {
  '技术': ['memory', 'code', 'data_object', 'developer_board', 'terminal'],
  '商业': ['trending_up', 'business_center', 'handshake', 'analytics', 'monetization_on'],
  '研究': ['science', 'biotech', 'psychology', 'functions', 'experiment'],
  '产品': ['token', 'devices', 'widgets', 'rocket_launch', 'deployed_code'],
};

const TAGS = ['BREAKING', 'AI NEWS', 'RESEARCH', 'PRODUCT', 'INSIGHT', 'ANALYSIS', 'FRONTIER'];

function pickGradient(i) { return GRADIENTS[i % GRADIENTS.length]; }
function pickIcon(i, category) {
  const arr = ICONS[category] || ICONS['技术'];
  return arr[i % arr.length];
}
function pickTag(i) { return TAGS[i % TAGS.length]; }

(async () => {
  try {
    const now = new Date();
    const xml = await fetchText(FEED_URL);
    const rawItems = parseItems(xml);
    const items = [];
    for (let i = 0; i < Math.min(rawItems.length, MAX_ITEMS); i++) {
      const it = rawItems[i];
      const title = extractTag(it, 'title');
      const link = extractTag(it, 'link');
      const pubDate = extractTag(it, 'pubDate');
      const pubDateISO = parsePubDate(pubDate);
      const description = extractTag(it, 'description');
      const categories = extractCategories(it);
      if (!title || !link) continue;
      const category = categorize(title, categories);
      const cleanTitle = title.length > 80 ? title.slice(0, 80) + '…' : title;
      items.push({
        title: cleanTitle,
        full_title: title,
        link,
        pubDate,
        pubDateISO,
        time: relativeTimeCN(pubDateISO, now.getTime()),
        categories,
        category,
        tag: pickTag(i),
        excerpt: description || (title.length > 50 ? title.slice(0, 90) + '…' : title),
        source: '量子位',
        source_short: 'QbitAI',
        gradient: pickGradient(i),
        icon: pickIcon(i, category),
      });
    }
    if (items.length === 0) {
      throw new Error('Parsed 0 items from feed');
    }
    const out = {
      updated_at: now.toISOString(),
      updated_at_local: now.toLocaleString('zh-CN', { hour12: false, timeZone: 'Asia/Shanghai' }),
      source_label: '量子位 · AI 前沿',
      source_url: FEED_URL,
      item_count: items.length,
      items,
    };
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(out, null, 2), 'utf8');
    console.log(`[fetch-news] OK: ${items.length} items written to ${OUTPUT_PATH}`);
    console.log(`[fetch-news] updated_at: ${out.updated_at}`);
  } catch (e) {
    console.error(`[fetch-news] FAIL: ${e.message}`);
    process.exit(1);
  }
})();