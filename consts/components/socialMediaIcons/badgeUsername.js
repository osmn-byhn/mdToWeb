export function returnSocialMediaBadgeUsername(socialLinks) {
  return `<div class="flex flex-wrap gap-3 mt-12">
    ${socialLinks
      .map((social) => {
        let username;
        if (social.value === "web" || social.value === "other") {
          const domainMatch = social.url.match(/https?:\/\/(www\.)?([^\/]+)/);
          username = domainMatch ? domainMatch[2] : social.url;
        } else {
          username = social.url.replace(/https?:\/\/(www\.)?[^\/]+\//, "").replace(/\/$/, "");
        }
        const bgColor =
          social.icon === "bi bi-instagram"
            ? social.bgColor
            : `[${social.bgColor}]`;
        return `<a href="${social.url}" target="_blank" class="flex gap-2 px-3 py-2 rounded-md bg-${bgColor} text-white items-center justify-center whitespace-nowrap">
            <i class="${social.icon} text-xl"></i>
            <span class="text-xl">${username}</span>
          </a>`;
      })
      .join("")}
  </div>`;
}
