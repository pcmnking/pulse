/* ==========================================================================
   中醫脈診辨證與教學系統 - 辨證診斷演算法引擎 (pulse_engine.js)
   ========================================================================== */

const PulseEngine = {
    // 脈位深度文字映射
    DEPTH_NAMES: {
        1: "A層 (最淺層 - 表)",
        2: "B層 (淺層 - 半表)",
        3: "C層 (中層 - 胃氣/平)",
        4: "D層 (深層 - 半裡)",
        5: "E層 (最深層 - 裡)"
    },

    // 力量級數文字映射
    FORCE_NAMES: {
        1: "1級 (極無力 - 虛)",
        2: "2級 (無力 - 偏虛)",
        3: "3級 (中等力量 - 平)",
        4: "4級 (有力 - 偏實)",
        5: "5級 (極有力 - 實)"
    },

    // 穴位詳細資訊庫
    ACUPOINTS: {
        "taichong": { name: "太衝穴", desc: "位於足背第一、二蹠骨結合部前方凹陷處。能疏肝理氣、平肝熄風，主治壓力大、頭痛與情緒抑鬱。" },
        "zusanli": { name: "足三里穴", desc: "位於膝蓋外側下三寸，脛骨外側一橫指處。為胃經合穴，能大補脾胃中氣、燥濕消脹、增強免疫力。" },
        "shenmen": { name: "神門穴", desc: "位於手腕橫紋尺側端，尺側腕屈肌腱的橈側凹陷處。為心經原穴，能養心安神、調節自律神經、助眠。" },
        "sanyinjiao": { name: "三陰交穴", desc: "位於內踝尖直上三寸，脛骨內側緣後方。為肝脾腎三經交會穴，能養血柔肝、滋陰健脾、調經安神。" },
        "taixi": { name: "太溪穴", desc: "位於足內踝後方，與跟腱之間的凹陷處。為腎經原穴，能極大滋補腎陰、溫腎退熱。" },
        "guanyuan": { name: "關元穴", desc: "位於臍下三寸處。為任脈與足三陰經交會穴，能大補元氣、溫腎壯陽、培腎固本。" },
        "neiguan": { name: "內關穴", desc: "位於前臂掌側，腕橫紋上二寸處。能寧心安神、理氣止痛，對胸悶、心悸、胃脹療效顯著。" },
        "lieque": { name: "列缺穴", desc: "位於前臂橈側緣，橈骨莖突上方。能宣肺理氣、止咳平喘，主治外感咳嗽。" }
    },

    // =====================================================================
    // 《瀕湖脈學》李時珍 27脈 對照表
    // 映射規則：BINHU_PULSE_MAP[深度(1-5)][力量(1-5)] = 脈象名稱
    // 深度: 1=A(最淺), 2=B(淺), 3=C(中), 4=D(深), 5=E(最深)
    // 力量: 1=極虛, 2=虛弱, 3=平和, 4=有力, 5=極實
    // =====================================================================
    BINHU_PULSE_MAP: {
        1: { 1: "散脈", 2: "芤脈", 3: "浮脈", 4: "洪脈", 5: "革脈" },
        2: { 1: "濡脈", 2: "弱脈", 3: "緩脈", 4: "滑脈", 5: "弦脈" },
        3: { 1: "虛脈", 2: "微脈", 3: "平脈（和緩）", 4: "緊脈", 5: "實脈" },
        4: { 1: "細脈", 2: "沉弱脈", 3: "沉脈", 4: "牢脈", 5: "伏脈" },
        5: { 1: "代脈", 2: "沉細脈", 3: "沉伏脈", 4: "澀脈", 5: "伏實脈" }
    },

    // 《瀕湖脈學》各脈象詳細描述（包含原典體状詩、主病、臟腑對應）
    BINHU_PULSE_DESC: {
        "散脈":   { category: "浮類", nature: "虛", tizhuang: "散似楊花散漫飛，去來無定至難齊；產為生兆胎為墮，久病逢之不必醫。", zhibing: "主氣血離散，元氣耗散。見於虛勞極衰、心腎欲絕之危候。", zangfu: "心腎" },
        "芤脈":   { category: "浮類", nature: "虛", tizhuang: "芤形浮大軟如蔥，邊實須知內已空；火犯陽經血上溢，熱侵陰絡下流紅。", zhibing: "主失血、陰傷。見於吐血、衄血、崩漏、便血等大量失血之後。", zangfu: "心肝" },
        "浮脈":   { category: "浮類", nature: "表", tizhuang: "浮脈惟從肉上行，如循榆莢似毛輕；三秋得令知無恙，久病逢之卻可驚。", zhibing: "主表證。浮而有力為表實，浮而無力為表虛。亦主虛陽外越。", zangfu: "肺（表）" },
        "洪脈":   { category: "浮類", nature: "熱", tizhuang: "脈來洪盛去還衰，滿指滔滔應夏時；若在春秋冬月分，升陽散火莫狐疑。", zhibing: "主熱證、氣分熱盛。見於高熱、煩渴引飲、大汗出、脈洪大有力（四大症）。", zangfu: "心（氣分熱）" },
        "革脈":   { category: "浮類", nature: "虛寒", tizhuang: "革脈形如按鼓皮，芤弦相合脈寒虛；女人半產並崩漏，男子營虛或夢遺。", zhibing: "主精血虧虛、寒邪凝聚。女子主半產崩漏，男子主遺精陽虛。", zangfu: "肝腎" },
        "濡脈":   { category: "浮類", nature: "虛濕", tizhuang: "濡形浮細按須輕，水面浮綿力不禁；病後產中猶有藥，平人若見是無根。", zhibing: "主虛證、濕證。見於氣血不足、濕邪困阻中焦。", zangfu: "脾胃" },
        "弱脈":   { category: "沉類", nature: "虛", tizhuang: "弱來無力按之柔，柔細而沉不見浮；陽陷入陰精血弱，白頭猶可少年愁。", zhibing: "主陽氣衰微、氣血俱虛。見於慢性虛弱體質、陽氣不足諸症。", zangfu: "脾腎" },
        "緩脈":   { category: "遲類", nature: "平或濕", tizhuang: "緩脈阿阿四至通，柳梢嫋嫋颭輕風；欲從脈裡求神氣，只在從容和緩中。", zhibing: "正常緩脈為平和之象；病緩脈主濕邪、脾胃虛弱。", zangfu: "脾胃" },
        "滑脈":   { category: "數類", nature: "痰濕/實/孕", tizhuang: "滑脈如珠替替然，往來流利卻還前；莫將滑數為同類，數脈惟看至數間。", zhibing: "主痰飲、食積、實熱；女性妊娠亦見滑脈。", zangfu: "胃腸、子宮" },
        "弦脈":   { category: "弦類", nature: "肝/痛/痰", tizhuang: "弦脈迢迢端直長，肝經木旺土應傷；怒氣滿胸常欲叫，翳蒙瞳子淚淋浪。", zhibing: "主肝膽病、疼痛、痰飲、瘧疾。為肝氣不舒、筋脈拘急之象。", zangfu: "肝膽" },
        "虛脈":   { category: "虛類", nature: "虛", tizhuang: "脈虛身熱為傷暑，自汗怔忡驚悸多；發熱陰虛須早治，養營益氣莫蹉跎。", zhibing: "主氣血兩虛諸症。見於神疲乏力、自汗、怔忡、驚悸。", zangfu: "心脾" },
        "微脈":   { category: "虛類", nature: "陽衰", tizhuang: "氣血微兮脈亦微，惡寒發熱汗淋漓；男為勞極諸虛候，女作崩中帶下醫。", zhibing: "主陽衰氣微、氣血大虛。見於虛脫、亡陽、崩漏帶下之危重症。", zangfu: "心腎" },
        "平脈（和緩）": { category: "正常", nature: "平和", tizhuang: "四時百病胃為本，脈貴有神不可損；胃氣為本，從容和緩，不浮不沉，不大不小。", zhibing: "氣血和調，五臟平衡，無邪無病之正常脈象。", zangfu: "胃氣充足（五臟俱安）" },
        "緊脈":   { category: "緊類", nature: "寒/痛", tizhuang: "舉如轉索切如繩，脈象因之得緊名；總是寒邪來作寇，內為腹痛外身疼。", zhibing: "主寒邪、疼痛、宿食。為寒邪收引、氣機鬱遏之象。", zangfu: "脾胃、筋脈" },
        "實脈":   { category: "實類", nature: "實熱", tizhuang: "實脈浮沉有力強，緊如彈索轉無常；須知牢脈幫筋骨，實大微弦更帶長。", zhibing: "主實證、熱證。見於邪氣盛實、氣血壅滯之症。", zangfu: "胃腸（實熱積滯）" },
        "細脈":   { category: "虛類", nature: "血虛陰虛", tizhuang: "細來累累細如絲，應指沉沉無絕期；春夏少年俱不利，秋冬老弱卻相宜。", zhibing: "主氣血兩虛、諸虛勞損、濕邪為病。", zangfu: "心脾腎" },
        "沉弱脈": { category: "沉類", nature: "陽虛血虛", tizhuang: "沉取有弱，力不應指，陰陽俱虛，氣血不足之候。", zhibing: "主陽氣衰弱、血虛不榮。見於慢性虛勞，氣虛不升之證。", zangfu: "脾腎" },
        "沉脈":   { category: "沉類", nature: "裡證", tizhuang: "水行潤下脈來沉，筋骨之間軟滑勻；女子寸兮男子尺，四時如此號為平。", zhibing: "主裡證。沉而有力為裡實，沉而無力為裡虛。亦主水氣、痰飲。", zangfu: "腎（裡）" },
        "牢脈":   { category: "沉類", nature: "陰寒積聚", tizhuang: "弦長實大脈牢堅，牢位常居沉伏間；革脈芤弦自浮起，革虛牢實要詳看。", zhibing: "主陰寒內積、疝瘕癥積。為病邪深伏、正氣未虛之裡實重症。", zangfu: "肝腎（陰寒）" },
        "伏脈":   { category: "沉類", nature: "邪閉/厥逆", tizhuang: "伏脈推筋著骨尋，指間裁動隱然深；傷寒欲汗陽將解，厥逆臍疼症屬陰。", zhibing: "主邪閉、厥逆、劇烈疼痛、氣機閉阻。見於邪氣內伏不出。", zangfu: "腎（閉）" },
        "代脈":   { category: "結代類", nature: "臟衰/主死", tizhuang: "動而中止不能還，復動因而作代看；病者得之猶可療，平人卻與壽相關。", zhibing: "主臟氣衰微、跳動有規律的歇止。見於心臟病、久病虛損，亦見於驚恐、痛極。", zangfu: "心（臟衰）" },
        "沉細脈": { category: "沉類", nature: "陰血虛竭", tizhuang: "沉取而細，絲絲應指，陰血虧虛，精氣不足之候。", zhibing: "主陰血虧虛、精髓不足。見於腎陰大傷、久病失血。", zangfu: "腎肝（陰血）" },
        "沉伏脈": { category: "沉類", nature: "裡實深閉", tizhuang: "沉而更伏，重按乃得，病邪深伏，氣機大閉之候。", zhibing: "主裡實邪閉、氣機深度阻滯。見於重症積聚、邪伏深裡。", zangfu: "腎（裡閉）" },
        "澀脈":   { category: "澀類", nature: "血虛/血瘀", tizhuang: "細遲短澀往來難，散止依稀應指間；如雨沾沙容易散，病蠶食葉慢而艱。", zhibing: "主精傷血少、氣滯血瘀、痰食內停。見於瘀血諸症、婦人月事不調。", zangfu: "肝（血瘀）" },
        "伏實脈": { category: "沉類", nature: "陰閉實邪", tizhuang: "深按有力而難尋，邪實深閉，陰寒凝聚，閉阻不通之候。", zhibing: "主陰寒實邪深閉，見於重症癥積、氣機深度閉阻、陽氣不達。", zangfu: "腎（陰實）" }
    },

    /**
     * 根據深度(1-5)與力量(1-5)取得對應的《瀕湖脈學》脈象名稱
     */
    getBinhuPulseName(depth, force) {
        const d = Math.min(5, Math.max(1, parseInt(depth)));
        const f = Math.min(5, Math.max(1, parseInt(force)));
        return (this.BINHU_PULSE_MAP[d] && this.BINHU_PULSE_MAP[d][f]) || "平脈（和緩）";
    },

    /**
     * 根據深度與力量取得《瀕湖脈學》脈象的完整詳細說明
     */
    getBinhuPulseDesc(depth, force) {
        const name = this.getBinhuPulseName(depth, force);
        return this.BINHU_PULSE_DESC[name] || {
            category: "正常", nature: "平和",
            tizhuang: "脈象平和，從容和緩，不浮不沉。",
            zhibing: "氣血和調，五臟平衡。",
            zangfu: "五臟均安"
        };
    },

    /**
     * 產生完整的《瀕湖脈學》格式化診斷提示詞（供複製到 Gemini 使用）
     * @param {Object} pointsState 六部位 {leftCun, leftGuan, leftChi, rightCun, rightGuan, rightChi} 各含 depth, force
     * @param {Array} lifestyle 生活問診勾選項
     * @param {Object} diagReport 系統診斷報告
     * @returns {string} 格式化的純文字提示詞
     */
    generateGeminiPrompt(pointsState, lifestyle, diagReport) {
        const DEPTH_LETTERS = ["A", "B", "C", "D", "E"];
        const DEPTH_CN = ["最淺層(表/浮)", "淺層(半表)", "中層(胃氣/平)", "深層(半裡)", "最深層(裡/伏)"];
        const FORCE_CN = ["極無力(極虛)", "無力(偏虛)", "中等力量(平和)", "有力(偏實)", "極有力(極實)"];

        // posOrgan = 部位所候臟腑（固定，由寸關尺位置決定）
        const posInfos = [
            { key: "leftCun",   label: "左手寸部", posOrgan: "心、腦（神明）" },
            { key: "leftGuan",  label: "左手關部", posOrgan: "肝、膽（疏泄）" },
            { key: "leftChi",   label: "左手尺部", posOrgan: "腎陰、胞宮（藏精）" },
            { key: "rightCun",  label: "右手寸部", posOrgan: "肺、胸中（宣降）" },
            { key: "rightGuan", label: "右手關部", posOrgan: "脾、胃（運化）" },
            { key: "rightChi",  label: "右手尺部", posOrgan: "腎陽、命門（元陽）" }
        ];

        const lifestyleMap = {
            stress: "工作壓力大", irritability: "焦慮易怒/容易生氣",
            insomnia: "入睡困難/多夢易醒", fatigue: "神疲乏力/精神差",
            cold_limbs: "手腳冰冷/畏寒怕冷", bloating: "飯後容易胃脹/便溏",
            cough: "喉嚨敏感咳嗽/氣喘", hot_flashes: "手心發熱/潮熱盜汗",
            backache: "腰部酸軟/膝蓋冷痛"
        };

        let lines = [];
        lines.push("# 中醫脈診諮詢 — 依《瀕湖脈學》進行詳細解讀");
        lines.push("");
        lines.push("你是一位精通李時珍《瀕湖脈學》的中醫脈學專家，請依照以下脈診數據，按照《瀕湖脈學》27脈的理論框架進行詳細的病機分析與辨證論治。");
        lines.push("");
        lines.push("---");
        lines.push("## 一、脈診數據（台灣中醫精細把脈系統）");
        lines.push("");
        lines.push("本系統使用台灣中醫師精細把脈方法，將橈動脈分為 A(最淺)～E(最深) 五個層次，");
        lines.push("力道分為 1(最弱)～5(最強) 五個等級，每個部位用「層次+力道」編碼記錄。");
        lines.push("");
        lines.push("▌重要概念區分：");
        lines.push("  ①【部位所候臟腑】= 由寸關尺把脈位置固定決定，反映該臟腑的氣血狀態。");
        lines.push("  ②【脈象主病臟腑】= 由脈型決定，《瀕湖脈學》此脈型最常指向的病變臟腑。");
        lines.push("  ➜ 解讀方法：以①定位（哪個臟腑有病），以②判性（病的性質與傾向），二者合參。");
        lines.push("");

        posInfos.forEach(info => {
            const p = pointsState[info.key];
            const d = parseInt(p.depth);
            const f = parseInt(p.force);
            const depthLetter = DEPTH_LETTERS[d - 1];
            const binhuName = this.getBinhuPulseName(d, f);
            const binhuDesc = this.getBinhuPulseDesc(d, f);
            const isNormal = (d === 3 && f === 3);

            lines.push(`### ${info.label}`);
            lines.push(`- **系統編碼**：${depthLetter}${f}（深度：${DEPTH_CN[d-1]}，力量：${FORCE_CN[f-1]}）`);
            lines.push(`- **①【部位所候臟腑】**：${info.posOrgan}　（此把脈位置固定監測的臟腑）`);
            lines.push(`- **對應《瀕湖脈學》脈象**：**${binhuName}**（${binhuDesc.category}｜性質：${binhuDesc.nature}）`);
            lines.push(`- **②【脈象主病臟腑】**：${binhuDesc.zangfu}　（此脈型按《瀕湖》所主的病臟腑）`);
            if (!isNormal) {
                lines.push(`- **脈象體狀**（原典）：「${binhuDesc.tizhuang}」`);
                lines.push(`- **主病**：${binhuDesc.zhibing}`);
                lines.push(`- **➜ 合參解讀**：「${info.posOrgan}」位出現「${binhuName}」，提示此部位臟腑受到「${binhuDesc.nature}」性質影響，宜結合①②共同分析病機。`);
            } else {
                lines.push(`- **脈象狀態**：平脈，氣血和調，此部位無明顯異常。`);
            }
            lines.push("");
        });

        lines.push("---");
        lines.push("## 二、患者主訴症狀");
        lines.push("");
        if (lifestyle && lifestyle.length > 0) {
            const symptomsList = lifestyle.map(s => lifestyleMap[s] || s);
            lines.push("患者近期自覺明顯症狀（多選）：");
            symptomsList.forEach(s => lines.push(`- ${s}`));
        } else {
            lines.push("患者未填寫特別主訴症狀，以脈象客觀資料為主。");
        }
        lines.push("");

        lines.push("---");
        lines.push("## 三、系統初步辨證結果（供參考）");
        lines.push("");
        if (diagReport) {
            lines.push(`- **初步辨證**：${diagReport.syndrome}`);
        }
        lines.push("");

        lines.push("---");
        lines.push("## 四、請依《瀕湖脈學》進行以下分析");
        lines.push("");
        lines.push("1. **各部位脈象綜合分析**：請逐一解讀六部（左寸、左關、左尺、右寸、右關、右尺）的脈象，引用《瀕湖脈學》相關脈象的原典論述（體状詩、主病詩），說明每部脈象的病機意義。");
        lines.push("");
        lines.push("2. **整體證型辨證**：綜合六部脈象及主訴症狀，按照《瀕湖脈學》及中醫辨證論治原則，給出最終辨證診斷（包括陰陽、表裡、寒熱、虛實分類）。");
        lines.push("");
        lines.push("3. **病機推演**：以《瀕湖脈學》的脈學理論解釋此脈象組合反映的臟腑病機，以及各臟腑之間的相互影響關係。");
        lines.push("");
        lines.push("4. **治則與治法建議**：依據辨證結果，提出符合中醫傳統理論的治療原則（治法）、可參考的方劑方向（方義說明即可，無需具體開藥），以及穴位保健建議。");
        lines.push("");
        lines.push("5. **預後與調攝**：評估目前脈象所反映的體質狀況，給出生活作息、飲食調養、情緒管理方面的具體建議。");
        lines.push("");
        lines.push("---");
        lines.push("*本資料由台灣中醫精細脈診系統產生，結合《瀕湖脈學》27脈對照轉換，供 Gemini AI 進行深度中醫脈學解讀。*");

        return lines.join("\n");
    },

    /**
     * 獲取單一部位的脈象診斷狀態與描述
     * @param {string} pos 部位代號 (leftCun, leftGuan, etc.)
     * @param {number} depth 深度 (1-5)
     * @param {number} force 力量 (1-5)
     * @returns {Object} 包含狀態名、描述與類型 (normal, deficient, excess)
     */
    getPointStatus(pos, depth, force) {
        // 確保數值為整數
        const d = parseInt(depth);
        const f = parseInt(force);

        switch (pos) {
            case "leftCun": // 左寸 (心/大腦)
                if (d <= 2) {
                    return {
                        state: "心律不整 (脈搏跳停)",
                        desc: "反映心臟實質功能與大腦神智失調。出現脈律不整或跳動停歇，常見於心肌疲勞、心律不整、供血不穩。",
                        type: "deficient",
                        syndrome: "心律失常證",
                        acupoint: "shenmen"
                    };
                } else if (d >= 4) {
                    return {
                        state: "心血管阻塞 (扭曲脈)",
                        desc: "反映心經血行不暢，脈道扭曲。常見心前區憋悶、心血管阻塞風險、胸悶不舒。",
                        type: "excess",
                        syndrome: "心脈痹阻證",
                        acupoint: "neiguan"
                    };
                } else if (f <= 2) {
                    return {
                        state: "心悸恐慌 (無力脈)",
                        desc: "反映心臟實質功能與大腦神智偏虛。常見心悸恐慌、大腦供血不足、頭暈、心慌不安。",
                        type: "deficient",
                        syndrome: "心血不足證",
                        acupoint: "shenmen"
                    };
                } else if (f >= 4) {
                    return {
                        state: "心火旺 (多夢與失眠)",
                        desc: "反映心火旺盛，熱擾神明。常見心火旺導致的多夢與失眠、煩躁不安、易嘴破與長痘痘。",
                        type: "excess",
                        syndrome: "心火亢盛證",
                        acupoint: "shenmen"
                    };
                }
                return { state: "正常", desc: "心脈平順，氣血流暢，神智清明。", type: "normal" };

            case "leftGuan": // 左關 (肝/膽)
                if (d >= 4 && f >= 4) {
                    return {
                        state: "肝氣鬱結 (悶生氣/短脈)",
                        desc: "反映情緒壓力與自律神經氣機鬱滯。常見生悶氣、壓力大、胸脅脹滿、自律神經失調。",
                        type: "excess",
                        syndrome: "肝氣鬱結證",
                        acupoint: "taichong"
                    };
                } else if (d <= 2 && f >= 4) {
                    return {
                        state: "膽火擾神 (焦慮失眠/浮脈)",
                        desc: "膽火擾心、自律神經亢進。常見腦袋轉不停的焦慮型失眠、眼睛乾澀、口苦。",
                        type: "excess",
                        syndrome: "膽火擾神證",
                        acupoint: "taichong"
                    };
                } else if (d >= 4 && f <= 2) {
                    return {
                        state: "肝血虛 (肌肉僵硬/細緊脈)",
                        desc: "肝血虧虛，筋脈失養。常見肌肉僵硬酸痛、抑鬱憂慮、乾眼疲勞與肢體麻木。",
                        type: "deficient",
                        syndrome: "肝血不足證",
                        acupoint: "sanyinjiao"
                    };
                } else if (f <= 2) {
                    return {
                        state: "肝血虛 (無力脈)",
                        desc: "肝氣血不足，脈弱無力。容易目澀乾眼、肢體易麻與疲勞。",
                        type: "deficient",
                        syndrome: "肝血不足證",
                        acupoint: "sanyinjiao"
                    };
                } else if (f >= 4) {
                    return {
                        state: "肝陽上亢 (有力脈)",
                        desc: "肝陽偏亢，易頭暈脹痛、面紅目赤、急躁易怒。",
                        type: "excess",
                        syndrome: "肝陽上亢證",
                        acupoint: "taichong"
                    };
                }
                return { state: "正常", desc: "肝膽氣機條達，疏泄正常。", type: "normal" };

            case "leftChi": // 左尺 (腎陰/內分泌)
                if (d >= 4 && f <= 2) {
                    return {
                        state: "腎陰虛衰 (熬夜透支脈)",
                        desc: "反映深度修復力透支。常見長期熬夜導致的腰膝痠軟、掉髮、淺眠多夢、夜間盜汗（虛火）及提早老化。",
                        type: "deficient",
                        syndrome: "腎陰不足證",
                        acupoint: "taixi"
                    };
                } else if (d <= 2) {
                    return {
                        state: "下焦虛火上炎 (浮脈)",
                        desc: "反映腎陰不足，虛火外炎。常見潮熱盜汗、手腳心發熱、淺眠多夢。",
                        type: "deficient",
                        syndrome: "陰虛火旺證",
                        acupoint: "taixi"
                    };
                } else if (f >= 4) {
                    return {
                        state: "下焦濕熱 (實脈)",
                        desc: "反映下焦濕熱鬱結. 常見小便赤澀、腰部脹痛不安。",
                        type: "excess",
                        syndrome: "下焦濕熱證",
                        acupoint: "sanyinjiao"
                    };
                } else if (f <= 2) {
                    return {
                        state: "腎精不足 (無力脈)",
                        desc: "反映腎精虧損。常見腰酸腿軟、耳鳴、精力衰退。",
                        type: "deficient",
                        syndrome: "腎精不足證",
                        acupoint: "taixi"
                    };
                }
                return { state: "正常", desc: "腎陰充盈，精血得養。", type: "normal" };

            case "rightCun": // 右寸 (肺/胸中)
                if (d <= 2 && f <= 2) {
                    return {
                        state: "肺氣不足 (表氣虛)",
                        desc: "反映呼吸系統與體表免疫。常見反覆感冒、胸悶、氣喘（稍微活動就喘）、怕冷自汗。",
                        type: "deficient",
                        syndrome: "肺氣不足證",
                        acupoint: "lieque"
                    };
                } else if (d >= 4 && f >= 4) {
                    return {
                        state: "肺燥痰熱 (慢性乾咳)",
                        desc: "反映呼吸道熱鬱或燥邪犯肺。常見感冒後的慢性乾咳無痰、咽喉乾痛。",
                        type: "excess",
                        syndrome: "肺熱燥咳證",
                        acupoint: "lieque"
                    };
                } else if (f <= 2) {
                    return {
                        state: "肺氣虛 (無力脈)",
                        desc: "反映肺氣虛損，氣短懶言、聲音低微、防禦力下降。",
                        type: "deficient",
                        syndrome: "肺氣不足證",
                        acupoint: "lieque"
                    };
                } else if (f >= 4) {
                    return {
                        state: "肺熱痰壅 (有力脈)",
                        desc: "反映肺胃熱盛，氣逆而喘。常見痰多黃稠、咳嗽、胸悶。",
                        type: "excess",
                        syndrome: "肺熱壅盛證",
                        acupoint: "lieque"
                    };
                }
                return { state: "正常", desc: "肺主宣降功能正常，衛外固密。", type: "normal" };

            case "rightGuan": // 右關 (脾/胃)
                if (d >= 4 && f <= 2) {
                    return {
                        state: "裡氣虛 (脾胃虛弱)",
                        desc: "中焦運化功能衰退。常見食慾差、消化不良、排便軟散不成形或容易腹瀉。",
                        type: "deficient",
                        syndrome: "脾胃虛弱證",
                        acupoint: "zusanli"
                    };
                } else if (d >= 4 && f >= 4) {
                    return {
                        state: "裡實證 (腸胃食積)",
                        desc: "腸胃道氣滯「塞車」、飲食積滯。常見吃飽脹氣、消化不良、胃酸逆流或排便困難（便祕）。",
                        type: "excess",
                        syndrome: "腸胃食積證",
                        acupoint: "zusanli"
                    };
                }
                return { state: "正常", desc: "脾胃協調，升清降濁功能正常。", type: "normal" };

            case "rightChi": // 右尺 (腎陽/命門火)
                if (d >= 4 && f <= 2) {
                    return {
                        state: "裡氣虛 (腎陽不足)",
                        desc: "身體核心動能與熱能不足（命門火衰）。常見極度怕冷、手腳冰冷、精神疲乏、夜間頻尿、生殖機能退化（如宮寒不孕）。",
                        type: "deficient",
                        syndrome: "腎陽不足證",
                        acupoint: "guanyuan"
                    };
                } else if (d <= 2) {
                    return {
                        state: "命門火衰浮越 (浮脈)",
                        desc: "反映元陽虛衰，陽氣外浮。常見虛寒浮熱、面赤、手腳冰冷。",
                        type: "deficient",
                        syndrome: "腎陽不足證",
                        acupoint: "guanyuan"
                    };
                } else if (f >= 4) {
                    return {
                        state: "相火偏旺 (實脈)",
                        desc: "命門相火偏亢。常見性機能亢盛、手足心熱。",
                        type: "excess",
                        syndrome: "相火妄動證",
                        acupoint: "taixi"
                    };
                } else if (f <= 2) {
                    return {
                        state: "命門火衰 (無力脈)",
                        desc: "反映命門火衰。常見畏寒怕冷、腰膝冷痛、夜尿頻多。",
                        type: "deficient",
                        syndrome: "腎陽不足證",
                        acupoint: "guanyuan"
                    };
                }
                return { state: "正常", desc: "元陽溫煦，命門火旺。", type: "normal" };

            default:
                return { state: "正常", desc: "氣血平順。", type: "normal" };
        }
    },

    /**
     * 核心診斷辨證函數 (微觀寸關尺診法)
     * @param {Object} input 包含 6 部位各自的 Depth(1-5) 與 Force(1-5)
     * @returns {Object} 診斷報告結果
     */
    diagnose(input) {
        const leftCunDepth = parseInt(input.leftCunDepth || 3);
        const leftCunForce = parseInt(input.leftCunForce || 3);
        const leftGuanDepth = parseInt(input.leftGuanDepth || 3);
        const leftGuanForce = parseInt(input.leftGuanForce || 3);
        const leftChiDepth = parseInt(input.leftChiDepth || 3);
        const leftChiForce = parseInt(input.leftChiForce || 3);

        const rightCunDepth = parseInt(input.rightCunDepth || 3);
        const rightCunForce = parseInt(input.rightCunForce || 3);
        const rightGuanDepth = parseInt(input.rightGuanDepth || 3);
        const rightGuanForce = parseInt(input.rightGuanForce || 3);
        const rightChiDepth = parseInt(input.rightChiDepth || 3);
        const rightChiForce = parseInt(input.rightChiForce || 3);

        const lifestyle = input.lifestyle || [];

        // 1. 取得 6 部位診斷狀態 (直接連動 Zang-Fu 氣血)
        const heartState = this.getPointStatus("leftCun", leftCunDepth, leftCunForce);
        const liverState = this.getPointStatus("leftGuan", leftGuanDepth, leftGuanForce);
        const kidneyYinState = this.getPointStatus("leftChi", leftChiDepth, leftChiForce);
        const lungState = this.getPointStatus("rightCun", rightCunDepth, rightCunForce);
        const spleenState = this.getPointStatus("rightGuan", rightGuanDepth, rightGuanForce);
        const kidneyYangState = this.getPointStatus("rightChi", rightChiDepth, rightChiForce);

        const organs = {
            heart: { name: "心經氣血 (左寸)", ...heartState },
            liver: { name: "肝膽疏泄 (左關)", ...liverState },
            kidneyYin: { name: "下焦腎陰 (左尺)", ...kidneyYinState },
            lung: { name: "肺司呼吸 (右寸)", ...lungState },
            spleen: { name: "脾胃運化 (右關)", ...spleenState },
            kidneyYang: { name: "命門元陽 (右尺)", ...kidneyYangState }
        };

        // 收集診斷證型與穴位
        const diagnostics = [];
        const acupointsSet = new Set();
        let dietSuggestions = [];
        let lifestyleSuggestions = [];

        // 將有病機狀態的證型加入計分
        for (const [key, org] of Object.entries(organs)) {
            if (org.type !== "normal") {
                if (org.syndrome) diagnostics.push(org.syndrome);
                if (org.acupoint) acupointsSet.add(org.acupoint);
            }
        }

        // ==========================================
        // 3. 結合各部位診斷得出最終複合證型 (Flat pattern matching)
        // ==========================================
        let finalSyndrome = "氣血和調、平平之脈";
        let isAbnormal = false;
        let pathologyBlocks = [];

        // 移除重複的診斷名稱
        const uniqueDiagnostics = Array.from(new Set(diagnostics));

        // 複合辨證規則
        if (uniqueDiagnostics.length > 0) {
            isAbnormal = true;

            const hasLiverStagnant = uniqueDiagnostics.includes("肝氣鬱結證");
            const hasSpleenDef = uniqueDiagnostics.includes("脾胃虛弱證");
            const hasHeartBloodDef = uniqueDiagnostics.includes("表血虛證") || uniqueDiagnostics.includes("心血不足證");
            const hasKidneyYinDef = uniqueDiagnostics.includes("腎陰不足證");
            const hasKidneyYangDef = uniqueDiagnostics.includes("腎陽不足證");
            const hasLungDef = uniqueDiagnostics.includes("肺氣不足證");

            // 1. 肝脾不和
            if (hasLiverStagnant && hasSpleenDef) {
                finalSyndrome = "肝脾不和證 (木鬱乘土)";
                pathologyBlocks.push("【證候特徵】<strong>肝脾不和</strong>。左關肝氣鬱結阻滯，橫逆克脾胃，導致腸胃運化功能下降。情緒抑鬱或工作壓力大時，飯後特別容易脹氣、消化不良甚至腹痛腹瀉。");
                acupointsSet.add("taichong");
                acupointsSet.add("zusanli");
                acupointsSet.add("neiguan");
            } 
            // 2. 心脾兩虛
            else if (hasHeartBloodDef && hasSpleenDef) {
                finalSyndrome = "心脾兩虛證";
                pathologyBlocks.push("【證候特徵】<strong>心脾兩虛</strong>。脾氣虛運化不力，氣血化生來源不足，導致心血不足。見入睡困難、多夢淺眠、心悸、健忘以及精神疲倦。");
                acupointsSet.add("shenmen");
                acupointsSet.add("zusanli");
                acupointsSet.add("sanyinjiao");
            }
            // 3. 脾肺氣虛
            else if (hasLungDef && hasSpleenDef) {
                finalSyndrome = "脾肺氣虛證";
                pathologyBlocks.push("【證候特徵】<strong>脾肺氣虛</strong>。土不生金，人體中氣與肺經衛氣雙虛。表現為容易疲倦、怕風冷、稍微活動就喘、大便軟爛不成形。");
                acupointsSet.add("zusanli");
                acupointsSet.add("lieque");
            }
            // 4. 陰陽兩虛
            else if (hasKidneyYinDef && hasKidneyYangDef) {
                finalSyndrome = "陰陽兩虛證";
                pathologyBlocks.push("【證候特徵】<strong>陰陽兩虛</strong>。腎之元陰與命門元陽俱損。既見手腳冰冷、極度怕冷，又伴隨淺眠多夢、盜汗及腰膝痠軟。");
                acupointsSet.add("taixi");
                acupointsSet.add("guanyuan");
                acupointsSet.add("sanyinjiao");
            }
            // 5. 單一或多個證型併見
            else {
                if (uniqueDiagnostics.length >= 2) {
                    finalSyndrome = uniqueDiagnostics.slice(0, 2).map(s => s.replace("證", "")).join(" 併 ") + "證";
                } else {
                    finalSyndrome = uniqueDiagnostics[0];
                }
            }
        }

        // 4. 構造詳細病機分析文本
        let detailedPathology = "";
        let abnormalDetails = [];
        
        for (const [key, org] of Object.entries(organs)) {
            if (org && org.type && org.type !== "normal") {
                const nameText = org.name || "未知部位";
                const stateText = org.state || "異常";
                const descText = org.desc || "脈象參數偏離，請調整或調理。";
                abnormalDetails.push(`<li><strong>${nameText} - ${stateText}</strong>：${descText}</li>`);
            }
        }

        if (abnormalDetails.length > 0) {
            detailedPathology = `
                ${pathologyBlocks.length > 0 ? pathologyBlocks.join("<br>") : ""}
                <div style="margin-top: 0.75rem;">
                    <strong>各臟腑定位脈象異常分析：</strong>
                    <ul style="padding-left: 1.25rem; margin-top: 0.35rem; display:flex; flex-direction:column; gap:0.4rem;">
                        ${abnormalDetails.join("")}
                    </ul>
                </div>
            `;
        } else {
            detailedPathology = "您目前的寸關尺各部脈象深度與力量皆在正常範圍（C層，3級），氣血充沛、五臟機能平衡，無明顯病理性脈證。";
        }

        // 結合問診
        if (lifestyle.length > 0) {
            const lifestyleNamesMap = {
                stress: "壓力大",
                irritability: "焦慮易怒",
                insomnia: "失眠多夢",
                fatigue: "疲倦乏力",
                cold_limbs: "手腳冰冷",
                bloating: "飯後脹氣",
                cough: "咳嗽敏感",
                hot_flashes: "潮熱盜汗",
                backache: "腰酸腿軟"
            };
            const symptomsText = lifestyle.map(s => lifestyleNamesMap[s] || s).join("、");
            detailedPathology += `
                <div style="margin-top: 0.75rem; border-top: 1px dashed var(--border-color); padding-top: 0.5rem; font-size: 0.8rem; color: var(--text-secondary);">
                    <strong>最近主訴症狀結合：</strong>${symptomsText}。調理方已將上述主訴納入考量。
                </div>
            `;

            // 根據主訴追加保健穴位
            if (lifestyle.includes("stress") || lifestyle.includes("irritability")) {
                acupointsSet.add("taichong");
            }
            if (lifestyle.includes("insomnia")) {
                acupointsSet.add("shenmen");
                acupointsSet.add("sanyinjiao");
            }
            if (lifestyle.includes("fatigue") || lifestyle.includes("bloating")) {
                acupointsSet.add("zusanli");
                acupointsSet.add("neiguan");
            }
            if (lifestyle.includes("cold_limbs")) {
                acupointsSet.add("guanyuan");
            }
            if (lifestyle.includes("backache")) {
                acupointsSet.add("taixi");
                acupointsSet.add("sanyinjiao");
            }
            if (lifestyle.includes("cough")) {
                acupointsSet.add("lieque");
            }
        }

        // ==========================================
        // 5. 輸出調理處方
        // ==========================================
        const acupointsOutput = Array.from(acupointsSet).map(code => this.ACUPOINTS[code]).filter(Boolean);
        if (acupointsOutput.length === 0) {
            acupointsOutput.push(this.ACUPOINTS.zusanli);
            acupointsOutput.push(this.ACUPOINTS.sanyinjiao);
        }

        // 合成食療與生活建議
        let dietText = "日常維持清淡均衡飲食，多吃高纖蔬菜，多喝溫水，忌生冷寒涼。";
        let lifestyleText = "維持規律作息，適度進行有氧拉伸運動（如太極或瑜珈），晚上11點前入睡以養護氣血。";

        if (uniqueDiagnostics.includes("心火亢盛證") || uniqueDiagnostics.includes("心血不足證")) {
            dietText = "宜食養心安神之品，如百合、茯苓、大棗。忌食刺激與高熱量食物。";
            lifestyleText = "睡前應放鬆思緒，避免劇烈腦力勞動或劇烈運動。";
        }
        if (uniqueDiagnostics.includes("肝氣鬱結證") || uniqueDiagnostics.includes("膽火擾神證")) {
            dietText = "宜喝玫瑰花薄荷茶、佛手柑茶以理氣疏肝。少吃油膩重口味。";
            lifestyleText = "多接觸綠色自然環境以疏解情緒壓力，保證晚上11點前入睡以利膽經運行。";
        }
        if (uniqueDiagnostics.includes("腎陰不足證")) {
            dietText = "可食滋陰潤燥食品，如黑芝麻、桑椹、銀耳、百合。";
            lifestyleText = "嚴格避免熬夜，減少元陰損耗。";
        }
        if (uniqueDiagnostics.includes("腎陽不足證")) {
            dietText = "宜溫補腎陽，可吃生薑、羊肉、核桃、桂圓。";
            lifestyleText = "注意下半身防寒保暖，每日熱水泡腳15分鐘。";
        }
        if (uniqueDiagnostics.includes("脾胃虛弱證") || uniqueDiagnostics.includes("脾胃虛寒證")) {
            dietText = "多吃溫熱熟食，可用山藥、蓮子、扁豆煮粥，禁食冷飲。";
            lifestyleText = "飲食定時定量，細嚼慢嚥，避免暴飲暴食。";
        }

        return {
            syndrome: finalSyndrome,
            isAbnormal,
            pathology: detailedPathology,
            diet: dietText,
            lifestyle: lifestyleText,
            acupoints: acupointsOutput,
            organStates: {
                heart: organs.heart,
                liver: organs.liver,
                kidneyYin: organs.kidneyYin,
                lung: organs.lung,
                spleen: organs.spleen,
                kidneyYang: organs.kidneyYang
            }
        };
    }
};

window.PulseEngine = PulseEngine;
