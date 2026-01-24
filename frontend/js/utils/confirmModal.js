export const confirmModal = (message, title, nextWindowUrl) => {
  return new Promise((resolve) => {
    // نغلف الدالة بوعد (Promise)
    const overlay = document.createElement("div");
    overlay.className =
      "fixed inset-0 z-[10000] bg-slate-900/50 flex items-center justify-center p-4 overflow-hidden";

    overlay.innerHTML = `
      <div class="absolute inset-0 backdrop-blur-sm transition-opacity duration-300"></div>
      <div class="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-[#e0dcd5] p-8 transform transition-all duration-300 ease-out">
        <div class="w-16 h-16 rounded-full bg-[#e0dcd5]/50 mx-auto flex items-center justify-center mb-6">
          <i class="fa-solid text-[#8e735b] fa-circle-question text-4xl text-center"></i>
        </div>
        <div class="text-center mb-8">
          <h3 class="text-xl font-bold text-slate-800 mb-2">${title}</h3>
          <p class="text-slate-500 text-sm leading-relaxed">${message}</p>
        </div>
        <div class="flex gap-3">
          <button id="confirmBtnAction" class="cursor-pointer w-full flex px-4 items-center justify-center text-center gap-2 py-4 rounded-2xl font-bold text-white bg-[#8e735b] shadow-sm shadow-[#8e735b]/50 hover:bg-[#8e735b]/80 transition-all active:scale-95">
            <span class="flex items-center justify-center w-6 h-6 bg-white text-[#8e735b] rounded-[10px]">
              <i class="fa-solid fa-check   "></i>
            </span>
             تأكيد
          </button>
          <button id="cancelBtnAction" class="cursor-pointer w-full flex px-4 items-center justify-center text-center gap-2 py-4 rounded-2xl font-bold text-[#8e735b] bg-[#e0dcd5] hover:bg-[#e0dcd5]/80 transition-all active:scale-95">
            <span class="flex items-center justify-center w-6 h-6 bg-[#8e735b] text-white rounded-[10px]">
              <i class="fa-solid fa-rotate-right text-sm "></i>
            </span> تراجع
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // استخدام الـ ID لضمان دقة الاختيار داخل الـ Overlay
    const confirmBtn = overlay.querySelector("#confirmBtnAction");
    const cancelBtn = overlay.querySelector("#cancelBtnAction");

    confirmBtn.addEventListener("click", () => {
      overlay.remove();
      if (nextWindowUrl) {
        setTimeout(() => (window.location.href = nextWindowUrl), 500);
      }
      resolve(true); // نرسل القيمة الحقيقية للوعد
    });

    cancelBtn.addEventListener("click", () => {
      overlay.remove();
      resolve(false); // نرسل القيمة الزائفة للوعد
    });
  });
};
