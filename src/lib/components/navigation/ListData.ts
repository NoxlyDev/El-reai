import * as m from '$lib/paraglide/messages.js';

export interface NavItem {
	name: string;
	href: string;
	description?: string;
	children?: NavItem[];
}

export function getListData(): NavItem[] {
	return [
		{ name: m.nav_home(), href: '/' },
		{ name: m.nav_blog(), href: '/blog' },
		{ name: m.nav_about_us(), href: '/about' },
		{
			name: m.nav_learn(),
			href: '/learn',
			children: [
				{
					name: m.nav_learn_explore(),
					href: '/learn',
					description: m.nav_learn_explore_desc()
				},
				{
					name: m.nav_learn_characters(),
					href: '/learn/characters',
					description: m.nav_learn_characters_desc(),
					children: [
						{ name: m.nav_learn_spirits(), href: '/learn/characters/spirits' },
						{ name: m.nav_learn_npcs(), href: '/learn/characters/npcs' },
						{ name: m.nav_learn_monsters(), href: '/learn/characters/monsters' },
						{ name: m.nav_learn_bosses(), href: '/learn/characters/bosses' }
					]
				},
				{
					name: m.nav_learn_items(),
					href: '/learn/items',
					description: m.nav_learn_items_desc(),
					children: [
						{ name: m.nav_learn_weapons(), href: '/learn/items/weapons' },
						{ name: m.nav_learn_soulstones(), href: '/learn/items/soulstones' },
						{ name: m.nav_learn_consumables(), href: '/learn/items/consumables' },
						{ name: m.nav_learn_quest_items(), href: '/learn/items/quest-items' },
						{ name: m.nav_learn_equipment(), href: '/learn/items/equipment' },
						{ name: m.nav_learn_materials(), href: '/learn/items/materials' }
					]
				},
				{
					name: m.nav_learn_locations(),
					href: '/learn/locations',
					description: m.nav_learn_locations_desc(),
					children: [
						{ name: m.nav_learn_cities(), href: '/learn/locations/cities' },
						{ name: m.nav_learn_dungeons(), href: '/learn/locations/dungeons' },
						{ name: m.nav_learn_infinite_city(), href: '/learn/locations/infinite-city' }
					]
				},
				{
					name: m.nav_learn_lore(),
					href: '/learn/lore',
					description: m.nav_learn_lore_desc(),
					children: [{ name: m.nav_learn_ethereals(), href: '/learn/lore/ethereals' }]
				},
				{
					name: m.nav_learn_skills(),
					href: '/learn/skills',
					description: m.nav_learn_skills_desc()
				},
				{
					name: m.nav_learn_gameplay(),
					href: '/learn/gameplay',
					description: m.nav_learn_gameplay_desc()
				},
				{
					name: m.nav_learn_guides(),
					href: '/learn/guides',
					description: m.nav_learn_guides_desc()
				}
			]
		},
		{
			name: m.nav_press_kit(),
			href: '/press-kit',
			children: [
				{
					name: m.nav_press_browse(),
					href: '/press-kit',
					description: m.nav_press_browse_desc()
				},
				{
					name: m.nav_press_gdd(),
					href: '/game-design-document',
					description: m.nav_press_gdd_desc()
				}
			]
		},
		{
			name: m.nav_contribute(),
			href: '/contribute',
			children: [
				{
					name: m.nav_contribute_how(),
					href: '/contribute',
					description: m.nav_contribute_how_desc()
				},
				{
					name: m.nav_contribute_backers(),
					href: '/contribute/backers',
					description: m.nav_contribute_backers_desc()
				},
				{
					name: m.nav_contribute_github(),
					href: 'https://github.com/Quaint-Studios/Reia',
					description: m.nav_contribute_github_desc()
				},
				{
					name: m.nav_contribute_jobs(),
					href: '/jobs',
					description: m.nav_contribute_jobs_desc()
				}
			]
		}
	];
}

export default getListData();
