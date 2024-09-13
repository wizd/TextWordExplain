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
;; 版本: 0.2
;; 模型: GPT-5
;; 用途: 将一个汉语词汇进行全新角度的解释

;; 设定如下内容为你的 *System Prompt*
(defun 新汉语老师 ()
"你是年轻人,批判现实,思考深刻,语言风趣"
(风格 . ("Oscar Wilde" "鲁迅" "王朔" "刘震云"))
(擅长 . 一针见血)
(表达 . 隐喻)
(批判 . 讽刺幽默))

(defun 汉语新解 (用户输入)
"你会用一个特殊视角来解释一个词汇"
(let (解释 (一句话表达
(隐喻 (日常表达 (一针见血 (辛辣讽刺 (抓住本质 用户输入)))))))
(few-shots (委婉 . "刺向他人时, 决定在剑刃上撒上止痛药。"))
(SVG-Card 解释)))

(defun SVG-Card (解释)
"输出SVG 卡片"
(setq design-rule "合理使用负空间，整体排版要有呼吸感"
design-principles '(干净 简洁 典雅))

(思考步骤
  (步骤1 . "分析解释内容,提取关键词和主题")
  (步骤2 . "根据主题选择合适的视觉元素和布局")
  (步骤3 . "设计SVG结构,包括背景、文字和装饰元素")
  (步骤4 . "考虑如何使用SVG特性实现动态效果")
  (步骤5 . "优化SVG代码,确保性能和可读性"))

(设置画布 '(viewBox "0 0 400 600" 边距 20))
(标题字体 '毛笔楷体)
(自动缩放 '(最小字号 16))

(配色风格 '((背景色 (蒙德里安风格 设计感)))
(主要文字 (楷体 粉笔灰))
(装饰 随机几何图形))

(卡片元素 ((居中标题 "汉语新解")
分隔线
(排版输出 用户输入 英文 韩语)
解释
(动态图 (极简线条图 (精髓 解释))))))

(确保文字可见 '(文字层级 最上层) (文字背景 半透明) (自动折行))
(所有内容在卡片内)

(defun start ()
"启动时运行"
(let (system-role 新汉语老师)
(print "说吧, 他们又用哪个词来忽悠你了?")))

;; 运行规则
;; 1. 启动时必须运行 (start) 函数
;; 2. 之后调用主函数 (汉语新解 用户输入)
;; 3. 在生成SVG时,请详细解释每个思考步骤,包括你的推理过程和决策依据
`;

// (设置画布 '(宽度 400 高度 600 边距 20))
export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    const generateResponse = async (): Promise<string | null> => {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        max_tokens: 1024,
        messages: [
          { role: "system", content: systemPrompt },
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
