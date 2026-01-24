export const loadingDataLayout = (
  state,
  loadingMessage = "جاري التحميل...",
) => {
  const existingLayout = document.querySelector(".loading-layout");

  if (state === "off") {
    if (existingLayout) {
      existingLayout.remove();
      // إرجاع السكرول لحالته الطبيعية الأصلية
      document.body.style.overflow = "";
      document.body.style.paddingRight = ""; // إزالة التعويض (اختياري)
    }
    return;
  }

  if (existingLayout) return;

  // حساب عرض شريط السكرول لمنع اهتزاز الصفحة (اختياري)
  const scrollBarWidth =
    window.innerWidth - document.documentElement.clientWidth;

  const loadingLayout = document.createElement("div");
  loadingLayout.classList.add("loading-layout");

  loadingLayout.innerHTML = `
    <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 backdrop-blur-[4px] transition-all">
        <div class="flex flex-col items-center gap-4">
            <div class="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600"></div>
            <span class="text-gray-700 font-medium animate-pulse">${loadingMessage}</span>
        </div>
    </div>`;

  document.body.style.overflow = "hidden";
  // منع اهتزاز الشاشة عند اختفاء السكرول
  if (scrollBarWidth > 0) {
    document.body.style.paddingRight = `${scrollBarWidth}px`;
  }

  document.body.appendChild(loadingLayout);
};
