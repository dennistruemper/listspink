const lightBgClr = 'pink-100';
const darkBgClr = 'purple-900';
const lightItemBgClr = 'pink-300';
const darkItemBgClr = 'purple-700';
const lightPrimaryClr = 'purple-500';
const darkPrimaryClr = 'pink-500';
const lightTextClr = 'gray-900';
const darkTextClr = 'gray-300';
const lightFadedTextClr = 'gray-600';
const darkFadetTextClr = 'gray-400';

export const background = ` ${lightBgClr} dark:bg-${darkBgClr}`;
export const backgroundBlur = ' bg-gray-400/60 dark:bg-gray-900/70 backdrop-blur';
export const contrastBackground = ' bg-gray-800 dark:bg-gray-200';
export const divideWithBackground = ` divide-${lightBgClr} dark:divide-${darkBgClr}`;
export const itemBackground = ` bg-${lightItemBgClr} dark:bg-${darkItemBgClr}`;
export const itemHoverBackground =
	itemBackground + ` lg:hover:bg-${darkBgClr} lg:dark:hover:bg-${lightBgClr}`; // lg:hover:bg-pink-500 lg:dark:hover:bg-purple-800';
export const textColor = ` text-${lightTextClr} dark:text-${darkTextClr}`;
export const textHoverColor =
	textColor + ` lg:group-hover:text-${darkTextClr} lg:group-hover:dark:text-${lightTextClr}`;
export const textFadedColor = ` text-${lightFadedTextClr} dark:text-${darkFadetTextClr}`;
export const textFadedHoverColor =
	textFadedColor +
	` lg:group-hover:text-${darkFadetTextClr} lg:group-hover:dark:text-${lightFadedTextClr}`;
export const textSecondaryColor = ` text-${lightPrimaryClr} dark:text-${darkPrimaryClr}`;
export const ringFocus = `focus:ring-${lightPrimaryClr} dark:focus:ring-${darkPrimaryClr}`;
