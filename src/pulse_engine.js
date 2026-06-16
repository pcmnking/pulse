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
