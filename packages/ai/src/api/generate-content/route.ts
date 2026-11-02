import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { prompt, contentType, style, length } = await request.json()

    // 验证请求参数
    if (!prompt) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 })
    }

    // 在实际应用中，这里会调用AI API（如OpenAI）
    // 这里仅做模拟
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // 根据内容类型生成不同的模板内容
    let generatedContent = ""

    switch (contentType) {
      case "小红书种草文":
        generatedContent = generateXiaohongshuContent(prompt, style, length)
        break
      case "微信公众号文章":
        generatedContent = generateWechatContent(prompt, style, length)
        break
      case "抖音短视频脚本":
        generatedContent = generateDouyinContent(prompt, style, length)
        break
      case "淘宝商品描述":
        generatedContent = generateTaobaoContent(prompt, style, length)
        break
      default:
        generatedContent = generateGenericContent(prompt, style, length)
    }

    return NextResponse.json({ content: generatedContent })
  } catch (error) {
    console.error("生成内容失败:", error)
    return NextResponse.json({ error: "内容生成失败" }, { status: 500 })
  }
}

// 生成小红书种草文
function generateXiaohongshuContent(prompt: string, style: string, length: number): string {
  return `# 不踩坑！超详细测评${prompt}，真实体验分享

大家好呀！最近入手了超级火的${prompt}，用了一周来分享我的真实体验～

【个人体验】
刚拿到手的第一感觉是包装非常精美，打开后${prompt}的质感立刻体现出来。使用了一周后，我发现它的确如宣传所说那样好用！

【优点详述】
1. 性价比超高，同类产品中价格适中但品质不输高端品牌
2. 使用感受极佳，特别是在${getRandomFeature(prompt)}方面表现出色
3. 颜值在线，放在家里/办公室都很搭配
4. 操作简单直观，即使是新手也能快速上手

【缺点说明】
老实说也有些不足，比如${getRandomDrawback(prompt)}。但考虑到价格，这些小缺点是可以接受的。

【总结】
总的来说非常推荐入手${prompt}！性价比很高，日常使用完全够用，而且颜值在线。

#好物推荐 #${prompt} #实用好物`
}

// 生成微信公众号文章
function generateWechatContent(prompt: string, style: string, length: number): string {
  return `# ${prompt}完全指南：从入门到精通

在当今快节奏的社会中，${prompt}已成为许多人关注的焦点。无论是专业人士还是普通爱好者，都希望能够深入了解这一领域。本文将为您提供一份详尽的${prompt}指南，从基础知识到进阶技巧，一应俱全。

## 一、${prompt}的基本概念

${prompt}是指...（基础概念解释）。它的核心价值在于能够帮助用户解决...等问题。随着科技的发展，${prompt}已经从最初的形态演变成为今天我们所熟知的样子。

## 二、为什么${prompt}如此重要？

1. 提高效率：${prompt}能够帮助用户节省大量时间
2. 增强体验：通过${prompt}，用户可以获得更好的使用体验
3. 创新突破：${prompt}代表了行业的最新发展方向

## 三、如何选择适合自己的${prompt}？

选择合适的${prompt}需要考虑以下几个因素：

- 个人需求：明确自己使用${prompt}的主要目的
- 预算考量：不同档次的${prompt}价格差异较大
- 品牌信誉：选择有口碑的品牌通常更有保障
- 功能对比：根据核心功能进行筛选

## 四、${prompt}的实际应用案例

案例一：某公司通过引入${prompt}，成功提升了工作效率30%...

案例二：一位自由职业者利用${prompt}，实现了工作方式的转变...

## 五、未来趋势展望

随着技术的不断发展，${prompt}领域将出现以下趋势：

1. 智能化程度提升
2. 用户体验持续优化
3. 跨平台整合加强

## 总结

${prompt}作为现代生活和工作中不可或缺的一部分，了解和掌握它将为您带来诸多便利。希望本文能够帮助您更好地理解和应用${prompt}，在实践中获得更大收益。

您有哪些关于${prompt}的经验或问题？欢迎在评论区与我们分享交流！`
}

// 生成抖音短视频脚本
function generateDouyinContent(prompt: string, style: string, length: number): string {
  return `【开场】
还在为${prompt}问题困扰吗？今天我要分享的方法让你彻底告别这个烦恼！
（画面：特写镜头展示${prompt}相关问题）

【转场】
很多人都试过各种方法，但都没解决问题，为什么？
（画面：展示常见错误方法）

【核心信息】
其实关键在于这三点：
1. 首先，你需要了解${prompt}的基本原理
（画面：动画展示原理）

2. 其次，掌握正确的使用方法至关重要
（画面：演示正确操作步骤）

3. 最后，持之以恒才能看到效果
（画面：展示成功案例）

【展示环节】
看，按照我说的方法，${prompt}问题就能这样轻松解决
（画面：展示解决前后对比）

【互动】
你遇到过这样的情况吗？评论区告诉我
（画面：指向评论区）

【结尾】
学会了记得点赞收藏，更多${prompt}相关干货内容持续更新中！
（画面：点赞收藏动画）

#${prompt}技巧 #生活小窍门 #实用分享`
}

// 生成淘宝商品描述
function generateTaobaoContent(prompt: string, style: string, length: number): string {
  return `# 【官方正品】${prompt} 高品质体验 专业级品质

## 核心卖点
✅ 精选材质：采用高品质材料，耐用持久
✅ 人性化设计：符合人体工学，使用舒适
✅ 多功能集成：满足多种使用场景需求
✅ 品质保证：严格质检，品质如一
✅ 售后无忧：7天无理由退换，365天质保

## 产品参数
- 品牌：XXX官方正品
- 材质：优质环保材料
- 尺寸：详见规格选项
- 颜色：多色可选
- 适用场景：家庭/办公/户外等多场景

## 产品特色
【高品质材质】
采用${getRandomMaterial()}材质，经久耐用，使用寿命长。

【精致做工】
每一处细节都精心打磨，彰显品质感。

【人性化设计】
根据人体工学设计，使用更舒适，减轻疲劳。

【多场景适用】
无论是家庭使用还是办公环境，都能完美适应。

## 使用场景
☑️ 家庭日常使用
☑️ 办公室工作环境
☑️ 户外活动便携
☑️ 送礼佳选，档次高

## 为什么选择我们？
1. 官方授权：正品保证，品质如一
2. 专业服务：专业客服团队，解答所有疑问
3. 快速发货：当天下单，48小时内发出
4. 无忧售后：7天无理由退换，365天质保

## 常见问题
Q1: ${prompt}如何保养？
A1: 建议定期清洁，避免阳光直射和潮湿环境。

Q2: ${prompt}有保修吗？
A2: 本产品提供365天质保服务，正常使用出现问题可联系客服。

—— 温馨提示 ——
下单前请仔细确认规格型号，如有疑问可咨询在线客服`
}

// 生成通用内容
function generateGenericContent(prompt: string, style: string, length: number): string {
  return `# 关于${prompt}的详细介绍

${prompt}是现代生活中不可或缺的一部分。本文将从多个角度为您详细介绍${prompt}的相关知识、使用方法以及选购指南。

## ${prompt}的基本介绍

${prompt}是指...（基本概念和定义）。它在日常生活和工作中扮演着重要角色，主要用于解决...等问题。

## ${prompt}的主要特点

1. 功能多样：能够满足不同场景的需求
2. 使用便捷：操作简单，上手容易
3. 效果显著：在解决特定问题上效果明显
4. 性价比高：相比同类产品，性价比较高

## 如何正确使用${prompt}

正确使用${prompt}可以分为以下几个步骤：

1. 首先，了解${prompt}的基本原理
2. 其次，掌握正确的使用方法
3. 最后，注意日常维护和保养

## ${prompt}的选购指南

选择合适的${prompt}需要考虑以下因素：

- 个人需求：明确自己的使用目的
- 品牌选择：优先考虑知名品牌
- 价格因素：根据预算选择合适产品
- 用户评价：参考其他用户的使用体验

## ${prompt}的常见问题解答

Q1: ${prompt}适合哪些人群使用？
A1: ${prompt}适合...

Q2: ${prompt}的使用寿命有多长？
A2: 一般来说，${prompt}的使用寿命在...

## 总结

${prompt}作为现代生活中的重要工具/产品，了解和掌握它的相关知识对提升生活/工作质量有着重要意义。希望本文能够帮助您更好地理解和使用${prompt}。`
}

// 辅助函数：随机生成产品特点
function getRandomFeature(product: string): string {
  const features = [
    "使用便捷性",
    "性能稳定性",
    "外观设计",
    "材质质感",
    "功能多样性",
    "智能化程度",
    "节能环保",
    "性价比",
  ]
  return features[Math.floor(Math.random() * features.length)]
}

// 辅助函数：随机生成产品缺点
function getRandomDrawback(product: string): string {
  const drawbacks = [
    "价格略高",
    "配件不够丰富",
    "说明书不够详细",
    "颜色选择有限",
    "售后服务有待提升",
    "包装简单了些",
    "配套应用不够完善",
    "与某些设备兼容性不佳",
  ]
  return drawbacks[Math.floor(Math.random() * drawbacks.length)]
}

// 辅助函数：随机生成材质
function getRandomMaterial(): string {
  const materials = [
    "航空级铝合金",
    "优质ABS工程塑料",
    "环保硅胶",
    "进口皮革",
    "高强度钢化玻璃",
    "天然竹木",
    "医用级不锈钢",
    "有机纤维",
  ]
  return materials[Math.floor(Math.random() * materials.length)]
}
