// User levels
export const USER_LEVEL_ANONYMOUS = 0;
export const USER_LEVEL_RESTRICTED = 10;
export const USER_LEVEL_MEMBER = 20;
export const USER_LEVEL_GOLD = 30;
export const USER_LEVEL_PLATINUM = 31;
export const USER_LEVEL_BUILDER = 32;
export const USER_LEVEL_MODERATOR = 40;
export const USER_LEVEL_ADMIN = 50;
export const USER_LEVEL_OWNER = 60;

// Maximum page that can be browsed
export function GET_MAX_PAGE (level = USER_LEVEL_ANONYMOUS) {
	switch (true) {
		case level <= USER_LEVEL_MEMBER: return 1000;
		case level <= USER_LEVEL_GOLD: return 2000;
		case level >= USER_LEVEL_PLATINUM: return 5000;
	}
}

// Tag category
export const TAG_CATEGORY_GENERAL = 0;
export const TAG_CATEGORY_ARTIST = 1;
export const TAG_CATEGORY_COPYRIGHT = 3;
export const TAG_CATEGORY_CHARACTER = 4;
export const TAG_CATEGORY_META = 5;

// Post image constraints
export const POST_IMAGE_SMALL_SIZE = 150;
export const POST_IMAGE_LARGE_SIZE = 850;

export function GET_IMAGE_CEIL (width, height, next) {
	if (width <= next && height <= next) {
		return [width, height, 1];
	}

	return GET_IMAGE_SIZE(width, height, next);
}

export function GET_IMAGE_SIZE (width, height, next) {
	const ratio = Math.min((next / width), (next / height));

	return [(width * ratio), (height * ratio), ratio];
}
