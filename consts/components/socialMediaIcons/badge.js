export function returnSocialMediaBadge(socialLinks) {
  return `<div class="flex flex-wrap gap-3 mt-12">
      ${socialLinks
        .map((social) => {
          const bgColor =
            social.icon === "bi bi-instagram"
              ? social.bgColor
              : `[${social.bgColor}]`;
          return `<a href="${social.url}" target="_blank" class="flex gap-2 px-3 py-2 rounded-md bg-${bgColor} text-white items-center justify-center whitespace-nowrap">
              <i class="${social.icon} text-xl "></i>
              <span class="text-xl">${social.name}</span>
            </a>`;
        })
        .join("")}
    </div>`;
}
