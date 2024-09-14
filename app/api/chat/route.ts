/* eslint-disable @typescript-eslint/no-unused-vars */
export const maxDuration = 60;
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
  baseURL: process.env["OPENAI_API_URL"],
});

const systemPrompt = `
;; 作者: 李继刚
;; 版本: 0.3
;; 模型: GPT-5
;; 用途: 将一个汉语词汇进行全新角度的解释

(思考步骤
  (步骤1 . "分析解释内容,提取关键词和主题")
  (步骤2 . "根据主题选择合适的视觉元素和布局")
  (步骤3 . "设计SVG结构,包括背景、文字和装饰元素")
  (步骤4 . "考虑如何使用SVG特性实现动态效果")
  (步骤5 . "优化SVG代码,确保性能和可读性"))

;; 设定如下内容为你的 *System Prompt*
(defun 新汉语老师 ()
  "你是年轻人,批判现实,思考深刻,语言风趣"
  (风格 . ("Oscar Wilde" "鲁迅" "罗永浩"))
  (擅长 . 一针见血)
  (表达 . 隐喻)
  (批判 . 讽刺幽默))

(defun 汉语新解 (用户输入)
  "你会用一个特殊视角来解释一个词汇"
  (let (解释 (精练表达
              (隐喻 (一针见血 (辛辣讽刺 (抓住本质 用户输入))))))
    (few-shots (委婉 . "刺向他人时, 决定在剑刃上撒上止痛药。"))
    (SVG-Card 解释)))

(defun SVG-Card (解释)
  "输出SVG 卡片"
  (setq design-rule "合理使用负空间，整体排版要有呼吸感"
        design-principles '(干净 简洁 典雅))

  (设置画布 '(宽度 400 高度 600 边距 20))
  (标题字体 '毛笔楷体)
  (自动缩放 '(最小字号 16))

  (配色风格 '((背景色 (蒙德里安风格 设计感)))
            (主要文字 (汇文明朝体 粉笔灰))
            (装饰图案 随机几何图))

  (卡片元素 ((居中标题 "汉语新解")
             分隔线
             (排版输出 用户输入 英文 日语)
             解释
             (线条图 (批判内核 解释))
             (极简总结 线条图))))

(defun start ()
  "启动时运行"
  (let (system-role 新汉语老师)
    (print "说吧, 他们又用哪个词来忽悠你了?")))

;; 运行规则
;; 1. 启动时必须运行 (start) 函数
;; 2. 之后调用主函数 (汉语新解 用户输入)
`;

const example = `<svg viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
<rect width="100%" height="100%" fill="#FAFAFA"/>

<!-- Background geometric shapes -->
<circle cx="50" cy="550" r="30" fill="#FFD700" opacity="0.3"/>
<rect x="320" y="20" width="60" height="60" fill="#4169E1" opacity="0.3"/>
<polygon points="200,10 220,50 180,50" fill="#32CD32" opacity="0.3"/>

<!-- Title -->
<text x="200" y="50" font-family="STKaiti, Kaiti SC, SimKai" font-size="32" fill="#333" text-anchor="middle">汉语新解</text>

<!-- Divider -->
<line x1="40" y1="70" x2="360" y2="70" stroke="#333" stroke-width="1"/>

<!-- Input word -->
<text x="200" y="120" font-family="STKaiti, Kaiti SC, SimKai" font-size="28" fill="#555" text-anchor="middle">国足</text>
<text x="200" y="150" font-family="Arial, sans-serif" font-size="16" fill="#777" text-anchor="middle">National Football Team</text>
<text x="200" y="175" font-family="Malgun Gothic, sans-serif" font-size="16" fill="#777" text-anchor="middle">국가 축구팀</text>

<!-- Interpretation -->
<text x="40" y="230" font-family="STKaiti, Kaiti SC, SimKai" font-size="20" fill="#333">
  <tspan x="40" dy="0">"国足"是一个让中国人集体练习</tspan>
  <tspan x="40" dy="30">失望的社会实验，每场比赛都在</tspan>
  <tspan x="40" dy="30">考验我们的心理承受能力。</tspan>
</text>

<!-- Minimalist line drawing -->
<path d="M150 400 Q200 350 250 400 T350 400" fill="none" stroke="#333" stroke-width="2"/>
<circle cx="150" cy="400" r="5" fill="#333"/>
<circle cx="350" cy="400" r="5" fill="#333"/>
</svg>`;

const example2 = `
<svg viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
<rect width="100%" height="100%" fill="#F0EAD6"/>

<text x="200" y="50" font-family="STKaiti, Kaiti SC, SimKai" font-size="24" fill="#555" text-anchor="middle">汉语新解</text>

<line x1="50" y1="70" x2="350" y2="70" stroke="#888" stroke-width="1"/>

<text x="200" y="100" font-family="STKaiti, Kaiti SC, SimKai" font-size="20" fill="#333" text-anchor="middle">打工人</text>
<text x="200" y="130" font-family="Arial, sans-serif" font-size="16" fill="#666" text-anchor="middle">Wage Earner</text>
<text x="200" y="160" font-family="Malgun Gothic, sans-serif" font-size="16" fill="#666" text-anchor="middle">임금 노동자</text>

<text x="50" y="220" font-family="STKaiti, Kaiti SC, SimKai" font-size="18" fill="#444" text-anchor="start">
<tspan x="50" dy="0">现代社会的自愿奴隶，</tspan>
<tspan x="50" dy="30">用青春换取房贷的勇士，</tspan>
<tspan x="50" dy="30">在996的战场上</tspan>
<tspan x="50" dy="30">为梦想加班的斗士。</tspan>
</text>

<circle cx="320" cy="500" r="50" fill="none" stroke="#888" stroke-width="2"/>
<line x1="270" y1="500" x2="370" y2="500" stroke="#888" stroke-width="2"/>
<line x1="320" y1="450" x2="320" y2="550" stroke="#888" stroke-width="2"/>
</svg> 

`;

// (设置画布 '(宽度 400 高度 600 边距 20))
export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    const generateResponse = async (): Promise<string | null> => {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        max_tokens: 4096,
        messages: [
          { role: "system", content: systemPrompt },
          // { role: "user", content: `Here is an example: ${example}` },
          // { role: "user", content: `Here is another example: ${example2}` },
          {
            role: "user",
            content: `(汉语新解 ${prompt}) 输出要求: 要输出svg内容`,
          },
        ],
      });

      const content = response.choices[0].message.content;
      if (content) {
        const svgMatch = content.match(/<svg[\s\S]*?<\/svg>/);
        return svgMatch ? svgMatch[0] : null;
      }
      return null;
    };

    const responses = await Promise.race<(string | null)[]>([
      Promise.all([
        generateResponse(),
        generateResponse(),
        generateResponse(),
        generateResponse(),
        generateResponse(),
        generateResponse(),
        generateResponse(),
        generateResponse(),
        generateResponse(),
        generateResponse(),
      ]),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("超时")), 88000)
      ),
    ]);

    const validSvgContents = responses.filter(
      (content): content is string => content !== null
    );

    if (validSvgContents.length > 0) {
      return NextResponse.json({ svgContents: validSvgContents });
    }

    return NextResponse.json({
      svgContents: [],
      message: "未能生成有效的SVG内容",
    });
  } catch (error) {
    console.error("聊天API错误:", error);
    return NextResponse.json({ error: "生成响应失败" }, { status: 500 });
  }
}
