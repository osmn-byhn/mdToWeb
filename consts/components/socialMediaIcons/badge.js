export function returnSocialMediaBadge(socialLinks) {
  return `<div class="flex gap-3">
      ${socialLinks
        .map(
          (social) =>
            `<a href="${social.url}" target="_blank" class=" flex gap-2 w-8 h-8 rounded-sm bg-${social.bgColor} text-white items-center justify-center">
              <i class="bi ${social.icon} text-xl p-4"></i>
            </a>`
        )
        .join("")}
    </div>`;
}
