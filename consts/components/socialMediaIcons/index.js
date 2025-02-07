import { returnSocialMediaOnlyIcon } from "./onlyIcon.js";
import { returnSocialMediaBadge } from "./badge.js";
import { returnSocialMediaBadgeUsername } from "./badgeUsername.js";
import { returnSocialMediaHeaderIcon } from "./headerIcon.js";
import { returnSocialMediaVerticalFixed } from "./verticalFixed.js";
export function returnSocialMedia(socialLinks, type) {
  switch (type) {
    case "Badge":
      return returnSocialMediaBadge(socialLinks);
    case "Badge and Username":
      return returnSocialMediaBadgeUsername(socialLinks);
    case "Header Static Icon":
      return returnSocialMediaHeaderIcon(socialLinks);
    case "Only Icon":
      return returnSocialMediaOnlyIcon(socialLinks);
    default:
      return returnSocialMediaVerticalFixed(socialLinks);
  }
}
