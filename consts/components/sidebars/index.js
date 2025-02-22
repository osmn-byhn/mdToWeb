import { returnAutoHeightSideBar } from "./autoHeightSidebar.js";
import { returnFullHeightSideBar } from "./fullHeigthSidebar.js";

export function returnSidebar(content, type) {
  switch (type) {
    case "Auto Height Sidebar":
      return returnAutoHeightSideBar(content);
    default:
      return returnFullHeightSideBar(content);
  }
}
