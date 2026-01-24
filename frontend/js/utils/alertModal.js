export function showAlert(title, message, type = "success", url = null) {
  // نستخدم Promise واحد فقط يغلف الدالة بالكامل
  return new Promise((resolve) => {
    const themes = {
      success: {
        bg: "bg-emerald-50",
        icon: "fa-check-circle",
        color: "text-emerald-500",
        btn: "bg-emerald-500",
      },
      error: {
        bg: "bg-red-50",
        icon: "fa-circle-xmark",
        color: "text-red-500",
        btn: "bg-red-500",
      },
      warning: {
        bg: "bg-amber-50",
        icon: "fa-triangle-exclamation",
        color: "text-amber-500",
        btn: "bg-amber-500",
      },
    };

    const theme = themes[type] || themes.success;

    const overlay = document.createElement("div");
    overlay.className =
      "fixed inset-0 z-[10000] flex items-center justify-center p-4 overflow-hidden";

    const backdrop = document.createElement("div");
    backdrop.className =
      "absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 transition-opacity duration-300";
    overlay.appendChild(backdrop);

    const container = document.createElement("div");
    container.className =
      "relative bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-[#e0dcd5] p-8 text-center transform scale-90 opacity-0 transition-all duration-300 ease-out";

    let buttonsHTML = `<button id="closeModalBtn" class="w-full py-4 rounded-2xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95">إغلاق</button>`;

    if (url) {
      buttonsHTML = `
        <div class="flex flex-col gap-3">
          <a href="${url}" class="w-full py-4 rounded-2xl font-bold text-white shadow-lg active:scale-95 transition-all hover:brightness-110 flex items-center justify-center gap-2 ${theme.btn}">
            الذهاب إلى الرابط <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
          </a>
          <button id="closeModalBtn" class="text-slate-400 text-sm font-semibold hover:text-slate-600 transition-colors">إلغاء</button>
        </div>`;
    }

    container.innerHTML = `
      <div class="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 ${theme.bg}">
        <i class="fa-solid ${theme.icon} ${theme.color} text-3xl"></i>
      </div>
      <h3 class="text-xl font-bold mb-2 text-slate-800">${title}</h3>
      <p class="text-slate-500 text-sm leading-relaxed mb-8">${message}</p>
      ${buttonsHTML}
    `;

    overlay.appendChild(container);
    document.body.appendChild(overlay);

    // أنيميشن الظهور
    setTimeout(() => {
      backdrop.classList.replace("opacity-0", "opacity-100");
      container.classList.remove("scale-90", "opacity-0");
      container.classList.add("scale-100", "opacity-100");
    }, 10);

    // دالة الإغلاق والـ Resolve
    const close = () => {
      container.classList.replace("scale-100", "scale-90");
      container.classList.add("opacity-0");
      backdrop.classList.replace("opacity-100", "opacity-0");

      setTimeout(() => {
        overlay.remove();
        resolve(true); // هنا نخبر الكود أن المستخدم أغلق النافذة ويمكنك إكمال ما بعد الـ await
      }, 300);
    };

    overlay.querySelector("#closeModalBtn").onclick = close;
    backdrop.onclick = close;
  });
}
