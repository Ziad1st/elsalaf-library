import { API_URL } from "./utils/API_URL.js";
import { DomRenderHtml } from "./utils/DomRender.js";
import { loadingDataLayout } from "./utils/loadingDataLayout.js";
import { fetchCategories } from "./utils/fetchCategories.js";

loadingDataLayout("on", "جاري تحميل أقسام الكتب...");
let categories = [];
const categoryCard = (cat) => `
        <a href="library-books.html?category=${cat.id}" class="group">
            <div class="bg-white rounded-2xl p-8 shadow-sm border border-transparent hover:border-[#8e735b] hover:shadow-xl transition-all duration-300 text-center relative overflow-hidden">
                
                <div class="absolute -right-4 -top-4 text-gray-50 text-6xl transform rotate-12 group-hover:scale-110 transition-transform">
                    <i class="fa-solid fa-arrow-left mr-1"></i>
                </div>

                <div class="relative z-10">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white text-2xl shadow-lg transition-transform group-hover:scale-110" 
                         style="background-color: #8e735b">
                        <i class="fa-solid fa-book-bookmark"></i>
                    </div>
                    
                    <h3 class="text-xl font-bold text-slate-800 mb-2">${cat.name}</h3>
                    <p class="text-sm text-slate-400">يحتوي على ${cat.bookCount} كتاباً</p>
                    
                    <div class="mt-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span class="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                            تصفح القسم <i class="fa-solid fa-arrow-left mr-1"></i>
                        </span>
                    </div>
                </div>
            </div>
        </a>
    `;
try {
  categories = await fetchCategories();
} catch (error) {
  console.error(error);
} finally {
  document.getElementById("categories-grid").innerHTML = DomRenderHtml(
    "array",
    categoryCard,
    categories,
  );
  setTimeout(() => {
    loadingDataLayout("off");
  }, 1000);
}
