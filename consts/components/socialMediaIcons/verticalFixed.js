export function returnSocialMediaVerticalFixed(socialLinks) {
  return `<div class="flex flex-col gap-3 fixed right-4 lg:left-4 top-1/3">
      ${socialLinks
      .map((social) => {
        const bgColor =
          social.icon === "bi bi-instagram"
            ? social.bgColor
            : `[${social.bgColor}]`;
        return `<a href="${social.url}" target="_blank" class="flex gap-2 w-8 h-8 rounded-md bg-${bgColor} text-white items-center justify-center opacity-[0.5] hover:opacity-100">
            <i class="${social.icon} text-xl p-4"></i>
          </a>`;
      })
      .join("")}
    </div>`;
}
