export function returnSocialMediaHeaderIcon(socialLinks) {
  return `
    <div class="relative">
      <div class="hidden md:flex gap-3">
        ${socialLinks
          .map((social) => {
            const textColor = ["GitHub", "Twitter", "Web", "Other"].includes(social.name)
              ? "text-black dark:text-white"
              : `text-[${social.bgColor}]`;
            return `<a href="${social.url}" target="_blank" class="flex w-8 h-8 rounded-md items-center justify-center">
                <i class="${social.icon} text-xl ${textColor}"></i>
              </a>`;
          })
          .join("")}
      </div>

      <button class="md:hidden flex items-center justify-center w-8 h-8 rounded-md" onclick="toggleSocialMenu(event)">
        <i class="bi bi-three-dots text-black dark:text-white text-xl"></i>
      </button>
      
      <div class="hidden md:hidden absolute max-h-[50vh] overflow-y-auto right-0 top-10 bg-white dark:bg-black p-2 rounded-md shadow-md flex flex-col gap-2">
        ${socialLinks
          .map((social) => {
            const textColor = ["GitHub", "Twitter", "Web", "Other"].includes(social.name)
              ? "text-black dark:text-white"
              : `text-[${social.bgColor}]`;
            return `<a href="${social.url}" target="_blank" class="flex w-8 h-8 rounded-md items-center justify-center">
                <i class="${social.icon} text-xl ${textColor}"></i>
              </a>`;
          })
          .join("")}
      </div>
    </div>

    <script>
      function toggleSocialMenu(event) {
        event.stopPropagation();
        const menu = event.currentTarget.nextElementSibling;
        menu.classList.toggle('hidden');
      }
      document.addEventListener('click', function (event) {
        document.querySelectorAll('.relative > div').forEach(menu => {
          if (!menu.classList.contains('hidden')) menu.classList.add('hidden');
        });
      });
    </script>
  `;
}
