export function returnFullHeightSideBar(content) {
    // Geçici bir HTML container oluştur
    const container = document.createElement("div");
    container.innerHTML = content;

    // Başlıkları (h1-h6) bul
    const headings = container.querySelectorAll("h1, h2, h3, h4, h5, h6");

    // Türkçe karakterleri İngilizce'ye çevirme fonksiyonu
    function slugify(text) {
        return text.toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-');
    }

    // Dropdown menü içeriğini oluştur
    let dropdownContent = "<ul class='p-2'>";
    headings.forEach((heading) => {
        const slug = slugify(heading.textContent);
        dropdownContent += `<li><a href="#${slug}" class="block p-2">${heading.textContent}</a></li>`;
    });
    dropdownContent += "</ul>";

    return `
        <div class="flex flex-wrap gap-3 mt-12">
            <div class="relative">
                <button class="bg-gray-200 p-2 rounded-md">Başlıklar</button>
                <div class="absolute hidden bg-white border shadow-md mt-1 rounded-md w-48">
                    ${dropdownContent}
                </div>
            </div>
            ${content}
        </div>
    `;
}
