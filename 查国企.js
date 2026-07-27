#!/usr/bin/env node
/**
 * 央国企招聘查询工具 - 独立版
 * 不需要 Reasonix / firecrawl，有 Node.js 就能用
 * 
 * 用法:
 *   node 查国企.js 省份 [关键词]        查询数据库中的国企名单
 *   node 查国企.js 省份 招聘            查询该省国企并输出适合投递的摘要
 *   node 查国企.js 省份 导出            导出该省国企清单为 markdown
 *   node 查国企.js --list               列出所有可用省份
 *   node 查国企.js --help               显示帮助
 */

const db = require("./国企数据库.json");
const args = process.argv.slice(2);

function showHelp() {
  console.log(`
╔══════════════════════════════════════════════╗
║        央国企招聘查询工具 v1.0               ║
╚══════════════════════════════════════════════╝

用法:
  node 查国企.js <省份>                查看该省所有国企
  node 查国企.js <省份> <关键词>       按关键词筛选
  node 查国企.js <省份> 导出           导出为 Markdown 文件
  node 查国企.js <省份> 招聘           显示招聘信息摘要
  node 查国企.js --list                列出可用省份
  node 查国企.js --help                显示本帮助

示例:
  node 查国企.js 四川
  node 查国企.js 四川 电信
  node 查国企.js 广东 投资
  node 查国企.js 江苏 导出

数据来源: 各市国资委官网 / 本地宝 / 应届生求职网
数据文件: 国企数据库.json (可手动更新)
  `);
}

function listProvinces() {
  console.log("可用省份 (" + Object.keys(db).length + " 个):");
  console.log("");
  const cols = 4;
  const provs = Object.keys(db).sort();
  for (let i = 0; i < provs.length; i += cols) {
    console.log("  " + provs.slice(i, i + cols).join("\t"));
  }
}

function exportMarkdown(prov, results) {
  const fs = require("fs");
  let md = "# " + prov + "省国企名录\n\n";
  md += "> 数据来源: 各市国资委官网 / 本地宝 / 应届生求职网\n\n";
  
  let currentLevel = "";
  for (const r of results) {
    const level = r.level || "省级";
    if (level !== currentLevel) {
      md += "\n## " + level + "\n\n";
      currentLevel = level;
    }
    md += "- " + r.name + "\n";
  }
  
  const filename = prov + "_国企名录.md";
  fs.writeFileSync(filename, md, "utf8");
  console.log("已导出: " + filename);
  console.log("共 " + results.length + " 家企业");
}

function showRecruitment(prov, results) {
  // 筛选出有招聘标记的或适合投递的岗位方向
  const recruiting = results.filter(r => 
    (r.level || "").includes("招聘") || 
    (r.level || "").includes("验证")
  );
  
  console.log("");
  console.log("=== " + prov + " 近期有招聘活动的国企 ===");
  console.log("");
  
  if (recruiting.length === 0) {
    console.log('（数据库中无标记为"正在招聘"的企业）');
    console.log("提示: 完整的国企清单如下，可逐一搜索招聘信息");
    console.log("");
    for (const r of results) {
      console.log("  " + r.name);
    }
  } else {
    let currentLevel = "";
    for (const r of recruiting) {
      const level = r.level || "";
      if (level !== currentLevel) {
        console.log("--- " + level + " ---");
        currentLevel = level;
      }
      console.log("  " + r.name);
    }
  }
  
  console.log("");
  console.log("提示: 用 /workfind [企业名] 可查具体招聘信息");
  console.log("或浏览器搜索: [企业名] + 校园招聘");
}

// === 主逻辑 ===
if (args.length === 0 || args[0] === "--help") {
  showHelp();
  process.exit(0);
}

if (args[0] === "--list") {
  listProvinces();
  process.exit(0);
}

const prov = args[0];
const keyword = args[1] || "";
const data = db[prov];

if (!data) {
  console.log("未找到省份: " + prov);
  console.log("用 node 查国企.js --list 查看可用省份");
  process.exit(1);
}

let results = data;
if (keyword && keyword !== "导出" && keyword !== "招聘") {
  results = data.filter(d => d.name.includes(keyword));
}

if (keyword === "导出") {
  exportMarkdown(prov, results);
} else if (keyword === "招聘") {
  showRecruitment(prov, results);
} else {
  console.log("");
  console.log(prov + " 共 " + results.length + " 家" + (keyword ? " (筛选: " + keyword + ")" : ""));
  console.log("");
  let currentLevel = "";
  for (const r of results) {
    const level = r.level || "省级";
    if (level !== currentLevel) {
      console.log("--- " + level + " ---");
      currentLevel = level;
    }
    console.log("  " + r.name);
  }
  console.log("");
  console.log("提示: 加 导出 生成Markdown文件，加 招聘 查看招聘摘要");
}
