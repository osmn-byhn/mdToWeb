export function returnSocialMediaOnlyIcon(socialLinks) {
  return `<div class="flex gap-3">
    ${socialLinks
      .map((social) => {
        const bgColor =
          social.icon === "bi-instagram"
            ? social.bgColor
            : `[${social.bgColor}]`;
        return `<a href="${social.url}" target="_blank" class="flex gap-2 w-8 h-8 rounded-md bg-${bgColor} text-white items-center justify-center">
            <i class="bi ${social.icon} text-xl p-4"></i>
          </a>`;
      })
      .join("")}
  </div>`;
}
