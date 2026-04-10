import { prisma } from './prisma';

const LAUNCH_DATE = new Date(process.env.LAUNCH_DATE || '2026-04-10');

function getMonthsSinceLaunch(): number {
	const now = new Date();
	const msPerDay = 1000 * 60 * 60 * 24;
	const daysSinceLaunch = Math.floor((now.getTime() - LAUNCH_DATE.getTime()) / msPerDay);

	if (daysSinceLaunch <= 30) return 1;
	if (daysSinceLaunch <= 60) return 2;
	return 3;
}

function getIdLength(): number {
	const month = getMonthsSinceLaunch();
	if (month === 1) return 8;
	if (month === 2) return 9;
	return 10;
}

function generateRandomNumericId(length: number): string {
	const min = Math.pow(10, length - 1);
	const max = Math.pow(10, length) - 1;
	return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

export async function generateUniqueCustomId(): Promise<string> {
	const length = getIdLength();
	let id = generateRandomNumericId(length);
	let attempts = 0;
	const maxAttempts = 100;

	while (attempts < maxAttempts) {
		const existing = await prisma.user.findUnique({ where: { custom_id: id } });
		if (!existing) return id;
		id = generateRandomNumericId(length);
		attempts++;
	}

	throw new Error('Failed to generate a unique custom ID after maximum attempts');
}
