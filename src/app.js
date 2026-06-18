/* ==========================================================================
   中醫脈診辨證與教學系統 - 主應用程式控制 (app.js)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 脈層深度與力量描述字串
    const DEPTH_LETTERS = ["A", "B", "C", "D", "E"];
    const DEPTH_DESCS = ["A層 (淺)", "B層 (半淺)", "C層 (中)", "D層 (半深)", "E層 (深)"];
    const FORCE_DESCS = ["1級 (弱)", "2級 (偏弱)", "3級 (中)", "4級 (有力)", "5級 (實)"];

    // 部位中文名稱對照
    const PART_NAMES = {
        leftCun: "左寸 (心)",
        leftGuan: "左關 (肝膽)",
        leftChi: "左尺 (腎陰)",
        rightCun: "右寸 (肺)",
        rightGuan: "右關 (脾胃)",
        rightChi: "右尺 (腎陽)"
    };

    // ==========================================
    // 1. 全局狀態宣告
    // ==========================================
    const state = {
        // 雙手整體基準 (Presets)
        leftDepth: 3,
        leftForce: 3,
        rightDepth: 3,
        rightForce: 3,
        
        // 6部位各自的獨立參數
        points: {
            leftCun: { depth: 3, force: 3 },
            leftGuan: { depth: 3, force: 3 },
            leftChi: { depth: 3, force: 3 },
            rightCun: { depth: 3, force: 3 },
            rightGuan: { depth: 3, force: 3 },
            rightChi: { depth: 3, force: 3 }
        },
        
        selectedPoint: null, // 當前點擊選中的部位代碼
        lifestyle: [],
        currentReport: null,
        history: [],
        
        // 講義與課件狀態
        currentChapterIndex: 0,
        currentSlideIndex: 0,
        pptModeActive: false,
        slidesList: []
    };

    // ==========================================
    // 2. DOM 元素選取
    // ==========================================
    // 導覽列與設定
    const navButtons = document.querySelectorAll(".nav-btn");
    const pageTabs = document.querySelectorAll(".page-tab");
    const themeToggle = document.getElementById("theme-toggle");
    const systemReset = document.getElementById("system-reset");
    const htmlElement = document.documentElement;

    // 總脈輸入項 (基準滑動條)
    const leftDepthRange = document.getElementById("left-depth-range");
    const leftForceRange = document.getElementById("left-force-range");
    const rightDepthRange = document.getElementById("right-depth-range");
    const rightForceRange = document.getElementById("right-force-range");

    const leftDepthVal = document.getElementById("left-depth-val");
    const leftForceVal = document.getElementById("left-force-val");
    const rightDepthVal = document.getElementById("right-depth-val");
    const rightForceVal = document.getElementById("right-force-val");

    // 互動式 SVG 脈點
    const pulsePoints = document.querySelectorAll(".pulse-point");

    // 🎯 當前部位設定面板
    const focusConfigPanel = document.getElementById("focus-config-panel");
    const focusPartName = document.getElementById("focus-part-name");
    const focusDepthRange = document.getElementById("focus-depth-range");
    const focusForceRange = document.getElementById("focus-force-range");
    const focusDepthVal = document.getElementById("focus-depth-val");
    const focusForceVal = document.getElementById("focus-force-val");
    const closeFocusPanelBtn = document.getElementById("close-focus-panel");
    const presetBtns = document.querySelectorAll(".preset-btn");

    // 診斷按鈕
    const resetInputsBtn = document.getElementById("reset-inputs-btn");
    const submitDiagnoseBtn = document.getElementById("submit-diagnose-btn");

    // 診斷報告輸出
    const resultPlaceholder = document.getElementById("result-placeholder");
    const resultContainer = document.getElementById("result-container");
    const resultSyndrome = document.getElementById("result-syndrome");
    const resultTime = document.getElementById("result-time");
    const resultPathology = document.getElementById("result-pathology");
    const resultDiet = document.getElementById("result-diet");
    const resultAcupoints = document.getElementById("result-acupoints");
    const resultLifestyle = document.getElementById("result-lifestyle");
    const saveReportBtn = document.getElementById("save-report-btn");

    // 講義系統
    const lectureMenu = document.getElementById("lecture-menu");
    const readerContent = document.getElementById("reader-content");
    const readProgress = document.getElementById("read-progress");
    const enterPptBtn = document.getElementById("enter-ppt-btn");
    const prevChapBtn = document.getElementById("prev-chap-btn");
    const nextChapBtn = document.getElementById("next-chap-btn");

    // 歷史紀錄
    const historyListBody = document.getElementById("history-list-body");
    const emptyHistoryTip = document.getElementById("empty-history-tip");
    const clearAllHistoryBtn = document.getElementById("clear-all-history-btn");

    // 穴位 Modal
    const acupointModal = document.getElementById("acupoint-modal");
    const modalPointName = document.getElementById("modal-point-name");
    const modalPointBody = document.getElementById("modal-point-body");
    const modalCloseBtn = document.getElementById("modal-close-btn");
    const modalConfirmBtn = document.getElementById("modal-confirm-btn");

    // PPT 投影模式
    const pptContainer = document.getElementById("ppt-container");
    const pptContentArea = document.getElementById("ppt-content-area");
    const exitPptBtn = document.getElementById("exit-ppt-btn");
    const pptPrevBtn = document.getElementById("ppt-prev-btn");
    const pptNextBtn = document.getElementById("ppt-next-btn");
    const pptPageIndicator = document.getElementById("ppt-page-indicator");

    // ==========================================
    // 3. 頁面分頁切換控制
    // ==========================================
    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            navButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const target = btn.getAttribute("data-target");
            pageTabs.forEach(tab => {
                if (tab.id === target) {
                    tab.classList.add("active");
                } else {
                    tab.classList.remove("active");
                }
            });

            if (target === "lectures") {
                renderLectureChapter(state.currentChapterIndex);
            }
            if (target === "history") {
                renderHistoryTable();
            }
        });
    });

    // ==========================================
    // 4. 深淺色模式切換 & 系統重置
    // ==========================================
    themeToggle.addEventListener("click", () => {
        const currentTheme = htmlElement.getAttribute("data-theme");
        if (currentTheme === "dark") {
            htmlElement.setAttribute("data-theme", "light");
            themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        } else {
            htmlElement.setAttribute("data-theme", "dark");
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    });

    systemReset.addEventListener("click", () => {
        if (confirm("您確定要將所有把脈參數重設為正常平脈，並清空歷史紀錄嗎？")) {
            localStorage.clear();
            state.history = [];
            resetAllInputs();
            renderHistoryTable();
            navButtons[0].click();
            alert("系統已成功重置為正常平脈設定！");
        }
    });

    // ==========================================
    // 5. 總脈基準 (Preset Sliders) 連動控制
    // ==========================================
    
    // 更新單一部位脈象的 SVG 文字標記與異常狀態
    function updatePointSVGLabel(pos) {
        const pData = state.points[pos];
        const depthChar = DEPTH_LETTERS[pData.depth - 1];
        const forceNum = pData.force;
        
        // 更新 SVG 文字
        const hyphenatedPos = pos.replace(/([A-Z])/g, "-$1").toLowerCase();
        const textElement = document.getElementById(`badge-${hyphenatedPos}`);
        if (textElement) {
            textElement.textContent = `${depthChar}${forceNum}`;
        }

        // 更新右側摘要看板的值
        const summaryElement = document.getElementById(`summary-${hyphenatedPos}`);
        if (summaryElement) {
            summaryElement.textContent = `${depthChar}${forceNum}`;
            if (pData.depth !== 3 || pData.force !== 3) {
                summaryElement.className = "summary-badge-val abnormal";
            } else {
                summaryElement.className = "summary-badge-val normal";
            }
        }

        // 更新 SVG 脈點紅圈 (若偏離 C3，則標記為異常獨異脈)
        const pointGroup = document.getElementById(`point-${hyphenatedPos}`);
        if (pointGroup) {
            if (pData.depth !== 3 || pData.force !== 3) {
                pointGroup.classList.add("abnormal");
            } else {
                pointGroup.classList.remove("abnormal");
            }
        }
    }

    // 左手總脈滑動器連動
    leftDepthRange.addEventListener("input", (e) => {
        const val = parseInt(e.target.value);
        state.leftDepth = val;
        leftDepthVal.textContent = DEPTH_DESCS[val - 1];
        
        // 批次更新左手寸關尺
        ["leftCun", "leftGuan", "leftChi"].forEach(pos => {
            state.points[pos].depth = val;
            updatePointSVGLabel(pos);
        });

        // 如果目前選中左手部位，連帶更新設定面板
        if (state.selectedPoint && state.selectedPoint.startsWith("left")) {
            loadSelectedPointConfig(state.selectedPoint);
            updateFocusPanelResult(state.selectedPoint);
        }
    });

    leftForceRange.addEventListener("input", (e) => {
        const val = parseInt(e.target.value);
        state.leftForce = val;
        leftForceVal.textContent = FORCE_DESCS[val - 1];
        
        // 批次更新左手寸關尺
        ["leftCun", "leftGuan", "leftChi"].forEach(pos => {
            state.points[pos].force = val;
            updatePointSVGLabel(pos);
        });

        if (state.selectedPoint && state.selectedPoint.startsWith("left")) {
            loadSelectedPointConfig(state.selectedPoint);
            updateFocusPanelResult(state.selectedPoint);
        }
    });

    // 右手總脈滑動器連動
    rightDepthRange.addEventListener("input", (e) => {
        const val = parseInt(e.target.value);
        state.rightDepth = val;
        rightDepthVal.textContent = DEPTH_DESCS[val - 1];
        
        // 批次更新右手寸關尺
        ["rightCun", "rightGuan", "rightChi"].forEach(pos => {
            state.points[pos].depth = val;
            updatePointSVGLabel(pos);
        });

        if (state.selectedPoint && state.selectedPoint.startsWith("right")) {
            loadSelectedPointConfig(state.selectedPoint);
            updateFocusPanelResult(state.selectedPoint);
        }
    });

    rightForceRange.addEventListener("input", (e) => {
        const val = parseInt(e.target.value);
        state.rightForce = val;
        rightForceVal.textContent = FORCE_DESCS[val - 1];
        
        // 批次更新右手寸關尺
        ["rightCun", "rightGuan", "rightChi"].forEach(pos => {
            state.points[pos].force = val;
            updatePointSVGLabel(pos);
        });

        if (state.selectedPoint && state.selectedPoint.startsWith("right")) {
            loadSelectedPointConfig(state.selectedPoint);
            updateFocusPanelResult(state.selectedPoint);
        }
    });

    // ==========================================
    // 6. 互動式 SVG 脈位點選與微調面板連動
    // ==========================================
    pulsePoints.forEach(point => {
        point.addEventListener("click", () => {
            // 1. 清除所有選中高亮
            pulsePoints.forEach(p => p.classList.remove("selected"));
            
            // 2. 高亮當前點擊部位
            point.classList.add("selected");

            // 3. 獲取部位代號，展示設定面板
            const pos = point.getAttribute("data-pos");
            state.selectedPoint = pos;
            loadSelectedPointConfig(pos);
            updateFocusPanelResult(pos);
        });
    });

    // 載入所選部位的參數到微調面板
    function loadSelectedPointConfig(pos) {
        const pData = state.points[pos];
        focusConfigPanel.style.display = "block";
        focusPartName.textContent = PART_NAMES[pos];
        
        focusDepthRange.value = pData.depth;
        focusDepthVal.textContent = DEPTH_DESCS[pData.depth - 1];
        
        focusForceRange.value = pData.force;
        focusForceVal.textContent = FORCE_DESCS[pData.force - 1];
    }

    // 更新微調面板中的當前部位診斷結果
    function updateFocusPanelResult(pos) {
        if (!pos) return;
        const pData = state.points[pos];
        if (!pData) return;

        const depthChar = DEPTH_LETTERS[pData.depth - 1];
        const forceNum = pData.force;

        // 呼叫演算法引擎獲取部位脈象診斷
        const status = PulseEngine.getPointStatus(pos, pData.depth, pData.force);

        const badgeEl = document.getElementById("focus-result-badge");
        const stateEl = document.getElementById("focus-result-state");
        const descEl = document.getElementById("focus-result-desc");

        if (badgeEl) {
            badgeEl.textContent = `${depthChar}${forceNum}`;
            if (pData.depth !== 3 || pData.force !== 3) {
                badgeEl.style.color = "var(--color-accent)";
                badgeEl.style.borderColor = "rgba(var(--color-accent-rgb), 0.2)";
            } else {
                badgeEl.style.color = "var(--color-primary)";
                badgeEl.style.borderColor = "var(--border-color)";
            }
        }

        if (stateEl) {
            stateEl.textContent = status.state || "正常";
            stateEl.className = `organ-status-tag ${status.type || 'normal'}`;
        }

        if (descEl) {
            descEl.textContent = status.desc || "脈象平穩。";
            if (status.type === "normal") {
                descEl.style.borderLeftColor = "var(--color-primary)";
            } else if (status.type === "deficient") {
                descEl.style.borderLeftColor = "var(--color-warning)";
            } else {
                descEl.style.borderLeftColor = "var(--color-accent)";
            }
        }
    }

    // 當在微調面板調整深度滑動條時
    focusDepthRange.addEventListener("input", (e) => {
        if (!state.selectedPoint) return;
        const val = parseInt(e.target.value);
        state.points[state.selectedPoint].depth = val;
        focusDepthVal.textContent = DEPTH_DESCS[val - 1];
        updatePointSVGLabel(state.selectedPoint);
        updateFocusPanelResult(state.selectedPoint);
    });

    // 當在微調面板調整力量滑動條時
    focusForceRange.addEventListener("input", (e) => {
        if (!state.selectedPoint) return;
        const val = parseInt(e.target.value);
        state.points[state.selectedPoint].force = val;
        focusForceVal.textContent = FORCE_DESCS[val - 1];
        updatePointSVGLabel(state.selectedPoint);
        updateFocusPanelResult(state.selectedPoint);
    });

    // 關閉微調面板
    closeFocusPanelBtn.addEventListener("click", () => {
        focusConfigPanel.style.display = "none";
        state.selectedPoint = null;
        pulsePoints.forEach(p => p.classList.remove("selected"));
    });

    // 快捷預設按鈕綁定 (弦脈、細脈等)
    presetBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            if (!state.selectedPoint) {
                alert("請先在上方手腕圖點擊選取一個部位！");
                return;
            }
            const depth = parseInt(btn.getAttribute("data-depth"));
            const force = parseInt(btn.getAttribute("data-force"));
            
            // 寫入狀態
            state.points[state.selectedPoint].depth = depth;
            state.points[state.selectedPoint].force = force;
            
            // 更新 UI
            focusDepthRange.value = depth;
            focusDepthVal.textContent = DEPTH_DESCS[depth - 1];
            focusForceRange.value = force;
            focusForceVal.textContent = FORCE_DESCS[force - 1];
            
            updatePointSVGLabel(state.selectedPoint);
            updateFocusPanelResult(state.selectedPoint);
        });
    });

    // 清空重置分析器輸入
    function resetAllInputs() {
        // 重設左手基準
        leftDepthRange.value = 3;
        leftForceRange.value = 3;
        leftDepthVal.textContent = DEPTH_DESCS[2];
        leftForceVal.textContent = FORCE_DESCS[2];
        state.leftDepth = 3;
        state.leftForce = 3;

        // 重設右手基準
        rightDepthRange.value = 3;
        rightForceRange.value = 3;
        rightDepthVal.textContent = DEPTH_DESCS[2];
        rightForceVal.textContent = FORCE_DESCS[2];
        state.rightDepth = 3;
        state.rightForce = 3;

        // 重設6部位為 C3 (正常平脈)
        for (const pos in state.points) {
            state.points[pos].depth = 3;
            state.points[pos].force = 3;
            updatePointSVGLabel(pos);
        }

        // 隱藏微調面板
        focusConfigPanel.style.display = "none";
        state.selectedPoint = null;
        pulsePoints.forEach(p => p.classList.remove("selected"));

        // 重設問診勾選
        const checkboxes = document.querySelectorAll('input[name="lifestyle"]');
        checkboxes.forEach(cb => cb.checked = false);
        state.lifestyle = [];

        // 隱藏結果，顯示占位
        resultContainer.style.display = "none";
        resultPlaceholder.style.display = "block";
        state.currentReport = null;
    }

    resetInputsBtn.addEventListener("click", resetAllInputs);

    // ==========================================
    // 7. 診斷與辨證計算
    // ==========================================
    submitDiagnoseBtn.addEventListener("click", () => {
        // 收集勾選的生活感受
        const checkedLifestyle = [];
        const checkboxes = document.querySelectorAll('input[name="lifestyle"]:checked');
        checkboxes.forEach(cb => checkedLifestyle.push(cb.value));
        state.lifestyle = checkedLifestyle;

        // 封裝輸入參數 (包含 6 部位各自的 Depth & Force)
        const diagnosticInput = {
            leftCunDepth: state.points.leftCun.depth,
            leftCunForce: state.points.leftCun.force,
            leftGuanDepth: state.points.leftGuan.depth,
            leftGuanForce: state.points.leftGuan.force,
            leftChiDepth: state.points.leftChi.depth,
            leftChiForce: state.points.leftChi.force,

            rightCunDepth: state.points.rightCun.depth,
            rightCunForce: state.points.rightCun.force,
            rightGuanDepth: state.points.rightGuan.depth,
            rightGuanForce: state.points.rightGuan.force,
            rightChiDepth: state.points.rightChi.depth,
            rightChiForce: state.points.rightChi.force,

            lifestyle: state.lifestyle
        };

        // 調用診斷引擎
        const report = PulseEngine.diagnose(diagnosticInput);
        state.currentReport = report;

        // 渲染診斷報告
        renderDiagnosisReport(report);
    });

    function renderDiagnosisReport(report) {
        resultPlaceholder.style.display = "none";
        resultContainer.style.display = "block";

        // 設定證型名稱與狀態色
        resultSyndrome.textContent = report.syndrome;
        if (report.isAbnormal) {
            resultSyndrome.className = "syndrome-badge abnormal";
        } else {
            resultSyndrome.className = "syndrome-badge";
        }

        const now = new Date();
        const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        resultTime.textContent = `診斷時間: ${formattedTime}`;

        // 渲染五臟氣血狀態文字標籤 (取代原先看不懂的百分比)
        for (const [organ, obj] of Object.entries(report.organStates)) {
            const statusTag = document.getElementById(`status-${organ}`);
            if (statusTag) {
                statusTag.textContent = obj.state;
                // 設定狀態顏色樣式
                statusTag.className = `organ-status-tag ${obj.type}`;
            }
        }

        // 解讀文本與建議
        resultPathology.innerHTML = report.pathology;
        resultDiet.textContent = report.diet;
        resultLifestyle.textContent = report.lifestyle;

        // 渲染推薦穴位 Badges
        resultAcupoints.innerHTML = "";
        report.acupoints.forEach(point => {
            const badge = document.createElement("span");
            badge.className = "acupoint-badge";
            badge.innerHTML = `<i class="fa-solid fa-location-pin"></i> ${point.name}`;
            
            badge.addEventListener("click", () => {
                showAcupointModal(point);
            });
            resultAcupoints.appendChild(badge);
        });

        // 渲染《瀕湖脈學》對照表格
        renderBinhuTable(state.points);

        // 滾動至報告
        resultContainer.scrollIntoView({ behavior: "smooth" });
    }

    // ==========================================
    // 7.5 《瀕湖脈學》對照表格渲染
    // ==========================================
    function renderBinhuTable(points) {
        const container = document.getElementById("binhu-table-container");
        if (!container) return;

        const DEPTH_LETTERS = ["A", "B", "C", "D", "E"];
        const posInfos = [
            { key: "leftCun",   label: "左寸", organ: "心/腦" },
            { key: "leftGuan",  label: "左關", organ: "肝膽" },
            { key: "leftChi",   label: "左尺", organ: "腎陰" },
            { key: "rightCun",  label: "右寸", organ: "肺" },
            { key: "rightGuan", label: "右關", organ: "脾胃" },
            { key: "rightChi",  label: "右尺", organ: "腎陽" }
        ];

        let rows = posInfos.map(info => {
            const p = points[info.key];
            const d = parseInt(p.depth);
            const f = parseInt(p.force);
            const depthLetter = DEPTH_LETTERS[d - 1];
            const binhuName = PulseEngine.getBinhuPulseName(d, f);
            const binhuDesc = PulseEngine.getBinhuPulseDesc(d, f);
            const isNormal = (d === 3 && f === 3);

            const codeClass = isNormal ? "binhu-code normal" : "binhu-code abnormal";
            const pulseClass = isNormal ? "binhu-pulse-name normal" : "binhu-pulse-name";

            return `
                <tr>
                    <td style="white-space:nowrap; font-weight:600; font-size:0.8rem;">${info.label}<br><span style="font-weight:400; font-size:0.72rem; color:var(--text-muted);">(${info.organ})</span></td>
                    <td><span class="${codeClass}">${depthLetter}${f}</span></td>
                    <td><span class="${pulseClass}">${binhuName}</span><br><span style="font-size:0.68rem; color:var(--text-muted);">${binhuDesc.category} · ${binhuDesc.nature}</span></td>
                    <td style="font-size:0.7rem; color:var(--text-secondary); line-height:1.4;">${binhuDesc.zangfu}</td>
                </tr>
            `;
        }).join("");

        container.innerHTML = `
            <table class="binhu-table">
                <thead>
                    <tr>
                        <th>部位</th>
                        <th>編碼</th>
                        <th>《瀕湖脈學》脈象</th>
                        <th>主臟腑</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        `;
    }

    // 複製到 Gemini 按鈕
    const copyToGeminiBtn = document.getElementById("copy-to-gemini-btn");
    if (copyToGeminiBtn) {
        copyToGeminiBtn.addEventListener("click", () => {
            if (!state.currentReport) {
                alert("請先點擊「開始辨證診斷」產生診斷報告！");
                return;
            }
            const promptText = PulseEngine.generateGeminiPrompt(
                state.points,
                state.lifestyle,
                state.currentReport
            );
            // 複製到剪貼簿
            navigator.clipboard.writeText(promptText).then(() => {
                showToast("✅ 《瀕湖脈學》提示詞已複製！請貼到 Gemini 進行深度解讀。", "success");
            }).catch(() => {
                // fallback for older browsers
                const ta = document.createElement("textarea");
                ta.value = promptText;
                ta.style.position = "fixed";
                ta.style.opacity = "0";
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                document.body.removeChild(ta);
                showToast("✅ 《瀕湖脈學》提示詞已複製！請貼到 Gemini 進行深度解讀。", "success");
            });
        });
    }

    // 吐司通知函數
    function showToast(message, type = "success") {
        const existing = document.getElementById("toast-notification");
        if (existing) existing.remove();

        const toast = document.createElement("div");
        toast.id = "toast-notification";
        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: ${type === "success" ? "linear-gradient(135deg, #059669, #10b981)" : "linear-gradient(135deg, #dc2626, #ef4444)"};
            color: white;
            padding: 1rem 1.75rem;
            border-radius: 50px;
            font-size: 0.9rem;
            font-weight: 600;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            z-index: 99999;
            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            white-space: nowrap;
            max-width: 90vw;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                toast.style.transform = "translateX(-50%) translateY(0)";
            });
        });

        setTimeout(() => {
            toast.style.transform = "translateX(-50%) translateY(100px)";
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }

    // ==========================================
    // 8. 穴位 Modal 彈窗控制
    // ==========================================
    function showAcupointModal(point) {
        modalPointName.textContent = point.name;
        modalPointBody.innerHTML = `
            <h5>📍 精確位置：</h5>
            <p>${point.desc.split("。")[0]}。</p>
            <h5 style="margin-top: 1rem;">🩹 臨床調理主治：</h5>
            <p>${point.desc.split("。")[1] || "保健、增強人體防禦。"}</p>
            <h5 style="margin-top: 1rem;">💆 按摩指引：</h5>
            <p>使用大拇指揉壓此穴位，以有酸脹感為宜。每次持續按壓 2-3 分鐘，每日早晚各一次，配合深呼吸效果更佳。</p>
        `;
        acupointModal.classList.add("active");
    }

    function closeAcupointModal() {
        acupointModal.classList.remove("active");
    }

    modalCloseBtn.addEventListener("click", closeAcupointModal);
    modalConfirmBtn.addEventListener("click", closeAcupointModal);
    acupointModal.addEventListener("click", (e) => {
        if (e.target === acupointModal) closeAcupointModal();
    });

    // ==========================================
    // 9. 保存診斷紀錄至 LocalStorage
    // ==========================================
    saveReportBtn.addEventListener("click", () => {
        if (!state.currentReport) return;

        const now = new Date();
        const timestamp = now.toLocaleString();
        
        // 構造儲存紀錄 (保存 6 部位 Depth 與 Force)
        const newRecord = {
            id: Date.now(),
            time: timestamp,
            syndrome: state.currentReport.syndrome,
            isAbnormal: state.currentReport.isAbnormal,
            inputs: {
                leftDepth: state.leftDepth,
                leftForce: state.leftForce,
                rightDepth: state.rightDepth,
                rightForce: state.rightForce,
                // 精細6部位
                points: JSON.parse(JSON.stringify(state.points)),
                lifestyle: [...state.lifestyle]
            }
        };

        state.history.unshift(newRecord);
        localStorage.setItem("pulse_history", JSON.stringify(state.history));
        alert("🎉 診斷報告已成功保存至『診斷紀錄』分頁！");
    });

    // 渲染歷史紀錄表格
    function renderHistoryTable() {
        const localData = localStorage.getItem("pulse_history");
        state.history = localData ? JSON.parse(localData) : [];

        historyListBody.innerHTML = "";

        if (state.history.length === 0) {
            emptyHistoryTip.style.display = "block";
            return;
        }

        emptyHistoryTip.style.display = "none";

        state.history.forEach(record => {
            const tr = document.createElement("tr");

            // 格式化 6 部位參數顯示
            const pts = record.inputs.points || {};
            const formatPoint = (pos) => {
                const p = pts[pos] || { depth: 3, force: 3 };
                return `${DEPTH_LETTERS[p.depth - 1]}${p.force}`;
            };
            
            const leftStr = `寸(${formatPoint("leftCun")}) 關(${formatPoint("leftGuan")}) 尺(${formatPoint("leftChi")})`;
            const rightStr = `寸(${formatPoint("rightCun")}) 關(${formatPoint("rightGuan")}) 尺(${formatPoint("rightChi")})`;

            // 找出異常的獨異脈標記
            const abnormalDetails = [];
            for (const [pos, pData] of Object.entries(pts)) {
                if (pData.depth !== 3 || pData.force !== 3) {
                    const posCh = getChinesePositionName(pos);
                    abnormalDetails.push(`${posCh}(${DEPTH_LETTERS[pData.depth - 1]}${pData.force})`);
                }
            }
            const abnormalStr = abnormalDetails.length > 0 ? abnormalDetails.join(", ") : "無明顯獨異";

            tr.innerHTML = `
                <td>${record.time}</td>
                <td>
                    <div style="font-size: 0.75rem; font-family: monospace;">左: ${leftStr}</div>
                    <div style="font-size: 0.75rem; font-family: monospace;">右: ${rightStr}</div>
                </td>
                <td><span style="font-size: 0.8rem; color: ${abnormalDetails.length > 0 ? 'var(--color-accent)' : 'var(--text-secondary)'}">${abnormalStr}</span></td>
                <td>
                    <span class="history-badge ${record.isAbnormal ? 'abnormal' : 'normal'}">
                        ${record.syndrome}
                    </span>
                </td>
                <td>
                    <button class="btn btn-secondary load-history-btn" data-id="${record.id}" style="display:inline-flex; width:auto; padding: 0.35rem 0.75rem; font-size: 0.8rem; margin-right: 0.5rem;">
                        <i class="fa-solid fa-folder-open"></i> 查看
                    </button>
                    <button class="btn btn-secondary delete-history-btn" data-id="${record.id}" style="display:inline-flex; width:auto; padding: 0.35rem 0.75rem; font-size: 0.8rem; color: var(--color-accent); border-color: rgba(var(--color-accent-rgb), 0.2)">
                        <i class="fa-solid fa-trash"></i> 刪除
                    </button>
                </td>
            `;

            tr.querySelector(".load-history-btn").addEventListener("click", () => {
                loadHistoryRecord(record);
            });

            tr.querySelector(".delete-history-btn").addEventListener("click", () => {
                deleteHistoryRecord(record.id);
            });

            historyListBody.appendChild(tr);
        });
    }

    function getChinesePositionName(pos) {
        const mapping = {
            leftCun: "左寸",
            leftGuan: "左關",
            leftChi: "左尺",
            rightCun: "右寸",
            rightGuan: "右關",
            rightChi: "右尺"
        };
        return mapping[pos] || pos;
    }

    function loadHistoryRecord(record) {
        // 設定雙手基準值
        state.leftDepth = record.inputs.leftDepth || 3;
        state.leftForce = record.inputs.leftForce || 3;
        state.rightDepth = record.inputs.rightDepth || 3;
        state.rightForce = record.inputs.rightForce || 3;

        leftDepthRange.value = state.leftDepth;
        leftDepthVal.textContent = DEPTH_DESCS[state.leftDepth - 1];
        leftForceRange.value = state.leftForce;
        leftForceVal.textContent = FORCE_DESCS[state.leftForce - 1];

        rightDepthRange.value = state.rightDepth;
        rightDepthVal.textContent = DEPTH_DESCS[state.rightDepth - 1];
        rightForceRange.value = state.rightForce;
        rightForceVal.textContent = FORCE_DESCS[state.rightForce - 1];

        // 設定 6 部位細部值
        state.points = JSON.parse(JSON.stringify(record.inputs.points || {}));
        for (const pos in state.points) {
            updatePointSVGLabel(pos);
        }

        // 關閉選取微調面板
        focusConfigPanel.style.display = "none";
        state.selectedPoint = null;
        pulsePoints.forEach(p => p.classList.remove("selected"));

        // 設定問診
        const checkedLifestyle = record.inputs.lifestyle || [];
        const checkboxes = document.querySelectorAll('input[name="lifestyle"]');
        checkboxes.forEach(cb => {
            cb.checked = checkedLifestyle.includes(cb.value);
        });
        state.lifestyle = checkedLifestyle;

        // 執行診斷
        const diagnosticInput = {
            leftCunDepth: state.points.leftCun.depth,
            leftCunForce: state.points.leftCun.force,
            leftGuanDepth: state.points.leftGuan.depth,
            leftGuanForce: state.points.leftGuan.force,
            leftChiDepth: state.points.leftChi.depth,
            leftChiForce: state.points.leftChi.force,

            rightCunDepth: state.points.rightCun.depth,
            rightCunForce: state.points.rightCun.force,
            rightGuanDepth: state.points.rightGuan.depth,
            rightGuanForce: state.points.rightGuan.force,
            rightChiDepth: state.points.rightChi.depth,
            rightChiForce: state.points.rightChi.force,

            lifestyle: state.lifestyle
        };

        const report = PulseEngine.diagnose(diagnosticInput);
        state.currentReport = report;
        renderDiagnosisReport(report);

        // 切換分頁
        navButtons[0].click();
        alert("已成功載入歷史精細脈象參數！");
    }

    function deleteHistoryRecord(id) {
        if (confirm("您確定要刪除這條診斷紀錄嗎？")) {
            state.history = state.history.filter(r => r.id !== id);
            localStorage.setItem("pulse_history", JSON.stringify(state.history));
            renderHistoryTable();
        }
    }

    clearAllHistoryBtn.addEventListener("click", () => {
        if (state.history.length === 0) return;
        if (confirm("您確定要清空所有歷史診斷紀錄嗎？（此操作不可逆）")) {
            state.history = [];
            localStorage.setItem("pulse_history", JSON.stringify(state.history));
            renderHistoryTable();
        }
    });

    // ==========================================
    // 10. 專業講義與課件閱讀器控制
    // ==========================================
    function initLectureMenu() {
        lectureMenu.innerHTML = "";
        LECTURE_DATA.forEach((chap, idx) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <button class="menu-item-btn ${idx === state.currentChapterIndex ? 'active' : ''}" data-idx="${idx}">
                    <span>${chap.icon}</span> ${chap.title.split(" ")[0]} ${chap.title.split(" ").slice(1).join(" ")}
                </button>
            `;
            
            li.querySelector("button").addEventListener("click", () => {
                state.currentChapterIndex = idx;
                document.querySelectorAll(".menu-item-btn").forEach(btn => btn.classList.remove("active"));
                li.querySelector("button").classList.add("active");
                renderLectureChapter(idx);
            });
            
            lectureMenu.appendChild(li);
        });
    }

    function renderLectureChapter(idx) {
        state.currentChapterIndex = idx;
        const chap = LECTURE_DATA[idx];
        if (!chap) return;

        readerContent.innerHTML = chap.content;

        const progressPercent = ((idx + 1) / LECTURE_DATA.length) * 100;
        readProgress.style.width = progressPercent + "%";

        prevChapBtn.disabled = idx === 0;
        nextChapBtn.disabled = idx === LECTURE_DATA.length - 1;
        prevChapBtn.style.opacity = idx === 0 ? "0.3" : "1";
        nextChapBtn.style.opacity = idx === LECTURE_DATA.length - 1 ? "0.3" : "1";
    }

    prevChapBtn.addEventListener("click", () => {
        if (state.currentChapterIndex > 0) {
            state.currentChapterIndex--;
            updateActiveSidebarMenu();
            renderLectureChapter(state.currentChapterIndex);
        }
    });

    nextChapBtn.addEventListener("click", () => {
        if (state.currentChapterIndex < LECTURE_DATA.length - 1) {
            state.currentChapterIndex++;
            updateActiveSidebarMenu();
            renderLectureChapter(state.currentChapterIndex);
        }
    });

    function updateActiveSidebarMenu() {
        const buttons = document.querySelectorAll(".menu-item-btn");
        buttons.forEach((btn, idx) => {
            if (idx === state.currentChapterIndex) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
    }

    // ==========================================
    // 11. PPT 教學投影簡報模式控制
    // ==========================================
    function enterPresentationMode() {
        const chap = LECTURE_DATA[state.currentChapterIndex];
        if (!chap || !chap.slides || chap.slides.length === 0) {
            alert("此講義章節暫無設計投影片課件！");
            return;
        }

        state.slidesList = chap.slides;
        state.currentSlideIndex = 0;
        state.pptModeActive = true;

        pptContainer.style.display = "flex";
        renderSlide(0);
    }

    function renderSlide(slideIdx) {
        state.currentSlideIndex = slideIdx;
        const slide = state.slidesList[slideIdx];
        if (!slide) return;

        pptContentArea.innerHTML = `
            <h2>${slide.title}</h2>
            <ul style="margin-top: 2.5rem; display: flex; flex-direction: column; gap: 1.5rem;">
                ${slide.bullets.map(b => `<li style="font-size: 1.6rem; color: var(--text-primary); line-height: 1.6; margin-bottom: 0.5rem;"><i class="fa-solid fa-yin-yang" style="color: var(--color-primary); margin-right: 1rem; font-size: 1.2rem;"></i> ${b}</li>`).join("")}
            </ul>
        `;

        pptPageIndicator.textContent = `第 ${slideIdx + 1} / ${state.slidesList.length} 頁`;

        pptPrevBtn.disabled = slideIdx === 0;
        pptNextBtn.disabled = slideIdx === state.slidesList.length - 1;
        pptPrevBtn.style.opacity = slideIdx === 0 ? "0.3" : "1";
        pptNextBtn.style.opacity = slideIdx === state.slidesList.length - 1 ? "0.3" : "1";
    }

    function exitPresentationMode() {
        state.pptModeActive = false;
        pptContainer.style.display = "none";
    }

    enterPptBtn.addEventListener("click", enterPresentationMode);
    exitPptBtn.addEventListener("click", exitPresentationMode);

    pptPrevBtn.addEventListener("click", () => {
        if (state.currentSlideIndex > 0) {
            renderSlide(state.currentSlideIndex - 1);
        }
    });

    pptNextBtn.addEventListener("click", () => {
        if (state.currentSlideIndex < state.slidesList.length - 1) {
            renderSlide(state.currentSlideIndex + 1);
        }
    });

    document.addEventListener("keydown", (e) => {
        if (!state.pptModeActive) return;

        if (e.key === "ArrowRight") {
            if (state.currentSlideIndex < state.slidesList.length - 1) {
                renderSlide(state.currentSlideIndex + 1);
            }
        } else if (e.key === "ArrowLeft") {
            if (state.currentSlideIndex > 0) {
                renderSlide(state.currentSlideIndex - 1);
            }
        } else if (e.key === "Escape") {
            exitPresentationMode();
        }
    });

    // ==========================================
    // 11.5 講義圖片大圖檢視彈窗控制
    // ==========================================
    const imgPreviewModal = document.getElementById("image-preview-modal");
    const imgPreviewImg = document.getElementById("image-preview-img");
    const imgPreviewTitle = document.getElementById("image-preview-title");
    const imgPreviewClose = document.getElementById("image-preview-close");

    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("zoomable-img")) {
            if (imgPreviewModal && imgPreviewImg && imgPreviewTitle) {
                imgPreviewImg.src = e.target.src;
                imgPreviewTitle.textContent = e.target.alt || "圖片預覽";
                imgPreviewModal.classList.add("active");
            }
        }
    });

    if (imgPreviewClose && imgPreviewModal) {
        const closeImgModal = () => {
            imgPreviewModal.classList.remove("active");
        };
        imgPreviewClose.addEventListener("click", closeImgModal);
        imgPreviewModal.addEventListener("click", (e) => {
            if (e.target === imgPreviewModal) {
                closeImgModal();
            }
        });
    }

    // ==========================================
    // 12. 系統初始化
    // ==========================================
    function init() {
        const localData = localStorage.getItem("pulse_history");
        state.history = localData ? JSON.parse(localData) : [];

        initLectureMenu();
        renderLectureChapter(0);

        resetAllInputs();
    }

    init();
});