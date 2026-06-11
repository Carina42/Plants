// 直接使用您原模板的文学案件数据
const caseData = {
    'dalloway-rose': {
        title: '红白玫瑰与未说出口的话',
        location: '地点：伦敦 · 达洛维宅邸客厅',
        witness: '证人：红白玫瑰',
        desc: '【物质载体勘查】：理查德·达洛维无法将情感诉诸言语，遂在长街上购买鲜花。这束被紧紧包裹的红白玫瑰作为他身体欲望的延伸，记录了一场语言失效后、完全依靠物质传递的家庭隐秘戏剧。',
        testimony: '【原著现场证据】\n“他手里紧紧抓着它们——红的和白的玫瑰。……他要在跨进门槛时把它们递过去，并且说：‘我爱你，克拉丽莎。’是的，他必须亲口说出来。……可当他走近她时，他只是把花递过去说：‘多可爱的玫瑰啊！’……他没有说出口。那三个字被尘封了。He held them tight in his hand — red and white roses. ... He would hold them out and say, "I love you, Clarissa." Yes, he must say it out loud. ... But when he came up to her, he just held them out and said, "What lovely roses!" ... He hadn\'t said it. The words had frozen inside him. 他攥着它们走过大半个伦敦，掌心湿热，而现在它们插在花瓶里。原本紧绷的包装薄纸被拆开了，玫瑰在空气里一瓣瓣自然地纷披、松散开来，在炉架上无声地记录着这个秘密。”\n\n【探员侦查引申】\n理查德最终害羞地走掉了，克拉丽莎无视了桌上关于亚美尼亚的冗长政治报告，只是在静寂中凝视着它们松散的姿态。在这里，人类的语言彻底失效，而玫瑰作为唯一的物质证人，忠实地拓印下了理查德未说出口的爱欲，以及克拉丽莎在繁复社交网络中的片刻松弛。'
    },
    'septimus-elm': {
        title: '摄政公园与有生命的纤维',
        location: '地点：伦敦 · 摄政公园长椅',
        witness: '证人：古老榆树',
        desc: '【物质载体勘查】：战后饱受精神创伤（Shell Shock）折磨的赛普蒂默斯坐在榆树下。在人类的诊断书将其定性为“疯子”时，榆树的物理振动与其神经纤维达成了主客同质的共振。',
        testimony: '【原著现场证据】\n“树叶是活的，树也是活的。成千上万条纤维将那些颤动的榆树叶与他自己的身体连结在一起。当微风吹拂，树叶以极其规律的节奏扇动，在泥土上投下斑驳交错的暗影——它们不是在随风摇曳，它们是在向他示意。Leaves were alive; trees were alive. And the leaves being connected by millions of fibres with his own body, there on the seat, fanned it up and down; when the branch stretched he, too, made a statement. The elms rose as they always did...”\n\n【探员侦查引申】\n在理性文明的社会语境中，医生和路人将其判定为“疯子”；然而从植物的微观视角来看，榆树的物理振动与其敏感的神经纤维达成了某种共振。植物不进行社会审判，它只是通过无言的物质肌理，接纳并安放了他千疮百孔的内宇宙。'
    },
    'burton-carnation': {
        title: '布鲁顿夫人的帝国权力硬通货',
        location: '地点：伦敦 · 布鲁顿大宅餐厅',
        witness: '证人：干瘪的康乃馨',
        desc: '【物质载体勘查】：一朵在帝国内部精英政治游说宴会上被作为社交工具的康乃馨。它脱离了泥土，被修剪得整整齐齐，高度规训化。',
        testimony: '【原著现场证据】\n“布鲁顿夫人站在餐桌旁……手里紧紧捏着那一朵康乃馨。Lady Bruton stood by the table ... holding her carnation tight.”\n\n【探员侦查引申】\n这朵被修剪得整整齐齐、高度规训化的康乃馨，在帝国内部的权力游说宴会上沦为社交面具的硬通货。布鲁顿夫人试图用它来吸引理查德·达洛维、编织其上层政治移民计划的网罗。鲜花在此处被彻底异化，剥离了泥土和生命，它干瘪的物质形态完美地镜像了爱德华时期英国上流社会阶级话语的生命力枯萎。'
    }
};

export function getCaseData(caseId) {
    return caseData[caseId] || null;
}

export function initCaseDetail() {
    // 初始化相关事件已在 main.js 中处理
}