import type { AnimatedIconComponent } from "../types"
import HomeIcon from "./HomeIcon"
import DashboardIcon from "./DashboardIcon"
import LibraryIcon from "./LibraryIcon"
import BookmarksIcon from "./BookmarksIcon"
import ShelvesIcon from "./ShelvesIcon"
import AuthorsIcon from "./AuthorsIcon"
import ReadingIcon from "./ReadingIcon"
import TrialsIcon from "./TrialsIcon"
import BookClubsIcon from "./BookClubsIcon"
import ExploreIcon from "./ExploreIcon"
import TimelinesIcon from "./TimelinesIcon"
import FriendsIcon from "./FriendsIcon"
import CommunityIcon from "./CommunityIcon"
import ShopIcon from "./ShopIcon"
import SealsIcon from "./SealsIcon"
import ProfileIcon from "./ProfileIcon"

export const sharedIconRegistry: Record<string, AnimatedIconComponent> = {
  Home: HomeIcon,
  Dashboard: DashboardIcon,
  Library: LibraryIcon,
  Bookmarks: BookmarksIcon,
  "My Shelves": ShelvesIcon,
  Authors: AuthorsIcon,
  Reader: ReadingIcon,
  Reading: ReadingIcon,
  Quizzes: TrialsIcon,
  Audio: ReadingIcon,
  "Virgil Guide": CommunityIcon,
  "Book Clubs": BookClubsIcon,
  Explore: ExploreIcon,
  Timelines: TimelinesIcon,
  Friends: FriendsIcon,
  Community: CommunityIcon,
  Achievements: SealsIcon,
  Seals: SealsIcon,
  Shop: ShopIcon,
  Profile: ProfileIcon,
}
