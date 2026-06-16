/* ==========================================================================
   中醫脈診辨證與教學系統 - 講義與專業知識數據庫 (knowledge_data.js)
   ========================================================================== */

const LECTURE_DATA = [
    {
        id: "principles",
        title: "一、 中醫脈診基礎原理",
        icon: "🔬",
        description: "瞭解脈診的科學基礎、氣血循行，以及如何透過寸口脈感知全身臟腑的變化。",
        content: `
            <h2>中醫脈診基礎原理</h2>
            <p>中醫脈診，又稱「切脈」或「把脈」，是中醫「望聞問切」四診中極為關鍵的一環。它藉由醫生手指觸按患者寸口（橈動脈）的搏動情況，來探查體內臟腑功能、氣血盛衰及病邪性質。</p>
            
            <h3>1. 為什麼是「寸口脈」？</h3>
            <p>《難經·一難》提出：「寸口者，脈之大會，手太陰之動脈也。」寸口部位是肺經循行的部位，而肺朝百脈，全身各臟腑的氣血運送皆需經過肺氣的推動。因此，五臟六腑的生理病理變化，均會反映於寸口脈象中。</p>
            
            <div class="lecture-alert">
                <h5>💡 教學要點（獨處藏奸）：</h5>
                <p>切脈時要特別注意「獨異」之處。如果整體脈象平緩，但某一部位（如左關）突然顯現出極為弦硬或微弱的脈象，這就是「獨處藏奸」，提示該臟腑存在突出的病變。</p>
            </div>
            
            <h3>2. 脈診的生理基礎</h3>
            <ul>
                <li><strong>心主血脈：</strong> 心臟的搏動是脈搏產生的動力來源。</li>
                <li><strong>肺朝百脈：</strong> 肺氣的宣發肅降協調血脈循行。</li>
                <li><strong>脾統血、胃為後天之本：</strong> 脾胃化生的水穀精微是脈氣的物質基礎（所謂的「胃氣」）。</li>
                <li><strong>肝藏血、腎藏精：</strong> 提供脈管充足的濡養與元氣支持。</li>
            </ul>
        `,
        slides: [
            {
                title: "中醫脈診基礎原理",
                bullets: [
                    "脈診（切脈）是中醫「四診」之一，為辨證論治的重要依據。",
                    "寸口（橈動脈）為「脈之大會」，總覽全身氣血資訊。",
                    "肺朝百脈：五臟六腑之氣血皆經由肺流注全身，故寸口可反映全身生理病理。",
                    "把脈的核心思維：『胃、神、根』的評估，以及抓取『獨異脈』。"
                ]
            },
            {
                title: "脈搏產生的臟腑機制",
                bullets: [
                    "心：心主血脈，提供搏動的始動力與血管彈性。",
                    "肺：肺朝百脈，推動並調節血液運行。",
                    "脾胃：胃為後天之本，提供脈象中的「胃氣」（和緩、從容）。",
                    "肝腎：肝藏血疏泄，腎藏精化氣，決定脈之強弱與耐力（有根）。"
                ]
            }
        ]
    },
    {
        id: "depth_and_force",
        title: "二、 脈位深度 (A-E) 與力量 (1-5)",
        icon: "🌊",
        description: "掌握現代科學化脈位深度的劃分（A最淺、E最深）與按壓力量級數（1-5級）的臨床意義。",
        content: `
            <h2>脈位深度 (A-E) 與力量 (1-5)</h2>
            <p>在現代客觀化脈診中，我們將按脈的垂直位置與按壓力量進行數位化分級，以便進行精準的辨證分析：</p>
            
            <h3>1. 脈位深度層次 (A - E)</h3>
            <ul>
                <li><strong>A層 / B層（淺層）：</strong> 傳統之「浮脈」。輕手觸按即得，主病位在表，反映體表防禦與上焦氣血。</li>
                <li><strong>C層（中層/平脈）：</strong> 傳統之「中取」。為人體脾胃胃氣之所在，正常生理脈位。</li>
                <li><strong>D層 / E層（深層）：</strong> 傳統之「沉脈/伏脈」。重按至筋骨始得，主病位在裡，反映深層臟腑精血。</li>
            </ul>

            <h3>2. 力量級數 (1 - 5)</h3>
            <ul>
                <li><strong>1級 / 2級（無力）：</strong> 提示氣血不足、陽氣衰微，屬於「虛證」。</li>
                <li><strong>3級（中等力量）：</strong> 生理正常力量，脈搏和緩、有力而從容。</li>
                <li><strong>4級 / 5級（有力）：</strong> 提示邪氣亢盛、內熱、高壓或免疫對抗，屬於「實證/熱證」。</li>
            </ul>
            
            <div class="lecture-alert" style="background-color: rgba(99, 102, 241, 0.08); border-left-color: var(--color-info);">
                <h5>💡 教學指南：</h5>
                <p>脈象的深度反映了「病位」在表還是在裡，而力量的大小則反映了「人體正氣」與「外邪」的力量強弱（虛實）。兩者結合，即可快速斷定人體的基本體質與症狀類別。</p>
            </div>

            <h3>3. 獨異脈判定與六部位警訊對照表</h3>
            <p>以下為臨床上常用的「六部獨異脈、層級與力量對照總表」以及「判讀流程圖」，點擊圖片可放大檢視：</p>
            <div class="lecture-img-wrapper">
                <img src="./src/pulse-2.png" alt="六部獨異脈與判讀流程圖" class="zoomable-img">
            </div>
        `,
        slides: [
            {
                title: "脈位深度 (A-E) 與力量 (1-5)",
                bullets: [
                    "脈位深度 A 至 E：從最淺表 (A) 漸進至最深層 (E)。反映病變的部位。",
                    "力量級數 1 至 5：從最微弱 (1) 漸進至最充實有力 (5)。反映正邪盛衰（虛實）。",
                    "A/B 層 (淺層)：主表。反映肺衛與肌表防禦。",
                    "D/E 層 (深層)：主裡。反映內臟與精血狀態。",
                    "1/2 級 (無力)：主虛證。3 級：平脈。4/5 級 (有力)：主實證/熱證。"
                ]
            }
        ]
    },
    {
        id: "mapping_table",
        title: "三、 左右手脈象辨證對照矩陣",
        icon: "📋",
        description: "精細學習左右手（主氣/主血）在不同深度與力量組合下的辨證結果與臨床症狀對照表。",
        content: `
            <h2>左右手脈象辨證對照表</h2>
            <p>下表為本系統的核心診斷邏輯對照矩陣。臨床辨證時，先確認左手與右手各自的深度與力量，再進行交叉比對：</p>
            
            <table class="history-table" style="margin: 1.5rem 0; font-size: 0.85rem; line-height: 1.6;">
                <thead>
                    <tr>
                        <th style="width: 15%;">部位 (氣/血)</th>
                        <th style="width: 15%;">脈層深度</th>
                        <th style="width: 15%;">力量級數</th>
                        <th style="width: 20%;">狀態與對應證型</th>
                        <th>常見臨床症狀</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- 右手 -->
                    <tr>
                        <td rowspan="4"><strong>右手</strong><br><span style="color: var(--color-primary); font-size: 0.75rem;">(主氣/防禦/消化)</span></td>
                        <td rowspan="2">淺層 (A、B層)</td>
                        <td>無力 (1-2級)</td>
                        <td style="color: var(--color-primary); font-weight: 600;">表氣虛</td>
                        <td>容易疲倦、懶得講話、怕風怕冷、稍微活動就喘 (短氣)、反覆感冒。</td>
                    </tr>
                    <tr>
                        <td>有力 (4-5級)</td>
                        <td style="color: var(--color-accent); font-weight: 600;">表實熱</td>
                        <td>感冒發燒、全身發熱、伴隨怕冷與身體痠痛。</td>
                    </tr>
                    <tr>
                        <td rowspan="2">深層 (D、E層)</td>
                        <td>無力 (1-2級)</td>
                        <td style="color: var(--color-primary); font-weight: 600;">裡氣虛 (脾胃虛)</td>
                        <td>消化不良、食慾差、吃飽容易脹氣、排便軟散不成形或腹瀉。</td>
                    </tr>
                    <tr>
                        <td>有力 (4-5級)</td>
                        <td style="color: var(--color-accent); font-weight: 600;">裡實證 (腸胃阻滯)</td>
                        <td>嚴重脹氣、腸胃道緊縮、排便困難 (便祕)、胃酸逆流。</td>
                    </tr>
                    <!-- 左手 -->
                    <tr>
                        <td rowspan="4"><strong>左手</strong><br><span style="color: var(--color-info); font-size: 0.75rem;">(主血/神智/修復)</span></td>
                        <td rowspan="2">淺層 (A、B層)</td>
                        <td>無力 (1-2級)</td>
                        <td style="color: var(--color-primary); font-weight: 600;">表血虛</td>
                        <td>頭暈、頭痛、容易心悸與恐慌、眼睛疲勞模糊。</td>
                    </tr>
                    <tr>
                        <td>有力 (4-5級)</td>
                        <td style="color: var(--color-accent); font-weight: 600;">表實熱 (心火旺)</td>
                        <td>情緒煩躁、焦慮型失眠 (腦袋轉不停)、眼睛紅腫乾澀、容易嘴破與長痘痘。</td>
                    </tr>
                    <tr>
                        <td rowspan="2">深層 (D、E層)</td>
                        <td>無力 (1-2級)</td>
                        <td style="color: var(--color-primary); font-weight: 600;">裡血虛/腎陰虛</td>
                        <td>長期熬夜透支、腰痠腿軟、掉髮、淺眠多夢、缺乏血液潤滑的肌肉僵硬痠痛。</td>
                    </tr>
                    <tr>
                        <td>有力 (4-5級)</td>
                        <td style="color: var(--color-accent); font-weight: 600;">裡實證 (血管高壓)</td>
                        <td>長期高壓緊繃、高血壓、高血脂、心血管阻塞風險、慢性神經與肌肉疼痛。</td>
                    </tr>
                </tbody>
            </table>
            
            <div class="lecture-alert" style="background-color: rgba(244, 63, 94, 0.08); border-left-color: var(--color-accent);">
                <h5>⚠️ 教學引申（氣血失調）：</h5>
                <p>左右手脈象不對稱在臨床極為常見。例如左手呈現「深層+無力」（裡血虛/陰虛），右手呈現「淺層+有力」（表實熱），說明患者底子虛寒（陰血透支），表層卻有虛火外炎。若此時盲目使用寒涼藥退熱，會更傷元陰，應採用引火歸元、滋陰降火之法。</p>
            </div>

            <h3>3. 氣血不同層級與力量對應圖表</h3>
            <p>以下為氣血陰陽在不同脈位層級與力量級數下的辨證對應關係圖表，點擊可放大檢視：</p>
            <div class="lecture-img-wrapper">
                <img src="./src/pulse-1.png" alt="左右手脈象深度與力量對應表" class="zoomable-img">
            </div>
        `,
        slides: [
            {
                title: "右手主氣 (防禦/消化) 對照要點",
                bullets: [
                    "淺層無力 (A/B + 1/2) ── 表氣虛：神疲乏力、怕風、稍微活動就喘。",
                    "淺層有力 (A/B + 4/5) ── 表實熱：外感發熱、惡寒、全身痠痛。",
                    "深層無力 (D/E + 1/2) ── 裡氣虛：消化不良、吃飽易脹、便溏腹瀉。",
                    "深層有力 (D/E + 4/5) ── 裡實證：腹部脹痛、腸胃痙攣、便秘、反流。"
                ]
            },
            {
                title: "左手主血 (神智/修復) 對照要點",
                bullets: [
                    "淺層無力 (A/B + 1/2) ── 表血虛：腦部供血不足、頭暈頭痛、心悸易驚。",
                    "淺層有力 (A/B + 4/5) ── 表實熱：腦壓高、心火上炎、焦慮失眠、長痘嘴破。",
                    "深層無力 (D/E + 1/2) ── 裡血虛/腎陰虛：熬夜透支、腰痠腿軟、淺眠、筋肉僵硬。",
                    "深層有力 (D/E + 4/5) ── 裡實證：血管高壓、長期高壓繃緊、高血壓高血脂風險。"
                ]
            }
        ]
    },
    {
        id: "positions",
        title: "四, 寸關尺臟腑定位教學",
        icon: "✋",
        description: "學習左手與右手寸關尺部位的臟腑定位，理解左血右氣的診斷心法。",
        content: `
            <h2>寸關尺與臟腑定位</h2>
            <p>寸口脈分為「寸、關、尺」三部，兩手共六部脈。結合左右手，可以精確對應人體十二經絡與五臟六腑的氣血分布。</p>
            
            <h3>1. 左右手寸關尺臟腑對應</h3>
            <div class="result-organ-grid" style="margin: 1.5rem 0;">
                <div class="organ-bar-box">
                    <h4 style="color: var(--color-info); margin-bottom: 0.5rem;">左手 (主血、主陰)</h4>
                    <ul style="padding-left: 1.2rem; font-size: 0.85rem;">
                        <li><strong>寸部 (Cun)：</strong> 心、心包（反映心血管與精神神志）</li>
                        <li><strong>關部 (Guan)：</strong> 肝、膽（反映疏泄、情緒、藏血）</li>
                        <li><strong>尺部 (Chi)：</strong> 腎陰、膀胱、小腸（反映下焦生殖、水液）</li>
                    </ul>
                </div>
                <div class="organ-bar-box">
                    <h4 style="color: var(--color-primary); margin-bottom: 0.5rem;">右手 (主氣、主陽)</h4>
                    <ul style="padding-left: 1.2rem; font-size: 0.85rem;">
                        <li><strong>寸部 (Cun)：</strong> 肺、大腸（反映呼吸、皮毛、宗氣）</li>
                        <li><strong>關部 (Guan)：</strong> 脾、胃（反映消化、運化、中氣）</li>
                        <li><strong>尺部 (Chi)：</strong> 腎陽/命門、三焦（反映元氣、免疫、溫煦）</li>
                    </ul>
                </div>
            </div>
            
            <h3>2. 診斷心法：左血右氣</h3>
            <p>中醫脈診的基本原則是「左手主血，右手主氣」。</p>
            <ul>
                <li>若<strong>左手整體脈弱</strong>：多屬血虛、陰不足，如面色萎黃、心悸失眠。</li>
                <li>若<strong>右手整體脈弱</strong>：多屬氣虛、陽不足，如少氣懶言、手腳冰冷。</li>
            </ul>

            <h3>3. 寸關尺臟腑定位圖表</h3>
            <p>以下為寸關尺「右氣左血」臟腑定位與常見異常脈象對照表，點擊可放大檢視：</p>
            <div class="lecture-img-wrapper">
                <img src="./src/pulse-3.png" alt="中醫寸關尺臟腑定位表" class="zoomable-img">
            </div>
        `,
        slides: [
            {
                title: "寸關尺臟腑對應規律",
                bullets: [
                    "左寸：心 (心血管、大腦精神) ── 左關：肝膽 (情緒疏泄、藏血、筋膜)",
                    "左尺：腎陰 (生殖、骨髓、體液平衡)",
                    "右寸：肺 (呼吸系統、宗氣、衛外能力) ── 右關：脾胃 (運化、消化、水穀精微)",
                    "右尺：腎陽/命門 (溫煦、命門之火、內分泌)"
                ]
            },
            {
                title: "左血右氣與上中下三焦",
                bullets: [
                    "左手主血：反映血脈、津液、實質器官與精神。",
                    "右手主氣：反映功能、動力、氣化與熱量。",
                    "寸關尺三部對應三焦：寸部為上焦 (心肺)；關部為中焦 (肝脾胃)；尺部為下焦 (腎、膀胱)。"
                ]
            }
        ]
    },
    {
        id: "cases",
        title: "五、 臨床教學案例解析",
        icon: "🩺",
        description: "精選中醫脈診臨床教學案例，演示脈象、問診與調理建議的整合流程。",
        content: `
            <h2>臨床案例與調理建議</h2>
            <p>以下透過兩個典型臨床教學案例，展示脈診參數結合生活問診的辨證思路：</p>
            
            <div class="glass-card primary-edge" style="margin: 1.5rem 0; padding: 1.5rem;">
                <h4 style="color: var(--color-primary); margin-bottom: 0.5rem;">案例一：肝鬱乘脾、中焦氣虛證（木鬱克土）</h4>
                <p><strong>脈象特徵：</strong> 左手脈層居中但偏弦（左關弦），右手脈位偏深且無力（D層/1-2級，裡氣虛）。</p>
                <p><strong>生活問診：</strong> 患者自訴最近工作壓力大，情緒抑鬱易怒，且伴隨食慾不振、吃完飯易肚子脹痛、排便不實。此為典型的肝鬱克脾土。</p>
                <p><strong>調理建議：</strong> 疏肝理氣，健脾和胃。推薦茶飲「玫瑰薄荷茶」、「佛手柑茶」，並按壓<strong>太衝穴</strong>與<strong>足三里穴</strong>。</p>
            </div>
            
            <div class="glass-card accent-edge" style="margin: 1.5rem 0; padding: 1.5rem;">
                <h4 style="color: var(--color-accent); margin-bottom: 0.5rem;">案例二：長期熬夜、陰虛火旺證</h4>
                <p><strong>脈象特徵：</strong> 左手脈位偏深且無力（D層/1級，裡血虛），但左寸口跳動偏弦；右手總脈平順（C層/3級）。</p>
                <p><strong>生活問診：</strong> 患者長期熬夜透支，常覺腰痠腿軟、掉髮嚴重、且伴隨心煩失眠、口舌生瘡。</p>
                <p><strong>調理建議：</strong> 滋陰補腎，清心降火。推薦食療「百合蓮子銀耳湯」，並按壓<strong>太溪穴</strong>、<strong>神門穴</strong>與<strong>三陰交穴</strong>。</p>
            </div>
        `,
        slides: [
            {
                title: "案例一：肝鬱乘脾（木鬱克土）分析",
                bullets: [
                    "脈象：左手脈位居中、左關獨弦 (肝鬱)；右手脈位偏深且無力 (裡氣虛)。",
                    "症狀：工作壓力大，腹脹納差，情緒低落或焦慮，排便軟散。",
                    "病機：肝失條達，橫逆克脾，导致中焦氣機鬱滯，脾胃受損。",
                    "建議：疏肝健脾。穴位：太衝、足三里。茶飲：玫瑰佛手茶。"
                ]
            },
            {
                title: "案例二：陰虛火旺 (透支熱擾) 分析",
                bullets: [
                    "脈象：左手脈位偏深且無力 (裡血虛/腎陰虛)，左寸獨弦 (虛火擾心)。",
                    "症狀：長期熬夜、腰痠、掉髮、睡眠淺且心煩口瘡。",
                    "病機：熬夜傷陰，精血不足，陰不制陽而虛火偏亢上擾。",
                    "建議：滋陰降火。穴位：太溪、神門、三陰交。食療：百合銀耳粥。"
                ]
            }
        ]
    }
];

// 將數據導出，供 app.js 使用
window.LECTURE_DATA = LECTURE_DATA;
