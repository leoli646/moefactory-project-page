"use strict";

document.documentElement.classList.add("js");

// Columns: label, downstream accuracy (%), MMLU-Pro Δ (pp), IFEval Δ (pp), highlight.
// Values are transcribed from the original figures' "Average (6 cells)" rows.
const chartData = {
  position: { rows: [["Experts only", 68.6, -3.3, -3.6, true], ["Experts + router", 68.1, -2.0, -3.6], ["Attention + experts", 67.0, -1.8, -1.0], ["Attention only", 61.7, -10.4, -7.9]], note: "Comparable-budget configurations; selected rows." },
  granularity: { rows: [["Weight · rank 2", 69.1, -0.9, -3.4], ["Weight · rank 1", 68.5, 0.8, -1.4, true], ["Module bypass", 68.4, -0.5, -3.7], ["Expert bypass", 64.7, -5.0, -4.6]], note: "Rank one has the strongest retention profile here." },
  method: { rows: [["Weight-level LoRA", 68.5, 0.8, -1.4, true], ["DoRA", 68.5, 0.8, -1.1, true], ["MoE-LoRA", 65.7, -1.0, -5.6], ["OFT", 60.8, 0.7, -0.2], ["FourierFT", 43.6, 0.3, -1.2], ["IA3", 41.3, 0.6, 0.0]], note: "Selected methods; the original figure includes more variants." },
  balancing: { rows: [["λ = 0", 68.5, 0.8, -1.4, true], ["λ = 10⁻⁴", 68.1, 0.9, -1.7], ["λ = 10⁻³", 66.8, 1.2, -2.5], ["λ = 10⁻²", 64.6, 1.0, -3.7], ["λ = 10⁻¹", 58.6, -0.9, -8.5]], note: "Adaptation method and parameter count held fixed." }
};

function signed(value, decimals = 2) {
  return `${value > 0 ? "+" : value < 0 ? "−" : ""}${Math.abs(value).toFixed(decimals)}`;
}

for (const chart of document.querySelectorAll("[data-chart]")) {
  const data = chartData[chart.dataset.chart];
  chart.innerHTML = `<div class="chart-title"><strong>Downstream & upstream</strong><span>Higher is better</span></div>
    <div class="chart-legend"><span><i class="legend-swatch downstream"></i>D · Downstream accuracy (%)</span><span><i class="legend-swatch upstream"></i>U · Upstream Δ (pp)</span></div>
    <div class="chart-scales">D: 0–100% <span>U: −10 to +10 pp · zero at center</span></div>
    ${data.rows.map(([label, downstream, mmluDelta, ifevalDelta, highlight]) => {
      const upstream = (mmluDelta + ifevalDelta) / 2;
      const details = `MMLU-Pro: ${signed(mmluDelta, 1)} pp; IFEval: ${signed(ifevalDelta, 1)} pp`;
      return `<div class="chart-row${highlight ? " highlight" : ""}"><span class="chart-label">${label}</span><div class="chart-pair">
        <div class="chart-series"><span class="chart-series-label" aria-hidden="true">D</span><span class="chart-track" aria-hidden="true"><span class="chart-bar" style="--bar-width:${downstream}%"></span></span><span class="chart-value"><span class="sr-only">Downstream accuracy: </span>${downstream.toFixed(1)}<span class="sr-only"> percent</span></span></div>
        <div class="chart-series upstream" title="${details}"><span class="chart-series-label" aria-hidden="true">U</span><span class="chart-track" aria-hidden="true"><span class="chart-zero"></span><span class="chart-bar" style="--bar-width:${Math.abs(upstream) * 5}%;--bar-left:${50 + Math.min(upstream, 0) * 5}%"></span></span><span class="chart-value"><span class="sr-only">Mean upstream change: </span>${signed(upstream)}<span class="sr-only"> percentage points. ${details}</span></span></div>
      </div></div>`;
    }).join("")}
    <p class="chart-footnote">${data.note}</p>`;
}

const tabs = [...document.querySelectorAll("[data-tab]")];
const panels = [...document.querySelectorAll("[data-panel]")];
const tabList = document.querySelector(".results-tabs");
tabList.setAttribute("role", "tablist");

for (const tab of tabs) {
  tab.setAttribute("role", "tab");
  tab.setAttribute("aria-controls", `panel-${tab.dataset.tab}`);
  tab.addEventListener("click", event => {
    event.preventDefault();
    selectTab(tab.dataset.tab);
  });
  tab.addEventListener("keydown", event => {
    const index = tabs.indexOf(tab);
    let nextIndex;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    selectTab(tabs[nextIndex].dataset.tab);
    tabs[nextIndex].focus({ preventScroll: true });
    tabs[nextIndex].scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
  });
}

for (const panel of panels) {
  panel.setAttribute("role", "tabpanel");
  panel.setAttribute("aria-labelledby", `tab-${panel.dataset.panel}`);
  panel.setAttribute("tabindex", "0");
}

function selectTab(name) {
  if (!tabs.some(tab => tab.dataset.tab === name)) return;
  for (const tab of tabs) {
    const selected = tab.dataset.tab === name;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  }
  for (const panel of panels) panel.hidden = panel.dataset.panel !== name;
}

selectTab("position");

for (const link of document.querySelectorAll("[data-jump-tab]")) {
  link.addEventListener("click", () => selectTab(link.dataset.jumpTab));
}

function applyPanelHash() {
  if (location.hash.startsWith("#panel-")) selectTab(location.hash.slice(7));
}
applyPanelHash();
window.addEventListener("hashchange", applyPanelHash);

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.getElementById("site-nav");
function closeMenu() {
  navigation.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}
menuToggle.addEventListener("click", () => {
  const open = navigation.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
navigation.addEventListener("click", event => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && navigation.classList.contains("open")) {
    closeMenu();
    menuToggle.focus();
  }
});

const figureDialog = document.getElementById("figure-dialog");
for (const button of document.querySelectorAll("[data-figure]")) {
  button.addEventListener("click", () => {
    const file = button.dataset.figure;
    const title = button.dataset.title;
    document.getElementById("figure-dialog-title").textContent = title;
    document.getElementById("dialog-image").src = `${file}.png`;
    document.getElementById("dialog-image").alt = button.dataset.alt || button.querySelector("img").alt;
    figureDialog.showModal();
    document.body.classList.add("dialog-open");
    figureDialog.scrollTop = 0;
  });
}
document.getElementById("close-dialog").addEventListener("click", () => figureDialog.close());
figureDialog.addEventListener("click", event => {
  if (event.target !== figureDialog) return;
  const bounds = figureDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) figureDialog.close();
});
figureDialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));

const copyButton = document.getElementById("copy-citation");
copyButton.addEventListener("click", async () => {
  const text = document.getElementById("bibtex").textContent;
  let copied = false;
  try {
    await navigator.clipboard.writeText(text);
    copied = true;
  } catch {
    // File previews may not expose the Clipboard API.
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(document.getElementById("bibtex"));
    selection.removeAllRanges();
    selection.addRange(range);
    copied = document.execCommand("copy");
    if (copied) selection.removeAllRanges();
  }
  copyButton.querySelector("span").textContent = copied ? "Copied!" : "Select and copy below";
  copyButton.querySelector("use").setAttribute("href", copied ? "#i-check" : "#i-copy");
  document.getElementById("copy-status").textContent = copied ? "Citation copied to clipboard." : "Citation selected. Use your browser’s copy command.";
  window.setTimeout(() => {
    copyButton.querySelector("span").textContent = "Copy citation";
    copyButton.querySelector("use").setAttribute("href", "#i-copy");
  }, 2500);
});

const config = window.PROJECT_CONFIG || {};
function publicUrl(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}
for (const [id, key] of [["paper-link", "paperUrl"], ["code-link", "codeUrl"]]) {
  const url = publicUrl(config[key]);
  if (!url) continue;
  const link = document.getElementById(id);
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener";
  link.removeAttribute("aria-disabled");
  link.querySelector(".coming-soon").remove();
}
for (const author of document.querySelectorAll("[data-author]")) {
  const url = publicUrl(config.authorUrls?.[author.dataset.author]);
  if (!url) continue;
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener";
  link.append(...author.childNodes);
  author.append(link);
}

if ("IntersectionObserver" in window) {
  const navLinks = [...navigation.querySelectorAll("a")];
  const sectionObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const link of navLinks) link.classList.toggle("current", link.hash === `#${entry.target.id}`);
    }
  }, { rootMargin: "-10% 0px -65% 0px", threshold: 0 });
  for (const id of ["overview", "findings", "results", "analysis", "citation"]) sectionObserver.observe(document.getElementById(id));
}
